// Keep the control the player is touching where it is on screen. Packing a part, a stepper's − / + or a slider
// changes the layout around the control (a card leaves the shelf, the preview above grows, a line of text rewraps),
// and the browser then keeps the scroll offset, not the control: the page or panel appears to jump. `hold(el)` is
// called in the event handler, before the state change; after each commit in the next moments, the nearest scroll
// box (or the window) is moved by exactly how far `el` drifted. When `el` leaves the page (a packed card), `fallback`
// is the anchor instead. A wheel, touch or key scroll by the player drops the hold at once.
import { useCallback, useLayoutEffect, useRef } from 'react';

/** How long after an interaction late commits (an engine re-evaluation, a font swap) are still corrected. */
const HOLD_MS = 600;

interface Anchor {
  els: Element[];
  tops: number[];
  until: number;
}

function scrollBox(el: Element): HTMLElement | undefined {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const oy = getComputedStyle(p).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight) return p;
  }
  return undefined;
}

export function useScrollAnchor() {
  const anchor = useRef<Anchor | undefined>(undefined);

  const correct = useCallback(() => {
    const a = anchor.current;
    if (!a) return;
    if (Date.now() > a.until) {
      anchor.current = undefined;
      return;
    }
    const i = a.els.findIndex((e) => e.isConnected);
    if (i < 0) return;
    const el = a.els[i]!;
    const dy = el.getBoundingClientRect().top - a.tops[i]!;
    if (Math.abs(dy) < 0.5) return;
    const box = scrollBox(el);
    if (box) box.scrollTop += dy;
    else window.scrollBy(0, dy);
  }, []);

  // Every commit of the owning component: put the anchor back where it was.
  useLayoutEffect(correct);

  useLayoutEffect(() => {
    const drop = () => (anchor.current = undefined);
    window.addEventListener('wheel', drop, { passive: true });
    window.addEventListener('touchmove', drop, { passive: true });
    return () => {
      window.removeEventListener('wheel', drop);
      window.removeEventListener('touchmove', drop);
    };
  }, []);

  /** Pin `el` (and `fallback`, used if `el` leaves the page) at their current place on screen. */
  return useCallback(
    (el: Element | null | undefined, fallback?: Element | null) => {
      const els = [el, fallback].filter((e): e is Element => !!e);
      if (els.length === 0) return;
      anchor.current = { els, tops: els.map((e) => e.getBoundingClientRect().top), until: Date.now() + HOLD_MS };
      // A commit made later by another component (App's state, an async re-evaluation) is caught on the next frames.
      if (typeof requestAnimationFrame === 'function') {
        let n = 0;
        const tick = () => {
          correct();
          if (anchor.current && ++n < 20) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    [correct],
  );
}
