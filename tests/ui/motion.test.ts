// @vitest-environment jsdom
// motion.ts: the animations never hold up the game. Without the Web Animations API (jsdom) or under reduced motion,
// a removal and a launch happen at once; with it, the launch waits for its burst and then goes on.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { canAnimate, LAUNCH_MS, launchBurst, popOut } from '../../src/ui/motion';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('motion', () => {
  it('no animation API: pop-out and launch call back at once', () => {
    const el = document.createElement('button');
    expect(canAnimate(el)).toBe(false);
    const done = vi.fn();
    popOut(el, done);
    launchBurst(el, done);
    expect(done).toHaveBeenCalledTimes(2);
  });

  it('reduced motion: skipped even where the API exists', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
    const el = Object.assign(document.createElement('button'), { animate: vi.fn() });
    expect(canAnimate(el)).toBe(false);
  });

  it('with the API: the launch plays its burst, cleans it up, then goes on', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    const el = Object.assign(document.createElement('button'), { animate: vi.fn(() => ({})) });
    document.body.appendChild(el);
    const done = vi.fn();
    launchBurst(el, done);
    expect(done).not.toHaveBeenCalled();
    expect(document.querySelector('.mo-burst')).toBeTruthy();
    vi.advanceTimersByTime(LAUNCH_MS);
    expect(done).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.mo-burst')).toBeNull();
  });
});
