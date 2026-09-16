// Generador de texto por cadenas de Markov a nivel palabra.
// Orden 3 con backoff a 2 y 1, límites de oración explícitos,
// guardia anti-copia y selección de candidatos por puntaje.

const END = '\u0003';
const SEP = '\u0001';
const MAX_ORDER = 3;
const COPY_WINDOW = 7;
const MAX_SENTENCE_TOKENS = 60;

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'-]*|[,;:]/gu;
const PUNCT_TOKENS = new Set([',', ';', ':']);

export function splitSentences(text) {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?…])\s+/u))
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => /[.!?…]$/u.test(s));
}

export function tokenize(sentence) {
  return sentence.match(WORD_RE) || [];
}

function ngramKey(tokens, start, n) {
  const parts = [];
  for (let i = start; i < start + n; i++) {
    parts.push(tokens[i].toLowerCase());
  }
  return parts.join(SEP);
}

function lastKey(tokens, n) {
  return tokens
    .slice(tokens.length - n)
    .map((t) => t.toLowerCase())
    .join(SEP);
}

export function buildModel(text) {
  const sentences = splitSentences(text)
    .map(tokenize)
    .filter((tokens) => tokens.length >= 4);

  const chains = { 1: new Map(), 2: new Map(), 3: new Map() };
  const copyGrams = new Set();
  const sentenceKeys = new Set();
  const starts = [];

  for (const tokens of sentences) {
    starts.push(tokens.slice(0, Math.min(2, tokens.length)));
    sentenceKeys.add(ngramKey(tokens, 0, tokens.length));
    for (let order = 1; order <= MAX_ORDER; order++) {
      const chain = chains[order];
      for (let i = 0; i + order <= tokens.length; i++) {
        const key = ngramKey(tokens, i, order);
        const next = i + order < tokens.length ? tokens[i + order] : END;
        if (!chain.has(key)) chain.set(key, []);
        chain.get(key).push(next);
      }
    }
    for (let i = 0; i + COPY_WINDOW <= tokens.length; i++) {
      copyGrams.add(ngramKey(tokens, i, COPY_WINDOW));
    }
  }

  return { chains, starts, copyGrams, sentenceKeys, sentences };
}

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function isCorpusCopy(model, tokens) {
  if (tokens.length < COPY_WINDOW) return false;
  return model.copyGrams.has(lastKey(tokens, COPY_WINDOW));
}

// Genera una oración: arranca en un inicio real de oración del corpus,
// avanza con la cadena de mayor orden disponible y termina solo en END.
function generateSentence(model, rng) {
  const tokens = [...pick(model.starts, rng)];
  let ended = false;

  while (tokens.length < MAX_SENTENCE_TOKENS) {
    const copying = isCorpusCopy(model, tokens);
    const maxOrder = Math.min(copying ? MAX_ORDER - 1 : MAX_ORDER, tokens.length);
    let next = null;

    for (let order = maxOrder; order >= 1 && next === null; order--) {
      const options = model.chains[order].get(lastKey(tokens, order));
      if (!options || options.length === 0) continue;
      if (copying) {
        // Preferir continuaciones que rompan la secuencia copiada del corpus.
        const diverging = options.filter((opt) => {
          if (opt === END) return true;
          const probe = [...tokens.slice(-(COPY_WINDOW - 1)), opt];
          return !model.copyGrams.has(probe.map((t) => t.toLowerCase()).join(SEP));
        });
        next = diverging.length > 0 ? pick(diverging, rng) : pick(options, rng);
      } else {
        next = pick(options, rng);
      }
    }

    if (next === null) break;
    if (next === END) {
      ended = true;
      break;
    }
    tokens.push(next);
  }

  return { tokens, ended };
}

function wordCount(tokens) {
  return tokens.filter((t) => !PUNCT_TOKENS.has(t)).length;
}

// Heurísticas de legibilidad: cerrar la oración, largo razonable,
// sin bigramas repetidos internos, sin copiar el corpus casi textual,
// y bonus por mencionar palabras de los inputs de la persona.
function scoreSentence(model, { tokens, ended }, anchorWords) {
  let score = 0;
  const words = wordCount(tokens);

  score += ended ? 40 : -60;
  if (anchorWords.size > 0) {
    let anchors = 0;
    for (const token of tokens) {
      if (anchorWords.has(token.toLowerCase())) anchors++;
    }
    score += Math.min(anchors, 2) * 15;
  }
  if (model.sentenceKeys.has(ngramKey(tokens, 0, tokens.length))) score -= 80;
  if (words >= 6 && words <= 30) score += 20;
  else if (words < 4 || words > 45) score -= 30;

  const bigrams = new Set();
  for (let i = 0; i + 2 <= tokens.length; i++) {
    const bg = ngramKey(tokens, i, 2);
    if (bigrams.has(bg)) score -= 15;
    bigrams.add(bg);
  }

  if (tokens.length >= COPY_WINDOW) {
    let copies = 0;
    let windows = 0;
    for (let i = 0; i + COPY_WINDOW <= tokens.length; i++) {
      windows++;
      if (model.copyGrams.has(ngramKey(tokens, i, COPY_WINDOW))) copies++;
    }
    const copied = copies / windows;
    if (copied > 0.5) score -= 50;
    else if (copied > 0.2) score -= 20;
  }

  return score;
}

// Ensambla la oración con puntuación pegada y mayúscula inicial.
export function renderSentence(tokens) {
  let out = '';
  for (const token of tokens) {
    if (PUNCT_TOKENS.has(token)) out += token;
    else out += (out ? ' ' : '') + token;
  }
  out = out.replace(/[,;:]+$/u, '');
  return out.charAt(0).toUpperCase() + out.slice(1) + '.';
}

export function generateText(
  model,
  { totalWords = 30, rng = Math.random, candidates = 60, anchorTerms = [] } = {}
) {
  if (!model || model.starts.length === 0) return '';

  // Palabras de los inputs (sin las muy cortas: artículos, preposiciones).
  const anchorWords = new Set(
    anchorTerms
      .flatMap((term) => tokenize(term.toLowerCase()))
      .filter((word) => word.length >= 4)
  );

  const scored = [];
  for (let i = 0; i < candidates; i++) {
    const sentence = generateSentence(model, rng);
    if (sentence.tokens.length === 0) continue;
    scored.push({ ...sentence, score: scoreSentence(model, sentence, anchorWords) });
  }
  scored.sort((a, b) => b.score - a.score);

  const chosen = [];
  const seenOpenings = new Set();
  let words = 0;
  for (const candidate of scored) {
    if (words >= totalWords) break;
    const opening = ngramKey(candidate.tokens, 0, Math.min(3, candidate.tokens.length));
    if (seenOpenings.has(opening)) continue;
    seenOpenings.add(opening);
    chosen.push(candidate);
    words += wordCount(candidate.tokens);
  }

  return chosen.map((c) => renderSentence(c.tokens)).join(' ');
}

// Envuelve el texto en líneas de ~wordsPerLine palabras, prefiriendo
// cortar después de un signo de puntuación o fin de oración.
export function layoutLines(text, wordsPerLine) {
  const perLine = Math.max(1, Number(wordsPerLine) || 1);
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = [];

  for (const word of words) {
    current.push(word);
    const atBoundary = /[.,;:!?…]$/u.test(word);
    if ((current.length >= perLine && atBoundary) || current.length >= perLine + 2) {
      lines.push(current.join(' '));
      current = [];
    }
  }
  if (current.length > 0) lines.push(current.join(' '));
  return lines.join('\n');
}

// RNG determinístico para tests (mulberry32).
export function seededRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
