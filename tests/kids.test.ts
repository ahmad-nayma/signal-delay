// SPACE KIDS (engine kids.ts): Cadet's loop on the same engine, with fewer questions. The pack is the real Pack nose,
// the flight the real Mission operations, the stars the real STAR_RULES with a floor; and the real NASA facts at the end.
import { describe, expect, it } from 'vitest';
import {
  KIDS_RULES,
  kidsAnswer,
  kidsDone,
  kidsFlightView,
  kidsLaunch,
  kidsPack,
  kidsPhotos,
  kidsReport,
  kidsShelf,
  kidsStep,
  kidsToggle,
  kidsTrip,
  type KidsDestination,
  type KidsFlight,
} from '../src/engine/kids';
import { marsNow } from '../src/engine/marsNow';
import { buildPackDesign, initialPack, packPart, PACK, shelfFor } from '../src/engine/pack';
import { operationsDebrief } from '../src/engine/ops/index';
import { starterDesign } from '../src/ui/starters';

const DAY = '2026-11-15';
const base = (d: KidsDestination) => starterDesign(d, DAY);
const subsets = <T>(a: T[]): T[][] => a.reduce<T[][]>((acc, x) => [...acc, ...acc.map((s) => [...s, x])], [[]]);

/** Fly to the end: the child answers every card with `choice` and picks every place offered. */
function flyAll(f: KidsFlight, choice: 'safe' | 'brave' = 'safe'): { f: KidsFlight; cards: number; photoStops: number; beats: number } {
  let cards = 0;
  let photoStops = 0;
  let beats = 0;
  while (!kidsDone(f)) {
    if (beats++ > 10_000) throw new Error('kids flight did not end');
    if (f.stop?.kind === 'card') {
      cards++;
      f = kidsAnswer(f, choice);
    } else if (f.stop?.kind === 'photos') {
      photoStops++;
      f = kidsPhotos(f, f.stop.targets);
    } else f = kidsStep(f);
  }
  return { f, cards, photoStops, beats };
}

describe('kids pack', () => {
  it('each shelf has four parts, all on Cadet’s shelf for that destination', () => {
    for (const d of ['moon', 'mars'] as const) {
      expect(kidsShelf(d)).toHaveLength(4);
      for (const id of kidsShelf(d)) expect(shelfFor(d)).toContain(id);
    }
  });

  it('every mix with the camera lifts off; without a science part the robot asks for the camera', () => {
    for (const d of ['moon', 'mars'] as const) {
      for (const sub of subsets(kidsShelf(d))) {
        const p = kidsPack(base(d), sub);
        // every part fits the nose (pack.json: 4 × 4 squares)
        expect(p.parts).toEqual(sub);
        if (sub.includes('camera')) expect(p.ready, `${d} ${sub.join('+')}`).toBe(true);
        else {
          expect(p.ready).toBe(false);
          expect(p.blockers).toContain('no-science');
          expect(p.need).toBe('camera');
        }
      }
    }
  });

  it('is the real Pack: the same design as packing those parts in Cadet', () => {
    const b = base('mars');
    let packed = initialPack({ ...b, instrumentIds: [] }, shelfFor('mars'));
    for (const id of ['camera', 'solar'] as const) packed = packPart(packed, id)!;
    expect(kidsPack(b, ['camera', 'solar']).design).toEqual(buildPackDesign(b, packed));
    // the locked computer and engine are always on board
    expect(kidsPack(b, []).packed.map((q) => q.id)).toEqual(['computer', 'engine']);
    expect(PACK.parts.computer.locked).toBe(true);
  });

  it('a tap puts a part in, a second tap takes it out; parts off the kid shelf are ignored', () => {
    const b = base('moon');
    const one = kidsToggle(b, [], 'camera');
    expect(one.parts).toEqual(['camera']);
    expect(kidsToggle(b, one.parts, 'camera').parts).toEqual([]);
    expect(kidsPack(b, ['tank', 'camera', 'camera']).parts).toEqual(['camera']);
  });
});

describe('kids flight', () => {
  it('the Moon: no photo stop, at most two cards, the same seed flies the same flight', () => {
    const d = kidsPack(base('moon'), ['camera', 'solar', 'battery', 'dish']).design;
    for (const seed of [1, 2, 3, 4, 5]) {
      const a = flyAll(kidsLaunch(d, seed));
      const b = flyAll(kidsLaunch(d, seed));
      expect(a.photoStops).toBe(0);
      expect(a.cards).toBeLessThanOrEqual(KIDS_RULES.maxCards.value);
      expect(a.f.state.status).toBe(b.f.state.status);
      expect(kidsReport(a.f)).toEqual(kidsReport(b.f));
      expect(kidsFlightView(a.f)).toEqual({ fraction: 1, leg: 'done' });
    }
  });

  it('Mars: one photo stop in the science orbit; the pictures picked come home', () => {
    const d = kidsPack(base('mars'), ['camera', 'solar', 'battery', 'shield']).design;
    let f = kidsLaunch(d, 2);
    while (!f.stop || f.stop.kind !== 'photos') {
      f = f.stop?.kind === 'card' ? kidsAnswer(f, 'safe') : kidsStep(f);
      expect(kidsDone(f)).toBe(false);
    }
    expect(kidsFlightView(f).leg).toBe('explore');
    expect(f.stop.max).toBe(3);
    expect(f.stop.targets.length).toBeGreaterThanOrEqual(3);
    const picked = f.stop.targets.slice(0, 2);
    // more than offered or than the rule allows is cut to the rule
    f = kidsPhotos(f, [...picked, 'not-a-target']);
    const end = flyAll(f).f;
    const r = kidsReport(end);
    expect(end.state.status).toBe('complete');
    expect(r.photosHome.sort()).toEqual([...picked].sort());
    expect(r.stars).toBeGreaterThanOrEqual(1);
  });

  it('the clock moves at most KIDS_RULES.step_days a beat', () => {
    const d = kidsPack(base('moon'), ['camera']).design;
    let f = kidsLaunch(d, 7);
    for (let i = 0; i < 5 && !f.stop; i++) {
      const t0 = f.state.t;
      f = kidsStep(f);
      expect(f.state.t - t0).toBeLessThanOrEqual(KIDS_RULES.step_days.value + 1e-9);
    }
  });

  it('a waiting stop holds the clock; an answer clears it', () => {
    const d = kidsPack(base('mars'), ['camera']).design;
    let f = kidsLaunch(d, 4);
    while (!f.stop && !kidsDone(f)) f = kidsStep(f);
    expect(f.stop).toBeDefined();
    expect(kidsStep(f)).toBe(f);
    const next = f.stop!.kind === 'card' ? kidsAnswer(f, 'brave') : kidsPhotos(f, []);
    expect(next.stop).toBeUndefined();
  });
});

describe('kids report', () => {
  it('never fewer than one star, never more than the real flight’s (seeds 1–12, brave answers, Mars, no photos)', () => {
    const d = kidsPack(base('mars'), ['camera']).design;
    for (let seed = 1; seed <= 12; seed++) {
      let f = kidsLaunch(d, seed);
      while (!kidsDone(f)) f = f.stop?.kind === 'card' ? kidsAnswer(f, 'brave') : f.stop?.kind === 'photos' ? kidsPhotos(f, []) : kidsStep(f);
      const r = kidsReport(f);
      // no pictures ordered: the real flight has no science home, so 0 real stars, shown as 1
      expect(r.realStars).toBe(operationsDebrief(f.state).stars);
      expect(r.stars).toBe(Math.max(1, r.realStars));
      expect(r.photosHome).toEqual([]);
      if (r.hint) expect(kidsShelf('mars')).toContain(r.hint);
    }
  });
});

describe('kidsTrip', () => {
  it('the Moon: NSSDC semimajor axis 384,400 km; a radio hello takes about 1.28 s', () => {
    const t = kidsTrip('moon', '2026-11-14');
    // 0.3844 × 10⁶ km = 3.844e8 m
    expect(t.distance_m).toBeCloseTo(3.844e8, 0);
    expect(t.distance.isGameEstimate).toBe(false);
    expect(t.distance.url).toMatch(/nssdc\.gsfc\.nasa\.gov/);
    // 384,400 km / 299,792.458 km/s = 1.2822 s
    expect(t.lightTime_s).toBeCloseTo(1.2822, 3);
    expect(t.postcard.id).toBe('moon-earthrise');
    expect(t.mission).toBeUndefined();
  });

  it('Mars: today’s distance and light time are marsNow’s; MAVEN took 307 days (2013-11-18 → 2014-09-21)', () => {
    const t = kidsTrip('mars', '2026-11-14');
    const m = marsNow('2026-11-14');
    expect(t.distance_m).toBe(m.distance_m);
    expect(t.lightTime_s).toBe(m.lightTime_s);
    expect(t.distance.value).toBeCloseTo(m.distance_m / 1e9, 9);
    // Nov 18 → Nov 30: 12, Dec 31, Jan 31, Feb 28, Mar 31, Apr 30, May 31, Jun 30, Jul 31, Aug 31 (= 286), + Sep 21 = 307
    expect(t.mission?.days).toBe(307);
    expect(t.mission?.launch.value).toBe('2013-11-18');
    expect(t.mission?.arrival.value).toBe('2014-09-21');
    expect(t.postcard.id).toBe('mars-globe');
    expect(t.postcard.image).toMatch(/^postcards\//);
  });
});
