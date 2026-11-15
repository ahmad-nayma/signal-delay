// SPACE KIDS (UI screens/KidsMode.tsx): Cadet's real loop for children of about four to ten, on the same engine.
// Pick the Moon or Mars → pack a few big parts into the real Pack nose (pack.ts) → fly the real Mission operations
// (ops/*) → a short picture report. What is simpler is only what the child is asked: a short shelf, at most
// KIDS_RULES.maxCards danger cards (the robot answers the rest with its default response), at Mars one moment to pick
// pictures, and a report that never shows fewer than KIDS_RULES.minStars stars. Nothing here changes the simulation.
// The real NASA facts at the end (kidsTrip): how far, how long a radio hello takes, MAVEN's trip, a NASA picture.
// Every number is computed here; the screen only formats it.
import { C_MS, SPEED_OF_LIGHT } from './constants';
import { DESTINATIONS } from './data';
import { julianDate } from './ephemeris';
import { evaluateDesign } from './index';
import { marsNow } from './marsNow';
import { missionPreset } from './missions';
import { advanceOperations, decide, finishOperations, operationsDebrief, sendCommand, startOperations } from './ops/index';
import { missionProgress } from './ops/fly';
import { targetScience } from './ops/observe';
import { packHint } from './ops/report';
import { scienceTargetsView } from './ops/scienceView';
import type { OpsPhase, OpsState } from './ops/types';
import { buildPackDesign, initialPack, packBlockers, packPart, shelfFor, type PackBlockerCode, type Packed, type PartId } from './pack';
import { POSTCARDS, type Postcard } from './postcards';
import { gameEstimate, sourced, type Design, type Sourced } from './types';

export type KidsDestination = 'moon' | 'mars';
export const KIDS_DESTINATIONS: readonly KidsDestination[] = ['moon', 'mars'];

export const KIDS_RULES = {
  maxCards: gameEstimate(2, 'cards', 'Game rule (Space Kids): the child answers at most two danger cards a flight; the robot answers any others with its default response'),
  minStars: gameEstimate(1, 'stars', 'Game rule (Space Kids): a kid’s mission report always shows at least one star, so no flight ends as a failure'),
  maxPhotos: gameEstimate(3, 'pictures', 'Game rule (Space Kids): at Mars the child picks up to three places for the robot to photograph'),
  step_days: gameEstimate(8, 'days', 'Game rule (Space Kids): the flight screen moves the mission clock on by at most eight days a beat, so the rocket glides across the trip'),
} satisfies Record<string, Sourced<unknown>>;

/**
 * The kid's shelf: four big parts per destination, all from Cadet's shelf (pack.json). The locked computer and engine
 * are always on board. Every mix that includes a science part flies (tests/kids.test.ts checks every subset).
 */
const KIDS_SHELF: Record<KidsDestination, PartId[]> = {
  moon: ['camera', 'solar', 'battery', 'dish'],
  mars: ['camera', 'solar', 'battery', 'shield'],
};
export const kidsShelf = (dest: KidsDestination): PartId[] => [...KIDS_SHELF[dest]];

export interface KidsPack {
  packed: Packed;
  /** The parts the child put in, in order (the locked ones are not listed). */
  parts: PartId[];
  /** The craft the packed nose flies. */
  design: Design;
  /** Nothing blocks the launch. */
  ready: boolean;
  /** When not ready: the first shelf part that clears every blocker (the robot asks for it), if one does. */
  need?: PartId;
  /** When not ready: what blocks the launch (Pack's codes). */
  blockers: PackBlockerCode[];
}

function packWith(base: Design, dest: KidsDestination, parts: PartId[]): { packed: Packed; parts: PartId[]; design: Design; blockers: PackBlockerCode[] } {
  let packed = initialPack({ ...base, instrumentIds: [] }, shelfFor(dest));
  const kept: PartId[] = [];
  for (const id of parts) {
    const next = packPart(packed, id);
    if (next && next !== packed) {
      packed = next;
      kept.push(id);
    }
  }
  const design = buildPackDesign(base, packed);
  const blockers = packBlockers(packed, evaluateDesign(design)).map((b) => b.code);
  return { packed, parts: kept, design, blockers };
}

/** The kid's nose with these parts (only kid-shelf parts, each once, where they fit), and whether it can lift off. */
export function kidsPack(base: Design, parts: readonly PartId[]): KidsPack {
  const dest = base.destination as KidsDestination;
  const shelf = KIDS_SHELF[dest];
  const wanted = [...new Set(parts)].filter((id) => shelf.includes(id));
  const now = packWith(base, dest, wanted);
  if (now.blockers.length === 0) return { ...now, ready: true, blockers: [] };
  const need = shelf.find((id) => !now.parts.includes(id) && packWith(base, dest, [...now.parts, id]).blockers.length === 0);
  return { ...now, ready: false, ...(need ? { need } : {}) };
}

/** Tap a part: in if it is out, out if it is in. */
export function kidsToggle(base: Design, parts: readonly PartId[], id: PartId): KidsPack {
  // The nose is rebuilt from the list, so the same parts always sit in the same squares.
  return kidsPack(base, parts.includes(id) ? parts.filter((p) => p !== id) : [...parts, id]);
}

// ---------------------------------------------------------------------------
// The flight: the real Mission operations, with a few stops where the child is asked

export type KidsStop =
  /** A danger: be careful (the safest response) or keep going (the boldest), as two big pictures. */
  | { kind: 'card'; decisionId: string; hazardType: string; safe: string; brave?: string }
  /** At Mars, in the science orbit: pick places to photograph (target ids the robot can observe now). */
  | { kind: 'photos'; targets: string[]; max: number };

export interface KidsFlight {
  state: OpsState;
  /** Danger cards the child has answered. */
  cards: number;
  /** The photo stop has been offered (Mars). */
  photosAsked: boolean;
  /** Where the flight waits for the child, if it does. */
  stop?: KidsStop;
}

export const kidsLaunch = (design: Design, seed: number): KidsFlight => ({ state: startOperations(design, { seed }), cards: 0, photosAsked: false });

const sciStart = (s: OpsState) => s.env.timeline.find((w) => w.phase === 'science')?.startDay;
const over = (s: OpsState) => s.status !== 'flying' && s.status !== 'awaiting-extension';
/** The flight is over (complete or lost); the report can open. */
export const kidsDone = (f: KidsFlight) => over(f.state);

/** Move the flight on one beat (KIDS_RULES.step_days), or to the next stop. Does nothing while a stop waits. */
export function kidsStep(f: KidsFlight): KidsFlight {
  if (f.stop || over(f.state)) return f;
  let s = f.state;
  // The prime mission is done: the kid's mission ends there (no extension).
  if (s.status === 'awaiting-extension') return { ...f, state: finishOperations(s, { extension: 'end' }) };
  const photoDay = !f.photosAsked && s.env.design.destination === 'mars' ? sciStart(s) : undefined;
  let until = s.t + KIDS_RULES.step_days.value;
  if (photoDay !== undefined && photoDay + 1 > s.t) until = Math.min(until, photoDay + 1);
  const t0 = s.t;
  s = advanceOperations(s, { until });
  // The clock's horizon: nothing more can happen, so fly on to the end.
  if (s.status === 'flying' && s.t <= t0 + 1e-12 && s.newDecisions.length === 0) return { ...f, state: finishOperations(s, { extension: 'end' }) };
  let next: KidsFlight = { ...f, state: s };
  const fresh = s.newDecisions.map((id) => s.decisions.find((d) => d.id === id)!).filter((d) => d.kind === 'hazard' && !d.commanded);
  const ask = next.cards < KIDS_RULES.maxCards.value ? fresh[0] : undefined;
  if (ask) {
    const options = ask.hazardOptions ?? [];
    const safe = ask.safestOptionId ?? options[0]?.id;
    const bold = options.reduce<(typeof options)[number] | undefined>((a, b) => (!a || b.failureChance.value > a.failureChance.value ? b : a), undefined);
    const hazardType = s.hazards.find((h) => h.id === ask.hazardId)?.type ?? '';
    if (safe) return { ...next, stop: { kind: 'card', decisionId: ask.id, hazardType, safe, ...(bold && bold.id !== safe ? { brave: bold.id } : {}) } };
  }
  if (photoDay !== undefined && s.t >= photoDay + 1 - 1e-9) {
    const view = scienceTargetsView(s);
    const targets = view.available ? view.cards.filter((c) => c.state === 'ready' && !c.blocker).map((c) => c.id) : [];
    next = { ...next, photosAsked: true };
    if (targets.length) return { ...next, stop: { kind: 'photos', targets, max: KIDS_RULES.maxPhotos.value } };
  }
  return next;
}

/** The child's answer to a danger card. */
export function kidsAnswer(f: KidsFlight, choice: 'safe' | 'brave'): KidsFlight {
  if (f.stop?.kind !== 'card') return f;
  const optionId = choice === 'brave' && f.stop.brave ? f.stop.brave : f.stop.safe;
  return { ...f, state: decide(f.state, f.stop.decisionId, optionId).state, cards: f.cards + 1, stop: undefined };
}

/** The places the child picked (at most KIDS_RULES.maxPhotos, only those offered): the robot observes each. */
export function kidsPhotos(f: KidsFlight, targetIds: readonly string[]): KidsFlight {
  if (f.stop?.kind !== 'photos') return f;
  const offered = f.stop.targets;
  let s = f.state;
  for (const id of [...new Set(targetIds)].filter((x) => offered.includes(x)).slice(0, KIDS_RULES.maxPhotos.value)) {
    const r = sendCommand(s, { kind: 'observe', targetId: id });
    if (r.receipt.accepted) s = r.state;
  }
  return { ...f, state: s, stop: undefined };
}

export type KidsLeg = 'launch' | 'cruise' | 'arrive' | 'explore' | 'done';
const LEG: Record<OpsPhase, KidsLeg> = { launch: 'launch', cruise: 'cruise', arrival: 'arrive', science: 'explore', return: 'explore', extended: 'explore' };

/** What the flight screen draws: how far along (0–1) and which leg of the trip. */
export function kidsFlightView(f: KidsFlight): { fraction: number; leg: KidsLeg } {
  const s = f.state;
  if (over(s)) return { fraction: 1, leg: 'done' };
  const day = s.env.days[Math.max(0, Math.min(Math.floor(s.t), s.env.horizonDay))];
  return { fraction: missionProgress(s).fraction, leg: day ? LEG[day.phase] : 'launch' };
}

export interface KidsReport {
  /** At least KIDS_RULES.minStars; at most the real flight's stars (STAR_RULES). */
  stars: number;
  /** The real flight's stars, for tests and the Engineer. */
  realStars: number;
  /** The robot was lost on the way (the report stays gentle). */
  lost: boolean;
  /** Mars: the places whose pictures came home. */
  photosHome: string[];
  /** A kid-shelf part that would have helped with what hurt the flight (ops/report packHint). */
  hint?: PartId;
}

export function kidsReport(f: KidsFlight): KidsReport {
  const s = f.state;
  const realStars = operationsDebrief(s).stars;
  const dest = s.env.design.destination as KidsDestination;
  const hint = packHint(s, KIDS_SHELF[dest])?.part;
  return {
    stars: Math.max(KIDS_RULES.minStars.value, realStars),
    realStars,
    lost: s.status === 'lost',
    photosHome: dest === 'mars' ? targetScience(s).home : [],
    ...(hint ? { hint } : {}),
  };
}

// ---------------------------------------------------------------------------
// The real NASA facts at the end

/** The picture shown for each destination (an id in postcards.json). */
const KIDS_POSTCARD: Record<KidsDestination, string> = { moon: 'moon-earthrise', mars: 'mars-globe' };

export interface KidsTrip {
  destination: KidsDestination;
  /** Earth to the destination (m), with its source for ⓘ. */
  distance_m: number;
  distance: Sourced<number>;
  /** One-way radio time, d / c (s). */
  lightTime_s: number;
  lightSpeed: Sourced<number>;
  /** A real NASA mission that flew there, and how many days its trip took (launch to orbit insertion). */
  mission?: { label: string; days: number; launch: Sourced<string>; arrival: Sourced<string> };
  /** The real NASA picture of the destination. */
  postcard: Postcard;
}

export function kidsPostcard(dest: KidsDestination): Postcard {
  const card = POSTCARDS.find((c) => c.id === KIDS_POSTCARD[dest]);
  if (!card) throw new Error(`No postcard ${KIDS_POSTCARD[dest]}`);
  return card;
}

export function kidsTrip(dest: KidsDestination, dateIso: string): KidsTrip {
  const postcard = kidsPostcard(dest);
  const lightSpeed = SPEED_OF_LIGHT;
  if (dest === 'moon') {
    const distance = DESTINATIONS.moon.earthDistance_1e6km;
    if (!distance) throw new Error('destinations.json: the Moon needs earthDistance_1e6km');
    const distance_m = distance.value * 1e9;
    return { destination: dest, distance_m, distance, lightTime_s: distance_m / C_MS, lightSpeed, postcard };
  }
  const now = marsNow(dateIso);
  const distance = sourced(now.distance_m / 1e9, '10⁶ km', `Earth–Mars distance on ${now.date}, from the JPL approximate Keplerian elements (Table 1, valid 1800–2050)`, {
    url: 'https://ssd.jpl.nasa.gov/planets/approx_pos.html',
  });
  const maven = missionPreset('maven');
  const launch = maven.design.launchDate;
  const arrival = maven.design.arrivalDate;
  const days = Math.round(julianDate(arrival.value) - julianDate(launch.value));
  return {
    destination: dest,
    distance_m: now.distance_m,
    distance,
    lightTime_s: now.lightTime_s,
    lightSpeed,
    mission: { label: 'MAVEN', days, launch, arrival },
    postcard,
  };
}
