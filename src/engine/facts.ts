// What the player has done across flights and rescues: hazards faced, seasons flown through, deeds for the badges
// (ranks.ts) and best stars. Saved in the browser by saves.ts; nothing here changes the simulation.
import type { OpsState } from './ops/types';
import { RESCUE_CASE_IDS } from './rescue';

/** What the player has done: hazards faced (first mission day), seasons flown through, best stars per level/rescue. */
export interface PlayerFacts {
  hazards: Record<string, number>;
  conjunction: boolean;
  eclipse: boolean;
  /** Badges (ranks.ts): a solar storm met with every instrument kept, an eclipse season with no brownout, an
   *  extension chosen, a sample brought home. */
  stormNoLoss: boolean;
  eclipseNoBrownout: boolean;
  extended: boolean;
  sampleReturned: boolean;
  progress: Record<string, number>;
}

export const emptyFacts = (): PlayerFacts => ({
  hazards: {},
  conjunction: false,
  eclipse: false,
  stormNoLoss: false,
  eclipseNoBrownout: false,
  extended: false,
  sampleReturned: false,
  progress: {},
});

/** The facts one finished flight adds: hazards answered (their first day), the seasons it flew through, its deeds. */
export function flightFacts(s: OpsState): Omit<PlayerFacts, 'progress'> {
  const end = s.status === 'lost' ? Math.floor(s.failureT ?? s.t) : Math.min(Math.floor(s.t), s.env.primeEndDay);
  const hazards: Record<string, number> = {};
  for (const h of s.hazards) {
    if (!h.choice) continue;
    const d = Math.floor(h.onset);
    hazards[h.type] = Math.min(hazards[h.type] ?? Infinity, d);
  }
  const alive = s.status !== 'lost' && s.status !== 'not-launched';
  return {
    hazards,
    conjunction: s.env.conjunctions.some((w) => w.startDay <= end),
    eclipse: s.env.eclipseSeasons.some((e) => e.startDay <= end),
    stormNoLoss: alive && s.instrumentsLost.length === 0 && s.hazards.some((h) => h.type === 'solar-storm' && h.onset <= s.t),
    eclipseNoBrownout: alive && s.events.some((e) => e.code === 'eclipse-season-end') && !s.events.some((e) => e.code === 'brownout'),
    extended: s.extension !== undefined,
    sampleReturned: s.status === 'complete' && s.env.timeline.some((w) => w.phase === 'return'),
  };
}

export function mergeFacts(a: PlayerFacts, b: Partial<PlayerFacts>): PlayerFacts {
  const hazards = { ...a.hazards };
  for (const [k, d] of Object.entries(b.hazards ?? {})) hazards[k] = Math.min(hazards[k] ?? Infinity, d);
  const progress = { ...a.progress };
  for (const [k, v] of Object.entries(b.progress ?? {})) progress[k] = Math.max(progress[k] ?? 0, v);
  const or = (k: 'conjunction' | 'eclipse' | 'stormNoLoss' | 'eclipseNoBrownout' | 'extended' | 'sampleReturned') => !!a[k] || !!b[k];
  return {
    hazards,
    conjunction: or('conjunction'),
    eclipse: or('eclipse'),
    stormNoLoss: or('stormNoLoss'),
    eclipseNoBrownout: or('eclipseNoBrownout'),
    extended: or('extended'),
    sampleReturned: or('sampleReturned'),
    progress,
  };
}

export const rescueProgress = (progress: Record<string, number>) => ({
  solved: RESCUE_CASE_IDS.filter((id) => (progress[`rescue-${id}`] ?? 0) >= 1).length,
  total: RESCUE_CASE_IDS.length,
});
