import { useLayoutEffect } from 'react';

const MIN_SIZE = 12;
const MAX_SIZE = 28;

function fits(el, box, size, wrap) {
  el.style.fontSize = `${size}px`;
  el.dataset.wrap = wrap ? 'true' : 'false';
  return el.scrollHeight <= box.clientHeight && el.scrollWidth <= el.clientWidth;
}

function largestFit(el, box, wrap) {
  let lo = MIN_SIZE;
  let hi = MAX_SIZE;
  let best = null;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (fits(el, box, mid, wrap)) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

// Ajusta la letra del poema para llenar la caja. Prefiere que cada verso
// sea una línea en pantalla; si eso obliga a una letra mucho más chica
// que partiendo los versos largos (con sangría), los parte.
function fit(el, box) {
  const single = largestFit(el, box, false);
  const wrapped = largestFit(el, box, true) ?? MIN_SIZE;
  const useSingle = single !== null && single >= wrapped * 0.8;
  fits(el, box, useSingle ? single : wrapped, !useSingle);
}

export function useFitText(textRef, boxRef, text) {
  useLayoutEffect(() => {
    const el = textRef.current;
    const box = boxRef.current;
    if (!el || !box) return undefined;
    fit(el, box);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => fit(el, box));
    observer.observe(box);
    return () => observer.disconnect();
  }, [textRef, boxRef, text]);
}
