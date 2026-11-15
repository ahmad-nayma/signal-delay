// Motion helpers on the Web Animations API (element.animate): native in every browser the game supports, no library.
// CSS handles the rest (hover, panels, screen fades); these are the moves that need two positions or a callback:
// a part gliding from the shelf and snapping into the nose, a part popping out, and the launch shock wave.
// Everything is skipped under reduced motion and where the API is missing (jsdom in the component tests), so the
// state changes at once there and tests never wait on an animation.

/** A spring, sampled: [progress, share of the time] pairs; it overshoots a little, then settles. */
const SPRING: readonly (readonly [number, number])[] = [
  [0, 0], [0.22, 0.09], [0.62, 0.19], [0.95, 0.3], [1.09, 0.39], [1.12, 0.45], [1.08, 0.54], [1.01, 0.64], [0.98, 0.74], [1, 1],
];
const springLinear = `linear(${SPRING.map(([v, t]) => `${v} ${t * 100}%`).join(', ')})`;
/** Elastic snap for the Web Animations API: the spring as CSS `linear()` where supported, else an overshooting curve. */
export const SNAP_EASING =
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timing-function', springLinear) ? springLinear : 'cubic-bezier(0.34, 1.56, 0.64, 1)';
export const SNAP_MS = 520;
export const OUT_MS = 180;
export const LAUNCH_MS = 560;

export function canAnimate(el: Element | null | undefined): el is HTMLElement {
  if (!el || typeof (el as HTMLElement).animate !== 'function') return false;
  return !(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

/**
 * FLIP: `el` has just been drawn at its new place; make it start where `from` was (the shelf card the player tapped)
 * and glide in, shrinking from the card's size, then snap into its slot with a little squash.
 */
export function glideIn(el: Element | null | undefined, from: DOMRect | undefined) {
  if (!canAnimate(el)) return;
  const to = el.getBoundingClientRect();
  if (!from || to.width === 0) {
    el.animate([{ transform: 'scale(0.4)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: SNAP_MS, easing: SNAP_EASING });
    return;
  }
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  const s = Math.min(1.4, Math.max(0.3, from.height / to.height));
  el.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.6, offset: 0 },
      { transform: 'translate(0, 0) scale(1.06, 0.94)', opacity: 1, offset: 0.78 },
      { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 1 },
    ],
    { duration: SNAP_MS, easing: SNAP_EASING },
  );
}

/** Pop `el` out (shrink and fade), then run `done`; at once where there is no animation. */
export function popOut(el: Element | null | undefined, done: () => void) {
  if (!canAnimate(el)) return done();
  const a = el.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0.6)', opacity: 0 }], { duration: OUT_MS, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' });
  a.onfinish = done;
  a.oncancel = done;
}

/**
 * The launch: the key shakes, a shock wave rings out from it and sparks fly, then `done` (the next screen).
 * The wave and the sparks are throw-away elements on the page, removed when they finish.
 */
export function launchBurst(el: Element | null | undefined, done: () => void) {
  if (!canAnimate(el)) return done();
  const r = el.getBoundingClientRect();
  const layer = document.createElement('div');
  layer.className = 'mo-burst';
  layer.style.left = `${r.left + r.width / 2}px`;
  layer.style.top = `${r.top + r.height / 2}px`;
  layer.innerHTML = `<span class="mo-wave"></span><span class="mo-wave w2"></span>${'<span class="mo-spark"></span>'.repeat(12)}`;
  document.body.appendChild(layer);
  el.animate(
    [{ transform: 'translate(0,0)' }, { transform: 'translate(-3px,1px)' }, { transform: 'translate(3px,-1px)' }, { transform: 'translate(-2px,0)' }, { transform: 'translate(0,0) scale(1.04)' }, { transform: 'scale(1)' }],
    { duration: LAUNCH_MS * 0.7, easing: 'ease-out' },
  );
  setTimeout(() => {
    layer.remove();
    done();
  }, LAUNCH_MS);
}

/** A soft cross-fade of the whole page (the language switch). */
export function crossFade() {
  const root = typeof document !== 'undefined' ? document.getElementById('root') : null;
  if (!canAnimate(root)) return;
  root.animate([{ opacity: 0.25, filter: 'blur(2px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 320, easing: 'ease-out' });
}
