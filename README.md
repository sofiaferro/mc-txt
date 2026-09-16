# mc-txt

Generador de textos que consume la API de Wikipedia y genera texto nuevo con cadenas de Markov. Desarrollado en React + Vite.

https://mc-txt.netlify.app/

## Cómo funciona

1. Cargás cinco inputs (un deseo, un miedo, un olor, un color, una pasión).
2. mc-txt busca los artículos correspondientes en Wikipedia ES (con fallback a búsqueda) y arma un corpus con los extractos.
3. Sobre ese corpus construye cadenas de Markov de orden 3 con backoff a orden 2 y 1, respetando límites de oración.
4. Genera decenas de oraciones candidatas, las puntúa con heurísticas de legibilidad (oraciones completas, largo razonable, sin repeticiones, sin copias textuales del corpus) y muestra las mejores.

La lógica de generación vive en `src/lib/markov.js` y el acceso a Wikipedia en `src/lib/wikipedia.js`, ambos módulos puros con tests.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm test         # tests (Vitest)
npm run build    # build de producción en dist/
```
