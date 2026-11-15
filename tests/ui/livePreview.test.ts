// LIVE DESIGN PREVIEW layout (components/sd/LiveDesignPreview.tsx): the modules fill the whole rocket, nose to tail,
// never overlap and never cross the hull, however many parts are packed.
import { describe, expect, it } from 'vitest';
import type { PartId } from '../../src/engine/pack';
import { hull, layoutModules, PREVIEW_WINDOW as W } from '../../src/ui/components/sd/LiveDesignPreview';

const ALL: PartId[] = ['computer', 'engine', 'camera', 'spectrometer', 'magnetometer', 'radar', 'sniffer', 'dish', 'solar', 'battery', 'tank', 'heater', 'shield', 'bumper', 'spare', 'autopilot'];

describe('live preview layout', () => {
  for (const n of [2, 3, 5, 6, 7, 9, 12, 16]) {
    const ids = ALL.slice(0, n);
    const slots = layoutModules(ids);
    it(`${n} parts: every part placed once, spread from tail to nose`, () => {
      expect(slots.map((s) => s.id).sort()).toEqual([...ids].sort());
      const left = Math.min(...slots.map((s) => s.x));
      const right = Math.max(...slots.map((s) => s.x + s.w));
      const span = W.right - W.left;
      // no end of the window is left empty: the outermost modules sit within one column's share of each end
      expect(left - W.left).toBeLessThan(span / Math.ceil(n / (n > 6 ? 2 : 1)));
      expect(W.right - right).toBeLessThan(span / Math.ceil(n / (n > 6 ? 2 : 1)));
    });
    it(`${n} parts: inside the hull and no two modules overlap`, () => {
      for (const s of slots) {
        expect(s.x).toBeGreaterThanOrEqual(W.left);
        expect(s.x + s.w).toBeLessThanOrEqual(W.right);
        const half = Math.min(hull(s.x), hull(s.x + s.w)) - W.wall;
        expect(s.y).toBeGreaterThanOrEqual(W.centre - half);
        expect(s.y + s.h).toBeLessThanOrEqual(W.centre + half);
      }
      for (const a of slots)
        for (const b of slots) {
          if (a === b) continue;
          const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y;
          expect(apart, `${a.id} / ${b.id}`).toBe(true);
        }
    });
  }

  it('orders the craft nose to tail: sensors in the nose, propulsion at the tail', () => {
    const slots = layoutModules(['engine', 'tank', 'camera', 'computer', 'solar']);
    const x = (id: PartId) => slots.find((s) => s.id === id)!.x;
    expect(x('camera')).toBeGreaterThan(x('solar'));
    expect(x('solar')).toBeGreaterThan(x('computer'));
    expect(x('computer')).toBeGreaterThan(x('tank'));
  });
});
