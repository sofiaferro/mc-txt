import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getExtract, fetchCorpus } from './wikipedia';

function jsonResponse(body) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('getExtract', () => {
  it('devuelve el extracto cuando el título existe', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        jsonResponse({
          query: { pages: { 123: { title: 'Gato', extract: 'El gato es un felino.' } } },
        })
      )
    );
    expect(await getExtract('gato')).toBe('El gato es un felino.');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('cae a búsqueda cuando el título no existe', async () => {
    const responses = [
      { query: { pages: { '-1': { missing: '' } } } },
      { query: { search: [{ title: 'Gato doméstico' }] } },
      { query: { pages: { 9: { extract: 'Texto del gato doméstico.' } } } },
    ];
    vi.stubGlobal('fetch', vi.fn(() => jsonResponse(responses.shift())));
    expect(await getExtract('gato negro peludo')).toBe('Texto del gato doméstico.');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('devuelve string vacío ante error de red', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))));
    expect(await getExtract('gato')).toBe('');
  });
});

describe('fetchCorpus', () => {
  it('junta extractos y descarta términos sin resultado', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => {
        if (url.includes('perro')) {
          return jsonResponse({ query: { pages: { 1: { extract: 'Perro fiel.' } } } });
        }
        if (url.includes('list=search')) {
          return jsonResponse({ query: { search: [] } });
        }
        return jsonResponse({ query: { pages: { '-1': { missing: '' } } } });
      })
    );
    expect(await fetchCorpus(['perro', 'zzzz-inexistente'])).toBe('Perro fiel.');
  });
});
