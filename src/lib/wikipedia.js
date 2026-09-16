// Corpus desde Wikipedia ES: extracto completo en texto plano por término,
// con fallback a búsqueda cuando el título exacto no existe.

const API = 'https://es.wikipedia.org/w/api.php';
const MAX_CHARS_PER_TERM = 8000;

function apiUrl(params) {
  const query = new URLSearchParams({
    format: 'json',
    origin: '*',
    ...params,
  });
  return `${API}?${query.toString()}`;
}

// Elimina títulos de sección tipo "== Historia ==" del texto plano.
function stripHeadings(text) {
  return text.replace(/^\s*=+[^=\n]+=+\s*$/gmu, '');
}

// Descarta líneas de boilerplate de Wikipedia (enlaces a proyectos hermanos, etc.).
const BOILERPLATE_RE =
  /Wikispecies|Wikimedia|Wikcionario|Wikiquote|Wikisource|Véase también|Portal:|Categoría:|Datos:|Multimedia:/iu;

function stripBoilerplate(text) {
  return text
    .split('\n')
    .filter((line) => !BOILERPLATE_RE.test(line))
    .join('\n');
}

function truncateAtSentence(text, maxChars) {
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastEnd = cut.lastIndexOf('. ');
  return lastEnd > 0 ? cut.slice(0, lastEnd + 1) : cut;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Wikipedia respondió ${response.status}`);
  return response.json();
}

async function fetchExtractByTitle(title) {
  const data = await fetchJson(
    apiUrl({
      action: 'query',
      prop: 'extracts',
      explaintext: '1',
      redirects: '1',
      titles: title,
    })
  );
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined || !page.extract) return '';
  return page.extract;
}

async function searchTitle(term) {
  const data = await fetchJson(
    apiUrl({
      action: 'query',
      list: 'search',
      srsearch: term,
      srlimit: '1',
    })
  );
  return data?.query?.search?.[0]?.title || '';
}

// Devuelve el extracto para un término, o '' si no hay resultado.
export async function getExtract(term) {
  try {
    let extract = await fetchExtractByTitle(term);
    if (!extract) {
      const title = await searchTitle(term);
      if (title) extract = await fetchExtractByTitle(title);
    }
    return truncateAtSentence(stripBoilerplate(stripHeadings(extract)), MAX_CHARS_PER_TERM);
  } catch {
    return '';
  }
}

const MIN_BALANCE_CHARS = 3000;

// Junta el corpus de todos los términos; un término sin resultado no rompe el resto.
// Balancea el aporte de cada término para que un artículo largo no domine el texto:
// recorta todos al tamaño del extracto más chico, con un piso razonable.
export async function fetchCorpus(terms) {
  const extracts = (await Promise.all(terms.map(getExtract))).filter(Boolean);
  if (extracts.length === 0) return '';
  const shortest = Math.min(...extracts.map((e) => e.length));
  const limit = Math.max(MIN_BALANCE_CHARS, shortest);
  return extracts.map((e) => truncateAtSentence(e, limit)).join(' ');
}
