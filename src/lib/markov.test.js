import { describe, it, expect } from 'vitest';
import {
  splitSentences,
  tokenize,
  buildModel,
  generateText,
  renderSentence,
  layoutLines,
  seededRng,
} from './markov';

const CORPUS = `El gato negro duerme sobre el tejado rojo. El gato blanco corre por el jardín grande.
El perro viejo ladra al gato negro todas las noches. La luna llena ilumina el tejado rojo del barrio.
El jardín grande tiene flores amarillas, rosas y un limonero. La casa del barrio tiene un tejado rojo muy antiguo.
El gato negro y el perro viejo juegan en el jardín. Las flores amarillas crecen junto al limonero de la casa.
La noche cubre el barrio con una luz azul. El tejado rojo brilla bajo la luna llena de enero.`;

describe('splitSentences', () => {
  it('separa por puntuación final', () => {
    const sentences = splitSentences('Hola mundo. ¿Todo bien? Sí, todo bien.');
    expect(sentences).toHaveLength(3);
    expect(sentences[0]).toBe('Hola mundo.');
  });
});

describe('tokenize', () => {
  it('conserva comas como tokens y palabras con acentos', () => {
    expect(tokenize('flores amarillas, rosas y un limonero')).toEqual([
      'flores',
      'amarillas',
      ',',
      'rosas',
      'y',
      'un',
      'limonero',
    ]);
    expect(tokenize('El niño comió ñoquis')).toEqual(['El', 'niño', 'comió', 'ñoquis']);
  });
});

describe('buildModel', () => {
  it('construye cadenas de orden 1 a 3 e inicios de oración', () => {
    const model = buildModel(CORPUS);
    expect(model.starts.length).toBeGreaterThan(0);
    expect(model.chains[1].size).toBeGreaterThan(0);
    expect(model.chains[2].size).toBeGreaterThan(0);
    expect(model.chains[3].size).toBeGreaterThan(0);
  });

  it('devuelve modelo vacío con texto vacío', () => {
    const model = buildModel('');
    expect(model.starts).toHaveLength(0);
  });
});

describe('generateText', () => {
  it('es determinístico con RNG seedeado', () => {
    const model = buildModel(CORPUS);
    const a = generateText(model, { totalWords: 20, rng: seededRng(42) });
    const b = generateText(model, { totalWords: 20, rng: seededRng(42) });
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('produce oraciones completas: mayúscula inicial y punto final', () => {
    const model = buildModel(CORPUS);
    const text = generateText(model, { totalWords: 30, rng: seededRng(7) });
    const sentences = text.split('. ').filter(Boolean);
    for (const sentence of sentences) {
      expect(sentence.charAt(0)).toBe(sentence.charAt(0).toUpperCase());
    }
    expect(text.endsWith('.')).toBe(true);
  });

  it('solo usa palabras del corpus', () => {
    const model = buildModel(CORPUS);
    const text = generateText(model, { totalWords: 30, rng: seededRng(3) });
    const corpusWords = new Set(
      CORPUS.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu)
    );
    const generated = text.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu);
    for (const word of generated) {
      expect(corpusWords.has(word)).toBe(true);
    }
  });

  it('devuelve string vacío con modelo vacío', () => {
    expect(generateText(buildModel(''), { totalWords: 10 })).toBe('');
  });
});

describe('renderSentence', () => {
  it('pega la puntuación y capitaliza', () => {
    expect(renderSentence(['flores', 'amarillas', ',', 'rosas'])).toBe(
      'Flores amarillas, rosas.'
    );
  });

  it('no deja puntuación colgando al final', () => {
    expect(renderSentence(['el', 'gato', ','])).toBe('El gato.');
  });
});

describe('layoutLines', () => {
  it('corta líneas prefiriendo límites de puntuación', () => {
    const text = 'Uno dos tres, cuatro cinco. Seis siete ocho nueve diez.';
    const lines = layoutLines(text, 3).split('\n');
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) {
      expect(line.split(' ').length).toBeLessThanOrEqual(5);
    }
  });
});
