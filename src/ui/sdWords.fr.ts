// French words for the Signal Delay screens (i18n.ts): the same exports as sdWords.ts, generated from it, in French.
// Words for the Signal Delay screens (design: docs/design/signal-delay). Numbers come from the engine and are only
// formatted here, through format.ts. Cadet reads short uppercase lines; Engineer adds the numbers.
import type { FailureEffect, OpsPhase } from '../engine/data';
import type { ComingUpKind, ConsoleOutcome, FlyChip, RobotMessage, VoiceKind } from '../engine/ops/index';
import type { DeckCard, FuelFix, LimitKey, PackBlockerCode, PartId } from '../engine/pack';
import type { MeterStatus } from '../engine/types';
import type { FinalTransmission, Hurt, ReportPanel, Saved } from '../engine/ops/report';
import type { TargetBody } from '../engine/targets';
import type { ObjectiveId } from '../engine/objectives';
import type { RoleId } from '../engine/team/roles';
import type { RealStorm } from '../engine/spaceWeather';
import type { Category } from '../engine/scoring';
import type { SDIconName } from './components/sd/SDIcon';
import * as f from './format';

export const GAME_NAME = 'SIGNAL DELAY';

// ---------------------------------------------------------------------------
// Fly & Survive

export type TileKey = 'power' | 'fuel' | 'data' | 'systems';
export const TILE: Record<TileKey, { name: string; icon: SDIconName; help: string }> = {
  power: { name: 'ÉNERGIE', icon: 'power', help: 'Énergie disponible aujourd’hui' },
  fuel: { name: 'CARBURANT', icon: 'fuel', help: 'Carburant restant dans le réservoir' },
  data: { name: 'DONNÉES', icon: 'data', help: 'Science envoyée sur Terre, par rapport à l’objectif' },
  systems: { name: 'SYSTÈMES', icon: 'sys', help: 'L’état de santé du robot' },
};

/** Short card labels in the design's voice; the engine's own label is the fallback. */
export const OPTION_SHORT: Record<string, string> = {
  'solar-storm.shelter': 'BOUCLIER',
  'solar-storm.keep-observing': 'CONTINUER',
  'cme-shock.safe-mode': 'MODE SÉCURITÉ',
  'cme-shock.keep-observing': 'LE REGARDER FRAPPER',
  'mars-dust-storm.raise-periapsis': 'MONTER PLUS HAUT',
  'mars-dust-storm.wait-it-out': 'ATTENDRE',
  'mars-dust-storm.carry-on': 'CONTINUER',
  'debris.hide': 'SE CACHER DERRIÈRE LA PLANÈTE',
  'debris.edge-on': 'SE METTRE DE PROFIL',
  'debris.ignore': 'NE RIEN FAIRE',
  'reaction-wheel.thrusters': 'PROPULSEURS',
  'reaction-wheel.hybrid': 'NOUVEAU POINTAGE',
  'reaction-wheel.carry-on': 'CONTINUER',
  'memory-corruption.backup-computer': 'ORDI DE SECOURS',
  'memory-corruption.patch': 'ENVOYER UN CORRECTIF',
  'memory-corruption.reboot': 'REDÉMARRER',
  'insertion-anomaly.trim-burn': 'CORRECTION D’ORBITE',
  'insertion-anomaly.accept-orbit': 'GARDER CETTE ORBITE',
  'insertion-anomaly.hold': 'NE PAS BOUGER',
  'drag-heating.pop-up': 'REMONTER LE PÉRIAPSIDE',
  'drag-heating.stay-low': 'RESTER BAS ET FINIR LA PHOTO',
};

export const optionShort = (type: string, id: string, label: string) => OPTION_SHORT[`${type}.${id}`] ?? label.toUpperCase();

export const EFFECT_ICON: Record<FailureEffect, SDIconName> = { craft: 'sys', instrument: 'camera', 'stored-data': 'data', 'safe-mode': 'sys' };
export const CHIP_ICON: Record<FlyChip['gauge'], SDIconName> = { fuel: 'fuel', data: 'data', coins: 'star' };

/** "IN 30 HOURS", or "NOW" once the danger has struck. */
export const arrivesWords = (s: number) => (s < 60 ? 'MAINTENANT' : `DANS ${f.durationWords(s)}`);

export const COMING: Record<ComingUpKind, { label: (dest: string) => string; short: (dest: string) => string; icon: SDIconName }> = {
  eclipse: { label: () => 'SAISON D’ÉCLIPSES', short: () => 'NUIT', icon: 'eclipse' },
  conjunction: { label: () => 'LE SOLEIL BLOQUE LA RADIO', short: () => 'SOLEIL', icon: 'conj' },
  'course-fix': { label: () => 'CORRECTION DE CAP', short: () => 'CORR.', icon: 'burn' },
  arrival: { label: (d) => `ARRIVÉE À ${d.toUpperCase()}`, short: (d) => d.toUpperCase(), icon: 'orbit' },
  'dust-season': { label: () => 'SAISON DES TEMPÊTES DE POUSSIÈRE', short: () => 'POUSSIÈRE', icon: 'dust' },
};

export const monthsWords = (m: number) => `${f.num(m)} MOIS`;
export const monthsShort = (m: number) => `${f.num(m)} M`;

/** The CRT log line when nothing else is happening. */
function quietLineEn(phase: OpsPhase, dest: string): string {
  const d = dest.toUpperCase();
  switch (phase) {
    case 'launch':
      return 'DÉCOLLAGE. LE ROBOT EST EN ROUTE.';
    case 'cruise':
      return `EN ROUTE VERS ${d}. TOUT EST CALME.`;
    case 'arrival':
      return `ARRIVÉE À ${d}.`;
    case 'science':
      return `EN ORBITE À ${d}. LA SCIENCE TOURNE.`;
    case 'return':
      return 'RETOUR VERS LA TERRE.';
    case 'extended':
      return 'MISSION PROLONGÉE. TOUJOURS EN VOL.';
  }
}
export const quietLine = quietLineEn;

export const milestoneLine = (kind: 'arrival' | 'prime-end' | 'extension-end' | undefined, inDays: number | undefined, dest: string): string => {
  if (kind === 'arrival' && inDays !== undefined) return `${dest.toUpperCase()} DANS ${f.num(inDays)} ${inDays === 1 ? 'JOUR ' : 'JOURS'}`;
  if (kind === 'prime-end' && inDays !== undefined) return `FIN DE LA SCIENCE DANS ${f.num(inDays)} JOURS`;
  if (kind === 'extension-end' && inDays !== undefined) return `FIN DE LA PROLONGATION DANS ${f.num(inDays)} JOURS`;
  return `À ${dest.toUpperCase()}`;
};

const EFFECT_LINE: Record<FailureEffect, string> = {
  craft: 'CONTACT PERDU. LE ROBOT EST PERDU.',
  instrument: 'UN INSTRUMENT EST CASSÉ POUR DE BON.',
  'stored-data': 'LES PHOTOS À BORD ONT ÉTÉ EFFACÉES.',
  'safe-mode': 'LE ROBOT S’EST CACHÉ EN MODE SÉCURITÉ.',
};

/** The INCOMING teletype after an order lands: what happened, in short lines. */
function resultLinesEn(o: ConsoleOutcome, shortLabel: string): string[] {
  const lines: string[] = [];
  if (o.by === 'standing-order') lines.push(`PAS D’ORDRE À TEMPS. LE ROBOT A SUIVI SON ORDRE PERMANENT : ${shortLabel}.`);
  else if (o.by === 'fault-protection') lines.push(`PAS D’ORDRE À TEMPS. LE ROBOT A CHOISI : ${shortLabel}.`);
  else lines.push(`ORDRE EXÉCUTÉ : ${shortLabel}.`);
  lines.push(o.bad ? `${o.title.toUpperCase()} : COUP DUR.` : `${o.title.toUpperCase()} : PASSÉ.`);
  if (o.bad) lines.push(EFFECT_LINE[o.failureEffect]);
  else lines.push('TOUS LES SYSTÈMES SONT SAINS.');
  if (o.scienceDaysLost > 0) lines.push(`VOUS AVEZ PERDU ${f.num(o.scienceDaysLost)} ${o.scienceDaysLost === 1 ? 'JOUR' : 'JOURS'} DE SCIENCE.`);
  if (o.deltaV_ms > 0) lines.push(`MOTEUR ALLUMÉ : ${f.speed(o.deltaV_ms).toUpperCase()}.`);
  return lines;
}
export const resultLines = resultLinesEn;

export const RESULT_EFFECT_CHIP: Record<FailureEffect, string> = {
  craft: 'ROBOT PERDU',
  instrument: 'INSTRUMENT PERDU',
  'stored-data': 'PHOTOS EFFACÉES',
  'safe-mode': 'MODE SÉCURITÉ',
};

// ---------------------------------------------------------------------------
// Pack


export const PART_LOOK: Record<PartId, { name: string; short: string; icon: SDIconName; color: string }> = {
  computer: { name: 'Ordinateur de vol', short: 'CERVEAU', icon: 'computer', color: 'var(--sd-part-brain)' },
  engine: { name: 'Moteur principal', short: 'MOTEUR', icon: 'burn', color: 'var(--sd-part-drive)' },
  camera: { name: 'Caméra', short: 'CAMÉRA', icon: 'camera', color: 'var(--sd-part-science)' },
  spectrometer: { name: 'Spectromètre', short: 'SPECTRO', icon: 'data', color: 'var(--sd-part-science)' },
  magnetometer: { name: 'Magnétomètre', short: 'MAG', icon: 'orbit', color: 'var(--sd-part-science)' },
  radar: { name: 'Radar sondeur', short: 'RADAR', icon: 'data', color: 'var(--sd-part-science)' },
  sniffer: { name: 'Renifleur d’air (suite MAVEN)', short: 'RENIFLEUR', icon: 'data', color: 'var(--sd-part-science)' },
  dish: { name: 'Grande antenne', short: 'ANTENNE', icon: 'dish', color: 'var(--sd-part-science)' },
  solar: { name: 'Panneau solaire en plus', short: 'SOLAIRE', icon: 'panel', color: 'var(--sd-part-power)' },
  battery: { name: 'Grosse batterie', short: 'BATTERIE', icon: 'battery', color: 'var(--sd-part-power)' },
  tank: { name: 'Réservoir en plus', short: 'CARBURANT', icon: 'tank', color: 'var(--sd-part-drive)' },
  heater: { name: 'Kit de chauffage', short: 'CHAUFFAGE', icon: 'heater', color: 'var(--sd-part-guard)' },
  shield: { name: 'Bouclier anti-radiations', short: 'BOUCLIER', icon: 'shield', color: 'var(--sd-part-guard)' },
  bumper: { name: 'Pare-débris', short: 'PARE-DÉBRIS', icon: 'shield', color: 'var(--sd-part-guard)' },
  spare: { name: 'Ordinateur de secours', short: 'SECOURS', icon: 'computer', color: 'var(--sd-part-brain)' },
  autopilot: { name: 'Puce pilote auto', short: 'AUTO', icon: 'computer', color: 'var(--sd-part-brain)' },
};

/** Science parts earn data (the green star badge). */
export const SCIENCE_PARTS: PartId[] = ['camera', 'spectrometer', 'magnetometer', 'radar', 'sniffer', 'dish'];

export const DANGER_LOOK: Record<string, { title: string; short: string; line: string; icon: SDIconName }> = {
  eclipse: { title: 'SAISON D’ÉCLIPSES', short: 'ÉCLIPSE', line: 'La planète cache le Soleil. L’énergie baisse.', icon: 'eclipse' },
  conjunction: { title: 'LE SOLEIL GÊNE', short: 'SOLEIL', line: 'Aucun appel vers la Terre pendant environ deux semaines.', icon: 'conj' },
  'solar-storm': { title: 'TEMPÊTE DE RADIATIONS', short: 'TEMPÊTE', line: 'Le Soleil crache des particules rapides qui grillent l’électronique.', icon: 'storm' },
  'cme-shock': { title: 'CHOC D’ÉJECTION', short: 'CME', line: 'Un nuage de plasma solaire percute Mars.', icon: 'storm' },
  'mars-dust-storm': { title: 'TEMPÊTE DE POUSSIÈRE', short: 'POUSSIÈRE', line: 'L’air de Mars gonfle et freine les orbites basses.', icon: 'dust' },
  debris: { title: 'POUSSIÈRE DE COMÈTE', short: 'DÉBRIS', line: 'De minuscules grains frappent plus vite que des balles.', icon: 'debris' },
  'reaction-wheel': { title: 'PANNE DE ROUE', short: 'ROUE', line: 'Une roue qui oriente le robot s’use.', icon: 'sys' },
  'memory-corruption': { title: 'BUG MÉMOIRE', short: 'MÉMOIRE', line: 'Les radiations font basculer des bits dans l’ordinateur.', icon: 'computer' },
  'insertion-anomaly': { title: 'FREINAGE D’ARRIVÉE RATÉ', short: 'ARRIVÉE', line: 'Le freinage ne se passe pas comme prévu.', icon: 'orbit' },
};

export const dangerLook = (id: string, title: string) => DANGER_LOOK[id] ?? { title: HAZARD_FR[id]?.title ?? title.toUpperCase(), short: HAZARD_FR[id]?.title ?? title.toUpperCase(), line: '', icon: 'sys' as SDIconName };

function deckWhenEn(c: DeckCard): string {
  if (c.kind === 'eclipse' || c.kind === 'conjunction') return 'CERTAIN · VOUS LE VOYEZ VENIR';
  return c.detectedBy === 'earth' ? 'SURPRISE · AVEC AVERTISSEMENT' : 'SURPRISE · SANS AVERTISSEMENT';
}
export const deckWhen = deckWhenEn;

export const STAMP: Record<DeckCard['stamp'], { word: string; short: string; color: string }> = {
  covered: { word: 'PROTÉGÉ', short: 'OK', color: 'var(--sd-ok)' },
  some: { word: 'EN PARTIE', short: 'PARTIEL', color: 'var(--sd-soso)' },
  none: { word: 'NON PROTÉGÉ', short: 'AUCUN', color: 'var(--sd-bad)' },
};

export const PACK_BLOCKER: Record<PackBlockerCode, string> = {
  'too-heavy': 'TROP LOURD POUR CETTE FUSÉE',
  'no-power': 'PAS ASSEZ D’ÉNERGIE',
  'no-fuel': 'PAS ASSEZ DE CARBURANT POUR Y ARRIVER',
  'no-capture': 'CE MOTEUR NE PEUT PAS FREINER EN ORBITE',
  'flight-too-long': 'CE VOL EST TROP LONG POUR LE JEU',
  'no-science': 'EMPORTEZ AU MOINS UN INSTRUMENT',
  'over-budget': 'BUDGET DÉPASSÉ : RETIREZ QUELQUE CHOSE',
  other: 'PAS PRÊT AU LANCEMENT',
};

/** SCIENCE ORBIT on the Mars Pack (spec UI rule 59) and the desktop tabs beside MISSION LIMITS. */
export const ORBIT_WORDS = {
  title: 'ORBITE SCIENTIFIQUE',
  label: 'Orbite scientifique',
  names: { capture: 'RESTER À L’ARRIVÉE', maven: 'L’ORBITE DE MAVEN', high: 'ORBITE HAUTE' } as Record<string, string>,
  lines: {
    capture: 'Aucune manœuvre après l’arrivée : le plus de carburant restant, et Déimos est proche. Phobos est loin en dessous.',
    maven: 'Plonge dans la haute atmosphère, comme MAVEN. Phobos est proche ; Déimos coûte beaucoup de carburant.',
    high: 'Au-dessus de presque toute l’atmosphère, près de Déimos. Déimos est proche ; Phobos coûte plus.',
  } as Record<string, string>,
  size: (low: string, high: string) => `${low} × ${high}`,
  change: (dv: string) => `CHANGEMENT D’ORBITE ${dv}`,
  fuel: (pct: string) => `MARGE DE CARBURANT ${pct}`,
  moons: (phobos: string, deimos: string) => `PHOBOS ${phobos} · DÉIMOS ${deimos}`,
  drag: (x: string) => `FREINAGE DE L’AIR ×${x}`,
  shadow: (t: string) => `OMBRE LA PLUS LONGUE ${t}`,
};

export const SIDE_TABS = {
  label: 'Choix de mission',
  preview: 'APERÇU',
  dangers: 'DANGERS',
  rocket: 'FUSÉE',
  orbit: 'ORBITE',
};

/** LIVE DESIGN PREVIEW on Pack (components/sd/LiveDesignPreview.tsx): the robot as packed, on top of its rocket. */
export const PREVIEW_WORDS = {
  title: 'APERÇU EN DIRECT',
  label: 'Aperçu en direct : le robot tel qu’il est emballé, sur sa fusée',
  sub: 'Votre robot, tel qu’il est emballé maintenant.',
  empty: 'Seulement le cerveau et le moteur pour l’instant. Touchez une pièce de l’étagère pour l’ajouter.',
  parts: (n: string) => `${n} PIÈCES À BORD`,
  on: (rocket: string) => `SUR ${rocket.toUpperCase()}`,
  /** The danger deck's drawer on a phone. */
  deckOpen: 'VOIR LE JEU DE DANGERS',
};

/** ROCKET on solo Pack (spec UI rule 58): lift, budget charge and flight record of each rocket on offer. */
export const ROCKET_WORDS = {
  title: 'FUSÉE',
  label: 'Fusée',
  lifts: (kg: string) => `SOULÈVE ${kg}`,
  tooHeavy: 'TROP LOURD POUR ELLE',
  standard: 'STANDARD · SANS SUPPLÉMENT',
  charge: (money: string) => `${money} SUR LE BUDGET`,
  refund: (money: string) => `${money} SUR LE BUDGET : MOINS CHER`,
  record: (ok: string, all: string) => `${ok} VOLS RÉUSSIS SUR ${all}`,
  ride: 'VOL PARTAGÉ · ',
  curveTitle: (name: string) => `${name} : charge utile selon C3`,
};

/** LAST FLIGHT on solo Pack and the report's NEXT TIME line (spec UI rule 60): change one thing and fly again. */
export const LAST_WORDS = {
  title: 'DERNIER VOL',
  label: 'Dernier vol',
  stars: (n: string) => `${n} étoiles sur 3`,
  science: (pct: string) => `${pct} DE LA SCIENCE RAPPORTÉE`,
  change: (signed: string) => `${signed} PAR RAPPORT AU DERNIER`,
  limitChange: (signed: string) => `LIMITE ${signed}`,
  nextTime: (part: string) => `LA PROCHAINE FOIS : EMPORTEZ ${part.toUpperCase()}.`,
};

/** MISSION LIMITS on solo Pack (spec UI rule 57): weight, budget, power and data as bars. */
export const LIMIT_WORDS = {
  title: 'LIMITES DE MISSION',
  label: 'Limites de mission',
  names: { weight: 'POIDS', budget: 'BUDGET', power: 'ÉNERGIE', data: 'DONNÉES' } as Record<LimitKey, string>,
  value: {
    weight: (used: string, limit: string) => `${used} SUR ${limit}`,
    budget: (used: string, limit: string) => `${used} SUR ${limit}`,
    power: (used: string, limit: string) => `BESOIN ${used} · DISPO ${limit}`,
    data: (used: string, limit: string) => `${used} SUR ${limit} PAR JOUR`,
  } as Record<LimitKey, (used: string, limit: string) => string>,
  status: { ok: 'OK', warning: 'PRESQUE PLEIN', over: 'DÉPASSÉ' } as Record<MeterStatus, string>,
  preview: (part: string) => `SI VOUS EMPORTEZ : ${part.toUpperCase()}`,
  bar: (name: string, value: string, status: string) => `${name}: ${value}, ${status}`,
};

export const PACK_WORDS = {
  noRoom: 'PLUS DE PLACE DANS LA COIFFE',
  step: 'EMPORTER',
  shelf: 'ÉTAGÈRE DE PIÈCES',
  shelfLabel: 'Étagère de pièces',
  tapToPack: 'TOUCHEZ POUR EMPORTER',
  shelfEmpty: 'ÉTAGÈRE VIDE. TOUT EST EMBALLÉ.',
  pack: (name: string, fits: boolean) => `Emporter ${name}${fits ? '' : ' (pas de place)'}`,
  fits: (n: string) => `TIENT · ${n} CASES`,
  fitsShort: (n: string) => `${n} CASES`,
  wontFit: 'NE TIENT PAS',
  noRoomShort: 'PAS DE PLACE',
  earnsData: 'Rapporte des données',
  covers: (danger: string) => `Protège contre : ${danger.toLowerCase()}`,
  /** The nose and the weight meter. */
  fairing: 'Coiffe et poids',
  nose: 'COIFFE DE LA FUSÉE',
  noseLabel: 'Coiffe de la fusée',
  noseState: (state: string) => `Coiffe : ${state}`,
  full: 'PLEINE · PLUS RIEN NE TIENT',
  fullShort: 'PLEINE',
  left: (n: string) => `${n} CASES LIBRES`,
  alwaysPacked: (name: string) => `${name} · toujours emporté`,
  alwaysPackedLabel: (name: string) => `${name} (toujours emporté)`,
  tapToUnpack: (name: string) => `${name} · touchez pour retirer`,
  unpack: (name: string) => `Retirer ${name}`,
  weight: 'POIDS',
  weightLabel: 'Poids',
  /** The danger deck. */
  deck: 'Jeu de dangers',
  deckOf: (dest: string) => `JEU DE DANGERS · ${dest.toUpperCase()}`,
  deckLabel: (dest: string) => `Jeu de dangers : ${dest}`,
  deckSub: 'Faces visibles. Vous savez ce qui arrive.',
  /** The launch panel (Pack and Launch Day). */
  checklist: 'Liste de lancement',
  arm: 'ARMER',
  armLabel: 'Armer',
  launch: 'LANCEMENT',
  lesson: (title: string) => `LEÇON · ${title.toUpperCase()}`,
  lessonTitle: 'la leçon',
  lessonLearned: '★ LEÇON APPRISE',
};

/** The top bar's brand: the game's name goes Home; under it, the mission and where it flies. */
export const BRAND_WORDS = {
  home: 'Signal Delay : accueil',
  sub: (mission: string, dest: string) => `${mission.toUpperCase()} · VERS ${dest.toUpperCase()}`,
};

/** PACK — FLY — REPORT (BUILD in Engineer mode). */
export const STEP_WORDS = { label: 'Étapes de la mission', pack: 'EMBALLER', build: 'CONSTRUIRE', fly: 'VOLER', report: 'RAPPORT' };

/** "No fuel" with the part that clears it (engine packBlockers `fix`), so the player learns why. */
function fuelFixWordsEn(fix: FuelFix): string {
  const pack = `EMPORTEZ : ${PART_LOOK[fix.part].name.toUpperCase()}`;
  return fix.why === 'station-keeping' ? `${pack} — L’ORBITE À ${f.km(fix.orbitAlt_m).toUpperCase()} DEMANDE DES CORRECTIONS CHAQUE MOIS` : pack;
}
export const fuelFixWords = fuelFixWordsEn;

export const DAY_WORDS: Record<'good' | 'soso' | 'bad', { msg: (dest: string) => string; short: string }> = {
  good: { msg: (d) => `BON JOUR · ${d.toUpperCase()} EST À PORTÉE`, short: 'BON' },
  soso: { msg: () => 'MOYEN · PEU DE MARGE', short: 'MOYEN' },
  bad: { msg: (d) => `MAUVAIS JOUR · ${d.toUpperCase()} EST HORS DE PORTÉE`, short: 'MAUVAIS' },
};

/** The Launch Day step, and the one-line launch day on Pack (spec UI rules 24 and 26). */
export const LAUNCH_DAY_WORDS = {
  title: 'JOUR DE LANCEMENT',
  head: (span: string) => `JOUR DE LANCEMENT · ${span}`,
  daysLabel: 'Jour de lancement',
  sub: 'Six semaines de jours de lancement. Vert : un voyage facile. Orange : peu de marge. Rouge : hors de portée.',
  line: 'JOUR DE LANCEMENT',
  auto: 'MEILLEUR JOUR · CHOISI POUR VOUS',
  yours: 'VOTRE CHOIX',
  change: 'CHANGER ▸',
  arrives: 'ARRIVÉE',
  flight: 'VOL',
  best: 'MEILLEUR JOUR',
  useBest: 'PRENDRE LE MEILLEUR JOUR',
  working: 'CALCUL DES JOURS DE LANCEMENT…',
  c3: 'C3 · v∞ À L’ARRIVÉE',
  margins: 'MARGES · MASSE · Δv',
};

export const WEIGHT_WORDS: Record<'ok' | 'warning' | 'over', string> = {
  ok: 'ASSEZ LÉGER',
  warning: 'PRESQUE TROP LOURD',
  over: 'TROP LOURD POUR CETTE FUSÉE',
};

/** "NOV 1" from an ISO date. */
export const shortDate = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase();
/** A date with its year, in words: "Dec 11, 1998" (format.ts isoDate). */
export const fullDate = (iso: string) => f.isoDate(iso);
/** A count of days in a readout: "365 days" (format.ts days). */
export const dayCount = (n: number) => f.days(n);
/** A date as the CRT prints it: "21 OCT 2026" (format.ts crtDate). */
export const crtDate = (iso: string) => f.crtDate(iso);
/** "NOV–DEC 2013" for the calendar head. */
function monthSpanEn(fromIso: string, toIso: string): string {
  const m = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('fr-FR', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  const y = toIso.slice(0, 4);
  return m(fromIso) === m(toIso) ? `${m(fromIso)} ${y}` : `${m(fromIso)}–${m(toIso)} ${y}`;
}
export const monthSpan = monthSpanEn;

// ---------------------------------------------------------------------------
// Mission Report


const hazardTitle = (type: string, title: string) => (DANGER_LOOK[type]?.title ?? HAZARD_FR[type]?.title ?? title.toUpperCase());

export interface PanelWords {
  head: string;
  text: string;
}

/** Caption for a comic panel. `label` gives a choice's short label, `title` a hazard's engine title. */
function panelWordsEn(
  p: ReportPanel,
  ctx: { dest: string; rocket: string; label: (type: string, id: string) => string; title: (type: string) => string; autopilot: boolean; sent_Gbit: number },
): PanelWords {
  const day = `JOUR ${f.num(p.day)}`;
  switch (p.kind) {
    case 'launch':
      return { head: `${day} · DÉCOLLAGE`, text: `Parti sur une ${ctx.rocket}. Le robot est seul maintenant.` };
    case 'launch-failed':
      return { head: `${day} · LANCEMENT RATÉ`, text: 'La fusée a échoué le jour du lancement. Les fusées ne sont pas parfaites.' };
    case 'not-launched':
      return { head: `${day} · NON LANCÉ`, text: 'La sonde n’a jamais quitté le sol.' };
    case 'hazard': {
      const t = hazardTitle(p.hazardType!, ctx.title(p.hazardType!));
      const label = ctx.label(p.hazardType!, p.optionId!);
      const how = p.bad ? `Ça a mal tourné : ${RESULT_EFFECT_CHIP[p.effect ?? 'safe-mode'].toLowerCase()}.` : 'Ça a marché.';
      const who =
        p.by === 'standing-order' ? `Le robot a suivi son ordre : ${label}.` : p.by === 'fault-protection' ? `Pas d’ordre à temps. Le robot a choisi : ${label}.` : `Vous avez choisi : ${label}.`;
      return { head: `${day} · ${t}`, text: `${who} ${how}` };
    }
    case 'arrival':
      return { head: `${day} · ARRIVÉE À ${ctx.dest.toUpperCase()}`, text: `Un long freinage. ${ctx.dest} vous a capturé.` };
    case 'conjunction':
      return {
        head: `${day} · LE SOLEIL GÊNE`,
        text: `Pas de radio pendant ${f.num(p.blackoutDays ?? 0)} jours. ${ctx.autopilot ? 'Le pilote auto a volé seul.' : 'Le robot a attendu.'}`,
      };
    case 'lost':
      return { head: `${day} · CONTACT PERDU`, text: 'Le robot s’est tu. Personne ne l’a plus jamais entendu.' };
    case 'complete':
      return { head: `${day} · MISSION ACCOMPLIE`, text: `Science terminée : ${f.gbit(ctx.sent_Gbit)} envoyés sur Terre.` };
  }
}
export const panelWords = panelWordsEn;

export const PANEL_SOUND: Partial<Record<string, string>> = {
  'solar-storm': 'ZZZT !',
  'cme-shock': 'BOUM !',
  'mars-dust-storm': 'FIIIOUU',
  debris: 'PING !',
  'reaction-wheel': 'GRRRK',
  'memory-corruption': 'BIP ?',
  'insertion-anomaly': 'FLOUMP',
};

/** The three stars (v0.8: they follow the science returned; the rules are the engine's STAR_RULES). */
export const STAR_WORDS = (_dest: string) => ['PREMIÈRE SCIENCE RAPPORTÉE', 'LA MOITIÉ DE LA SCIENCE', 'LA PLUPART DE LA SCIENCE'] as const;

const CATEGORY_WORD: Record<Category, string> = {
  science: 'science envoyée sur Terre',
  success: 'phases de la mission',
  budget: 'le budget',
  deltaV: 'la marge de carburant',
  power: 'la marge d’énergie',
  mass: 'la marge de poids',
  crisis: 'la gestion de crise',
};
export const CATEGORY_NAME: Record<Category, string> = {
  science: 'SCIENCE',
  success: 'RÉUSSITE',
  budget: 'BUDGET',
  deltaV: 'MARGE Δv',
  power: 'MARGE D’ÉNERGIE',
  mass: 'MARGE DE MASSE',
  crisis: 'GESTION DE CRISE',
};

function savedWordsEn(v: Saved, ctx: { label: (type: string, id: string) => string; title: (type: string) => string }): { strong: string; rest: string } {
  switch (v.code) {
    case 'part':
      return { strong: `${PART_LOOK[v.part].name}`, rest: `. Grâce à elle, le danger « ${hazardTitle(v.hazardType, ctx.title(v.hazardType)).toLowerCase()} » a été bien moins grave.` };
    case 'autopilot':
      return { strong: 'La puce pilote auto', rest: `. Elle a répondu seule au danger « ${hazardTitle(v.hazardType, ctx.title(v.hazardType)).toLowerCase()} ».` };
    case 'choice':
      return { strong: `Choisir « ${ctx.label(v.hazardType, v.optionId).toLowerCase()} »`, rest: ` face au danger « ${hazardTitle(v.hazardType, ctx.title(v.hazardType)).toLowerCase()} ».` };
    case 'quiet':
      return { strong: 'Une bonne préparation', rest: '. Rien n’a mal tourné cette fois.' };
  }
}
export const savedWords = savedWordsEn;

function hurtWordsEn(v: Hurt, ctx: { label: (type: string, id: string) => string; title: (type: string) => string }): { strong: string; rest: string } {
  switch (v.code) {
    case 'bad-outcome':
      return {
        strong: `“${ctx.label(v.hazardType, v.optionId).toLowerCase()}”`,
        rest: ` pendant le danger « ${hazardTitle(v.hazardType, ctx.title(v.hazardType)).toLowerCase()} » : ${RESULT_EFFECT_CHIP[v.effect].toLowerCase()}.`,
      };
    case 'category':
      return { strong: CATEGORY_WORD[v.category], rest: ` n’a obtenu que ${f.num(v.score)} sur 100.` };
    case 'nothing':
      return { strong: 'Rien de grave', rest: '. Chaque score était correct ou mieux.' };
  }
}
export const hurtWords = hurtWordsEn;

export const REPORT_STAMP: Record<'complete' | 'extended' | 'lost' | 'not-launched', { word: string[]; color: string }> = {
  complete: { word: ['MISSION', 'ACCOMPLIE'], color: 'var(--sd-ok)' },
  extended: { word: ['MISSION', 'PROLONGÉE'], color: 'var(--sd-soso)' },
  lost: { word: ['ROBOT', 'PERDU'], color: 'var(--sd-red)' },
  'not-launched': { word: ['NON', 'LANCÉ'], color: 'var(--sd-red)' },
};

/**
 * FINAL TRANSMISSION (Mission Report, design TELETYPE 03): the robot's last message, line by line (engine
 * finalTransmission). Templates with named slots, like the robot's voice: {day} {dest} {name} {science} {hazard}
 * {when} {option} {part} {dv} {days} {fuel} {years} {delay}.
 */
export const FINAL_WORDS = {
  kicker: (day: string) => `TÉLÉSCRIPTEUR 03 · REÇU JOUR ${day}`,
  incomplete: 'INCOMPLET',
  sent: (delay: string) => `ENVOYÉ ${delay} AVANT L’IMPRESSION`,
  title: (name: string) => `DERNIÈRE TRANSMISSION — ${name}`,
  opening: {
    complete: 'JOUR {day}. J’AI VU {dest} PENDANT {science} JOURS.',
    lost: 'JOUR {day}. ICI {name}. VOUS ÊTES LÀ ?',
    extended: 'JOUR {day}. MISSION PRINCIPALE ACCOMPLIE. LA PROLONGATION AUSSI.',
  },
  hurt: '{hazard} DU JOUR {when} M’A BLESSÉ. {effect}',
  effect: {
    craft: 'J’AI FAILLI NE PAS M’EN SORTIR.',
    instrument: 'UN INSTRUMENT NE S’EST JAMAIS RÉVEILLÉ.',
    'stored-data': 'LES DONNÉES QUE JE GARDAIS SONT PERDUES.',
    'safe-mode': 'JE ME SUIS CACHÉ EN MODE SÉCURITÉ PENDANT DES JOURS.',
  } satisfies Record<FailureEffect, string>,
  saved: {
    part: '{part} A ENCAISSÉ {hazard} POUR MOI.',
    autopilot: 'AUCUN ORDRE NE POUVAIT M’ATTEINDRE À TEMPS. LA PUCE PILOTE AUTO M’A FAIT TRAVERSER {hazard}.',
    choice: 'LE JOUR {when}, VOUS AVEZ CHOISI {option}. ÇA M’A SAUVÉ.',
  },
  arrival: 'VOUS M’AVEZ FAIT ENTRER AVEC UN FREINAGE DE {dv}. {dest} M’A CAPTURÉ DU PREMIER COUP.',
  conjunction: 'PENDANT {days} JOURS, LE SOLEIL ÉTAIT ENTRE NOUS. J’AI VOLÉ SEUL.',
  quiet: 'RIEN N’A CASSÉ. PAS UNE FOIS.',
  fuel: 'IL RESTE {fuel} DE CARBURANT. LA BATTERIE TIENT.',
  extension: 'PROLONGATION VOLÉE : {years} DE PLUS QUE PRÉVU.',
  signOff: 'MISSION PRINCIPALE ACCOMPLIE. ICI {name}, TERMINÉ.',
  cause: {
    hazard: '{hazard} ÉTAIT DE TROP. LES SYSTÈMES LÂCHENT.',
    fuel: 'MON RÉSERVOIR EST VIDE. JE NE PEUX PLUS TENIR MON CAP.',
    power: 'PAS D’ÉNERGIE DEPUIS {days} JOURS. BATTERIE PRESQUE VIDE.',
    unknown: 'QUELQUE CHOSE NE VA PAS. LES SYSTÈMES LÂCHENT.',
  },
  /** Broken off mid-word on purpose: the signal ends here. */
  cutOff: 'JE TOURNE MON ANTENNE VERS LÀ OÙ LA TERRE DEVRAIT ÊT',
  lost: '— SIGNAL PERDU —',
  still: 'TOUJOURS LÀ.',
  foot: {
    complete: 'Les derniers mots avaient déjà {delay} quand le papier a bougé.',
    lost: 'Le Deep Space Network a continué d’écouter. Rien d’autre n’est arrivé.',
    extended: 'Pas un adieu finalement : la mission est finie, pas le robot.',
  },
  feed: 'FAIRE AVANCER LE PAPIER · RAPPORT DE MISSION ▾',
  label: 'Dernière transmission',
};

/** Every line of a final transmission, in words. */
function finalLinesEn(
  ft: FinalTransmission,
  ctx: { dest: string; name: string; title: (type: string) => string; label: (type: string, id: string) => string },
): string[] {
  const W = FINAL_WORDS;
  const years = (n: number) => `${f.num(n)} ${n === 1 ? 'AN' : 'ANS'}`;
  return ft.lines.map((l) => {
    const v = l.values;
    const hazard = v.hazardType ? hazardTitle(v.hazardType, ctx.title(v.hazardType)).toUpperCase() : '';
    const slots: Record<string, string> = {
      dest: ctx.dest.toUpperCase(),
      name: ctx.name.toUpperCase(),
      hazard,
      ...(v.day !== undefined ? { day: f.dayPad(v.day), when: f.num(v.day) } : {}),
      ...(v.scienceDays !== undefined ? { science: f.num(v.scienceDays) } : {}),
      ...(v.dv_ms !== undefined ? { dv: f.speed(v.dv_ms).toUpperCase() } : {}),
      ...(v.days !== undefined ? { days: f.num(v.days) } : {}),
      ...(v.propellantLeft_kg !== undefined ? { fuel: f.kg(v.propellantLeft_kg).toUpperCase() } : {}),
      ...(v.years !== undefined ? { years: years(v.years) } : {}),
    };
    switch (l.kind) {
      case 'opening':
        return fill(W.opening[ft.ending], slots);
      case 'hurt':
        return fill(W.hurt, { ...slots, effect: v.effect ? W.effect[v.effect] : '' }).trim();
      case 'saved': {
        const s = v.saved!;
        if (s.code === 'part') return fill(W.saved.part, { ...slots, part: PART_LOOK[s.part].name.toUpperCase(), hazard: hazardTitle(s.hazardType, ctx.title(s.hazardType)).toUpperCase() });
        if (s.code === 'autopilot') return fill(W.saved.autopilot, { ...slots, hazard: hazardTitle(s.hazardType, ctx.title(s.hazardType)).toUpperCase() });
        if (s.code === 'choice') return fill(W.saved.choice, { ...slots, option: ctx.label(s.hazardType, s.optionId).toUpperCase() });
        return W.quiet;
      }
      case 'arrival':
        return fill(W.arrival, slots);
      case 'conjunction':
        return fill(W.conjunction, slots);
      case 'quiet':
        return W.quiet;
      case 'fuel':
        return fill(W.fuel, slots);
      case 'extension':
        return fill(W.extension, slots);
      case 'sign-off':
        return fill(W.signOff, slots);
      case 'cause':
        return fill(W.cause[v.cause ?? 'unknown'], slots);
      case 'cut-off':
        return W.cutOff;
    }
  });
}
export const finalLines = finalLinesEn;

// ---------------------------------------------------------------------------
// Briefings, coach panels, launch checklist and navigation (plain words for every player)

export interface Briefing {
  /** What the player has to do, in one or two sentences. */
  job: string;
  /** One tip that helps on this mission. */
  tip: string;
}

export const BRIEFING: Record<string, Briefing> = {
  'moon-1': {
    job: 'Envoyez un petit robot sur la Lune et gardez-le chargé pendant qu’il prend des photos.',
    tip: 'Emportez des ailes solaires et une batterie. Le robot a aussi besoin d’énergie dans l’ombre de la Lune.',
  },
  'moon-2': {
    job: 'Atteignez la Lune avec assez de carburant pour ralentir et rester en orbite.',
    tip: 'Le carburant est lourd, et la fusée doit soulever chaque gramme. Surveillez la jauge de poids.',
  },
  'moon-3': {
    job: 'Construisez tout le robot vous-même : science, énergie, radio et carburant. Puis faites-le voler.',
    tip: 'Les pièces scientifiques collectent des données. Une plus grande antenne les envoie plus vite.',
  },
  mars: {
    job: 'Envoyez un robot sur Mars et gardez-le en vie pendant qu’il étudie la planète.',
    tip: 'Mars est à plusieurs minutes par radio, donc vos ordres arrivent en retard. Répondez tôt aux cartes danger.',
  },
  venus: {
    job: 'Envoyez un robot radar vers Vénus la nuageuse sans tomber à court d’argent.',
    tip: 'Le budget de ce niveau est petit : tous les instruments ne rentrent pas. Surveillez la barre BUDGET ; un robot qui casse ne rapporte rien.',
  },
  bennu: {
    job: 'Rejoignez un petit astéroïde, étudiez-le et rapportez un échantillon de cailloux.',
    tip: 'Un astéroïde n’a presque pas de gravité. Du carburant en réserve vous protège près de lui.',
  },
  jupiter: {
    job: 'Découvrez si une fusée peut envoyer un robot directement de la Terre à Jupiter.',
    tip: 'Si rien ne passe sur la jauge de poids, c’est la leçon : les vraies missions passent d’abord près d’autres planètes.',
  },
};

export const FREE_BRIEFING: Briefing = {
  job: 'Construisez le robot que vous voulez, lancez-le et gardez-le en vie jusqu’à la fin de la mission.',
  tip: 'Emportez des pièces qui couvrent les dangers à droite. Chacune montre contre quel danger elle aide.',
};

export const DAILY_BRIEFING: Briefing = {
  job: 'La mission du jour est la même pour tous les joueurs. Gardez le robot en vie et comparez votre résultat.',
  tip: 'Vous n’avez qu’un essai par jour, alors lisez chaque carte danger avant de choisir.',
};

/** A DONKI time as the record writes it: "2024-05-10 17:00 UTC". */
const donkiTime = (t: string) => t.replace('T', ' ').replace('Z', ' UTC');

/** The Daily's space weather (spec UI rule 37): real DONKI storms, or the seeded stand-in when the file can't be read. */
export const LIVE_WEATHER = {
  live: 'SOLEIL EN DIRECT · NASA DONKI',
  /** The danger card's "arrives in" ⓘ title for a real CME. */
  prediction: 'PRÉVISION DU MODÈLE NASA WSA-ENLIL',
  /** ENLIL severity on a real CME card. */
  severity: { direct: 'IMPACT DIRECT', glancing: 'IMPACT RASANT', minor: 'IMPACT MINEUR' },
  /** Context: the flare a real storm came from. */
  fromFlare: (cls: string) => `Venant d’une éruption de classe ${cls}.`,
  offline: 'HORS LIGNE — MÉTÉO SIMULÉE',
  homeLive: 'La même mission pour tous aujourd’hui, avec les vraies tempêtes solaires de cette semaine.',
  homeOffline: 'La même mission pour tous aujourd’hui. Hors ligne — météo simulée.',
  briefLive: 'Les tempêtes solaires de ce vol ont vraiment eu lieu sur le Soleil cette semaine. La base DONKI de la NASA les a enregistrées ; touchez ⓘ sur une carte tempête pour voir l’archive.',
  briefOffline: 'Hors ligne — météo simulée. Le vrai fichier de météo spatiale n’a pas pu être lu, donc les tempêtes du jour sont inventées.',
  realKicker: 'CARTE DANGER · VRAI SOLEIL',
  /** What DONKI observed, on a real storm's card (the same words as the engine's record, spaceWeather.ts stormSourced). */
  event: (s: RealStorm) =>
    `${
      s.kind === 'sep'
        ? `Événement de particules solaires énergétiques le ${donkiTime(s.time)}${s.instruments?.length ? `, vu par ${s.instruments.join(', ')}` : ''}`
        : `Éjection de masse coronale${s.speed_kms !== undefined ? ` à ${f.num(s.speed_kms)} km/s` : ''} le ${donkiTime(s.time)}`
    }${s.flare ? `, venant d’une éruption solaire ${s.flare}` : ''}`,
  realEvent: 'ÉVÉNEMENT RÉEL · NASA DONKI',
  realOn: 'RÉEL',
  shareLive: '☀️ vrai Soleil · NASA DONKI',
  shareOffline: '☁️ hors ligne · météo simulée',
};

/** The four steps of every mission. */
export const MISSION_STEPS_WORDS: { word: string; line: string }[] = [
  { word: 'EMBALLER', line: 'Choisissez les pièces qui tiennent dans la coiffe de la fusée.' },
  { word: 'LANCER', line: 'Choisissez un jour de lancement vert, armez, appuyez sur LANCEMENT.' },
  { word: 'VOLER', line: 'Laissez le temps passer. Répondez aux cartes danger quand elles arrivent.' },
  { word: 'RAPPORT', line: 'Voyez votre résultat et gagnez des étoiles.' },
];

/** How the three stars are earned, in plain words (the rules are the engine's STAR_RULES). */
export const STAR_GOALS = (dest: string): string[] => [
  `Atteindre ${dest} et envoyer la première science sur Terre.`,
  'Rapporter la moitié de la science de la mission.',
  'Rapporter la plupart de la science de la mission.',
];

/** A real mission that flew there, for the briefing. */
export const REAL_MISSION_LINE = (label: string) => `Vraie mission NASA qui y est allée : ${label}.`;

export interface CoachPanel {
  icon: SDIconName;
  title: string;
  body: string;
}

/** How to fly: the coach panels on the first flight, the ? button and HOW TO PLAY. */
export const COACH: CoachPanel[] = [
  { icon: 'play', title: 'LAISSEZ LE TEMPS PASSER', body: 'Appuyez sur 10×, 100× ou 1000× en bas pour voler. Appuyez sur II pour faire pause. Le temps continue après chaque carte.' },
  { icon: 'storm', title: 'CARTES DANGER', body: 'Quand un problème approche, le temps s’arrête et une carte apparaît. Choisissez une réponse : chacune montre ce qu’elle coûte.' },
  { icon: 'dish', title: 'LES ORDRES VOYAGENT LENTEMENT', body: 'Votre ordre traverse l’espace à la vitesse de la lumière. Il peut mettre des minutes à atteindre le robot : agissez tôt.' },
  { icon: 'power', title: 'SURVEILLEZ LES QUATRE BARRES', body: 'Énergie, carburant, données et systèmes sont en haut. Gardez-les hors du rouge.' },
  { icon: 'postcard', title: 'VOTRE ROBOT ÉCRIT À LA TERRE', body: 'Ses messages traversent aussi l’espace à la vitesse de la lumière. Quand sa science arrive sur Terre, vous recevez de vraies cartes postales de la NASA.' },
  { icon: 'star', title: 'ALLEZ JUSQU’AU BOUT', body: 'À la fin de la mission, vous recevez votre rapport et vos étoiles. Pressé ? TERMINER LA MISSION laisse le robot finir seul.' },
];

export const HOW_TO_PLAY = { label: 'COMMENT JOUER', sub: 'Nouveau ici ? Apprenez le jeu en une minute.' };

/** MARS RIGHT NOW on Home (engine marsNow: today's JPL ephemeris, no internet needed). */
/** Home's second row (spec UI rule 28): the smaller keys after PLAY and the DAILY. */
export const HOME_WORDS = {
  more: 'Plus',
  kicker: 'CONTRÔLE DE MISSION · ESPACE LOINTAIN',
  pitch: 'VOUS NE PILOTEZ PAS LA FUSÉE. VOUS GARDEZ EN VIE UN ROBOT À DES MILLIONS DE KM, ET CHAQUE ORDRE ARRIVE AVEC DES MINUTES DE RETARD.',
  play: 'JOUER',
  playLabel: (n: string, title: string) => `Jouer : mission ${n}, ${title}`,
  mission: (n: string, title: string) => `Mission ${n} · ${title}`,
  choose: 'CHOISIR UNE MISSION ▸',
  /** The demo order on the CRT. */
  order: 'ORDRE : ALLUMER LA CAMÉRA',
  untilHeard: 'AVANT QUE LE ROBOT VOUS ENTENDE',
  received: 'REÇU ✓',
  earth: 'TERRE',
  daily: 'MISSION DU JOUR',
  dailySub: (n: string, weather: string) => `Mission du jour n° ${n}. ${weather}`,
  dailyQuiet: 'La même mission pour tous aujourd’hui.',
  dailyDone: 'FAITE ✓',
  dailyNew: 'NOUVELLE AUJOURD’HUI',
  rescue: 'HISTOIRES DE SAUVETAGE',
  rescueSub: 'De vrais robots qui ont failli disparaître. Essayez de les sauver.',
  count: (got: string, total: string) => `${got} SUR ${total}`,
};

/** The CADET / ENGINEER lever. */
export const MODE_WORDS = { cadet: 'CADET', engineer: 'INGÉNIEUR', short: 'ING.', kids: 'PETIT ASTRONAUTE', kidsLabel: 'Petit Astronaute : une première mission spatiale avec le robot, pour les quatre à dix ans' };

/** PETIT ASTRONAUTE (screens/KidsMode.tsx) : la boucle Cadet pour les petits (un lieu, la fusée, le vol, un bilan en images). */
export const KIDS_WORDS = {
  title: 'PETIT ASTRONAUTE',
  hello: 'Salut ! Je suis un robot de l’espace.',
  helpMe: 'Tu m’aides à faire ma première mission ?',
  start: 'C’EST PARTI !',
  where: 'On va où ? Ce sont de vraies photos de la NASA !',
  places: { moon: 'La Lune', mars: 'Mars' },
  pack: 'Remplis ma fusée ! Touche ce que je dois emporter.',
  parts: {
    camera: { name: 'Appareil photo', says: 'Un appareil photo, pour prendre des photos !' },
    solar: { name: 'Panneaux solaires', says: 'Les panneaux font de l’énergie avec le Soleil !' },
    battery: { name: 'Batterie', says: 'Une batterie pour tenir dans le noir !' },
    dish: { name: 'Grande radio', says: 'Une grande radio, pour appeler la maison !' },
    shield: { name: 'Bouclier', says: 'Un bouclier contre les tempêtes du Soleil !' },
  } as Record<string, { name: string; says: string }>,
  out: 'Retour sur l’étagère !',
  need: 'Il me manque celui qui brille !',
  ready: 'Ma fusée est prête ! Appuie sur le gros bouton !',
  launch: 'DÉCOLLAGE !',
  legs: {
    launch: 'Trois, deux, un… décollage !',
    cruise: 'Youpi ! On vole dans l’espace !',
    arrive: 'On est arrivés ! Je freine.',
    explore: 'J’explore ! Bip bip !',
    done: 'Mission terminée !',
  },
  flyingTo: { moon: 'Youpi ! En route pour la Lune !', mars: 'Youpi ! En route pour Mars !' },
  danger: 'Oh oh ! Attention, il arrive quelque chose !',
  dangers: {
    'solar-storm': 'Une tempête arrive du Soleil !',
    'cme-shock': 'Un gros souffle arrive du Soleil !',
    'mars-dust-storm': 'Une grosse tempête de poussière sur Mars !',
    debris: 'Des petits cailloux de l’espace devant nous !',
    'reaction-wheel': 'Une de mes roues tourne mal !',
    'memory-corruption': 'Mon ordinateur a la tête qui tourne !',
    'insertion-anomaly': 'Mes freins font des bêtises !',
  } as Record<string, string>,
  careful: 'PRUDENCE',
  brave: 'ON CONTINUE',
  answered: 'D’accord ! Je fais ça.',
  photos: 'Je prends quoi en photo ? Touche jusqu’à trois.',
  snap: 'CLIC CLAC !',
  cheers: ['Super !', 'Génial !', 'Waouh !', 'Bravo !'],
  good: 'On a réussi ! Merci de m’avoir aidé !',
  lost: 'Oh non, je me suis perdu dans l’espace. Mais j’ai appris plein de choses ! On réessaie ?',
  stars: 'Étoiles de la mission',
  myPhotos: 'MES PHOTOS',
  nextTime: 'La prochaine fois, emportons aussi ça :',
  photo: 'UNE VRAIE PHOTO DE LA NASA',
  facts: 'VRAIS FAITS DE L’ESPACE',
  again: 'ON REVOLE',
  home: 'ACCUEIL',
  rocket: 'Ta fusée',
  progress: 'Où on en est',
};
/** Les vrais faits de PETIT ASTRONAUTE (moteur kidsTrip). */
export const kidsFar = (dest: 'moon' | 'mars', dist: string) => (dest === 'moon' ? `La Lune est à ${dist} de la Terre.` : `Aujourd’hui, Mars est à ${dist} de la Terre.`);
export const kidsHello = (time: string) => `Un « coucou » par radio met ${time} pour y arriver !`;
export const kidsMission = (name: string, days: string) => `Le vrai robot de la NASA ${name} a mis ${days} pour y aller.`;

/** The mission briefing's frame (its words per level are BRIEFING). */
/** What each level teaches and its line on the mission map. */
export const LEVEL_WORDS = {
  /** Each level's title (levels.ts reads it, so it follows the language). */
  title: {
    'moon-1': 'Première lumière',
    'moon-2': 'Charge lourde',
    'moon-3': 'Construction complète',
    mars: 'Planète rouge',
    venus: 'Plongeur des nuages',
    bennu: 'Attrape-cailloux',
    jupiter: 'Pas de géant',
  } as Record<string, string>,
  teaches: {
    'moon-1': 'Énergie',
    'moon-2': 'Carburant et poids',
    'moon-3': 'Science et radio',
    mars: 'Délai de la lumière',
    venus: 'Budget',
    bennu: 'Rendez-vous et retour',
    jupiter: 'Limites des fusées',
  } as Record<string, string>,
  blurb: {
    'moon-1': 'Choisissez des ailes solaires qui gardent votre sonde chargée.',
    'moon-2': 'Chaque kilo de carburant doit aussi être soulevé.',
    'moon-3': 'Construisez toute la sonde vous-même.',
    mars: 'Trop loin pour piloter en direct : donnez des ordres à votre sonde.',
    venus: 'Gros radar, petit budget. Surveillez la barre de budget.',
    bennu: 'Rejoignez un astéroïde et rapportez un échantillon.',
    jupiter: 'Une fusée peut-elle atteindre Jupiter directement depuis la Terre ?',
  } as Record<string, string>,
};

/** The mission map (screens/LevelMap.tsx). */
export const LEVEL_MAP_WORDS = {
  kicker: 'Carte des missions',
  title: 'Où allez-vous voler ensuite ?',
  helper: 'Chaque mission enseigne une nouvelle idée. Gagnez une étoile pour ouvrir la suivante.',
  total: 'Étoiles gagnées',
  dest: (name: string) => name.replace(/ \(.*\)$/, ''),
  node: (title: string, dest: string, teaches: string, open: boolean) => `${title} : ${dest}, apprendre ${teaches}${open ? '' : ' (verrouillée)'}`,
  learn: (teaches: string) => `Apprendre : ${teaches}`,
  stars: (n: string, max: string) => `${n} étoiles sur ${max}`,
  rescue: 'Histoires de sauvetage',
  rescueSub: 'Trouvez le bug d’une vraie mission perdue, avant son lancement.',
};

export const BRIEF_WORDS = {
  label: 'Briefing de mission',
  daily: 'Mission du jour',
  free: 'Construction libre',
  kicker: (dest: string) => `BRIEFING DE MISSION · ${dest.toUpperCase()}`,
  learn: (concept: string) => `VOUS ALLEZ APPRENDRE : ${concept.toUpperCase()}`,
  job: 'VOTRE MISSION',
  tip: 'ASTUCE :',
  stars: 'COMMENT GAGNER DES ÉTOILES',
  steps: 'LES ÉTAPES',
};

export const MARS_NOW = {
  title: 'MARS EN CE MOMENT',
  away: 'de distance',
  takes: 'Un message met',
  oneWay: 'aller simple',
  next: 'Prochaine conjonction solaire',
  in: 'dans',
  now: 'CONJONCTION SOLAIRE EN COURS : le Soleil est entre la Terre et Mars. Les missions suspendent leurs ordres.',
  until: 'jusqu’au',
};

/** The Pack launch checklist, in order. */
export const LAUNCH_CHECKS = {
  objective: 'CHOISIR UN OBJECTIF',
  packed: 'EMPORTER DES PIÈCES QUI TIENNENT',
  day: 'CHOISIR UN JOUR DE LANCEMENT VERT',
  arm: 'ACTIVER L’INTERRUPTEUR ARMER',
  go: 'APPUYER SUR LANCEMENT',
} as const;

export const NAV = {
  back: '◂ RETOUR',
  backLabel: 'Retour',
  home: 'ACCUEIL',
  info: 'INFOS MISSION',
  help: 'COMMENT VOLER',
  start: 'COMPRIS ▸',
  next: 'SUIVANT ▸',
  prev: '◂ PRÉC.',
  finish: 'TERMINER LA MISSION ▸▸',
  skip: 'PASSER',
};

export const FINISH_CONFIRM = {
  title: 'TERMINER LA MISSION ?',
  body: 'Le robot finit seul. Il répond à chaque danger avec son plan intégré, puis vous voyez votre rapport.',
  yes: 'TERMINER LA MISSION ▸▸',
  no: 'CONTINUER À VOLER',
};

export const LEAVE_CONFIRM = {
  title: 'QUITTER CE VOL ?',
  body: 'Ce vol s’arrête et vous revenez à l’écran précédent. Vous pourrez relancer depuis là.',
  leave: '◂ QUITTER LE VOL',
  finish: 'TERMINER ET VOIR LE RAPPORT ▸▸',
  stay: 'CONTINUER À VOLER',
};

/** The engine's hazard titles and questions (hazards.json, English data), said in French on the danger cards. */
const HAZARD_FR: Record<string, { title: string; prompt: string }> = {
  'solar-storm': { title: 'TEMPÊTE DE RADIATIONS SOLAIRES', prompt: 'Des particules énergétiques du Soleil arrivent : une tempête de radiations solaires. Protéger les instruments ?' },
  'cme-shock': { title: 'CHOC D’ÉJECTION CORONALE', prompt: 'Une éjection de masse coronale se dirige vers Mars. Le modèle de la NASA prédit l’arrivée de son choc. Le subir ?' },
  'mars-dust-storm': { title: 'TEMPÊTE DE POUSSIÈRE GLOBALE', prompt: 'La poussière recouvre toute la planète et la haute atmosphère gonfle. Que doit faire l’orbiteur ?' },
  debris: { title: 'FLUX DE POUSSIÈRE DE COMÈTE', prompt: 'Une comète va passer tout près et sa poussière pourrait toucher la sonde. Comment la protéger ?' },
  'reaction-wheel': { title: 'PANNE DE ROUE DE RÉACTION', prompt: 'Il reste trop peu de roues de réaction pour pointer la sonde. Comment va-t-elle pointer maintenant ?' },
  'memory-corruption': { title: 'MÉMOIRE DE L’ORDINATEUR CORROMPUE', prompt: 'La mémoire de l’ordinateur de vol est corrompue. Comment la réparer ?' },
  'insertion-anomaly': { title: 'ANOMALIE DU FREINAGE D’ARRIVÉE', prompt: 'Le freinage d’arrivée ne s’est pas passé comme prévu. Et maintenant ?' },
  'radiation-damage': { title: 'DÉGÂTS DE RADIATIONS', prompt: 'L’électronique a reçu plus de radiations que ce pour quoi elle a été conçue.' },
  'drag-heating': { title: 'PASSAGE BAS BRÛLANT', prompt: 'Un passage bas dans l’atmosphère échauffe la sonde. Remonter, ou rester bas et finir la photo ?' },
};

export const FLY_WORDS = {
  goal: 'OBJECTIF : GARDER LE ROBOT EN VIE JUSQU’À LA FIN DE LA MISSION',
  /** A time on a card or a strip: "30 HOURS" (format.ts durationWords). */
  duration: (s: number) => f.durationWords(s),
  years: (n: number) => `${f.num(n)} ${n === 1 ? 'AN' : 'ANS'}`,
  day: (n: string) => `JOUR ${n}`,
  dayLabel: (n: string) => `Jour ${n}`,
  dayK: 'JOUR',
  inDays: (n: number) => `DANS ${f.num(n)} ${n === 1 ? 'JOUR' : 'JOURS'}`,
  /** A danger card: the engine's hazard title and question (English data). */
  hazard: (type: string, title: string) => HAZARD_FR[type]?.title ?? title.toUpperCase(),
  prompt: (type: string, prompt: string) => HAZARD_FR[type]?.prompt ?? prompt,
  dangerCard: 'CARTE DANGER',
  arrives: 'LE DANGER ARRIVE',
  arrivesHow: (severity: string) => `LE DANGER ARRIVE · ${severity}`,
  takes: 'VOTRE ORDRE MET',
  takesShort: 'L’ORDRE MET',
  history: 'HISTOIRE VRAIE',
  toVerify: 'À VÉRIFIER',
  risk: (n: string) => `⚠ +${n} risque`,
  ifFails: (effect: string) => `En cas d’échec, ${effect}`,
  sunUntil: (day: string) => `LE SOLEIL GÊNE : AUCUN ORDRE AVANT LE JOUR ${day}`,
  sunNow: 'LE SOLEIL GÊNE : AUCUN ORDRE POUR L’INSTANT',
  standingOrder: 'ORDRE PERMANENT',
  robotDefault: 'LE CHOIX PAR DÉFAUT DU ROBOT',
  letRobot: 'LAISSER LE ROBOT DÉCIDER',
  letRobotRuns: 'LAISSER LE ROBOT DÉCIDER · LE TEMPS CONTINUE',
  swipe: ['◂ GLISSER À GAUCHE / TOUCHE ←', 'TOUCHE → / GLISSER À DROITE ▸', '▾ TOUCHE ↓'],
  swipePhone: ['◂ GLISSER À GAUCHE', 'GLISSER À DROITE ▸', 'TOUCHER'],
  /** The eclipse planning card. */
  planAhead: 'ANTICIPER',
  eclipse: 'SAISON D’ÉCLIPSES',
  eclipseLine: (dest: string, dark: string) => `${dest} cachera le Soleil jusqu’à ${dark} à chaque orbite. Pas de soleil, pas d’énergie.`,
  darkStarts: 'DÉBUT DE LA SAISON SOMBRE',
  theRule: 'LA RÈGLE',
  dodRule: (pct: string) => `Les batteries ne sont vidées que jusqu’à ${pct} dans le noir, pour durer des milliers d’orbites.`,
  inTheDark: (on: string, total: string) => `${on}/${total} DANS LE NOIR`,
  cold: 'FROID',
  coldTitle: 'Les pièces froides s’usent plus vite',
  useBattery: 'UTILISER LA BATTERIE',
  savePower: 'ÉCONOMISER',
  keepWarm: 'Tout garder au chaud.',
  shiver: 'Baisser le chauffage. Grelotter.',
  /** The CRT log line. */
  dangerAhead: (title: string) => `DANGER EN VUE : ${title}.`,
  planAheadLine: (title: string) => `ANTICIPER : ${title}.`,
  orderSent: (label: string) => `ORDRE ENVOYÉ : ${label}.`,
  orderReceived: 'ORDRE REÇU PAR LE ROBOT.',
  signalReceived: 'SIGNAL REÇU.',
  orderArrived: (label: string) => `ORDRE ARRIVÉ : ${label}.`,
  waitingToSee: 'ON ATTEND DE VOIR CE QUI SE PASSE.',
  /** The order crossing space, and the wait for what happens. */
  onItsWay: (label: string) => `L’ORDRE « ${label} » EST EN ROUTE`,
  teamWriting: 'L’ÉQUIPE RÉDIGE L’ORDRE',
  reaches: 'LE SIGNAL ATTEINT LE ROBOT DANS',
  reachesShort: 'L’ORDRE ATTEINT LE ROBOT DANS',
  thenCrosses: 'PUIS IL TRAVERSE L’ESPACE À LA VITESSE DE LA LUMIÈRE',
  justWait: 'PLUS RIEN À FAIRE, SAUF ATTENDRE',
  carriedOut: (label: string) => `ORDRE « ${label} » EXÉCUTÉ`,
  strikesIn: (title: string) => `${title} FRAPPE DANS`,
  danger: 'DANGER',
  holdOn: 'LE ROBOT EST PRÊT. TENEZ BON.',
  incoming: 'Message entrant',
  incomingFrom: (mission: string) => `MESSAGE ENTRANT · DE ${mission.toUpperCase()}`,
  continue: 'CONTINUER ▸',
  /** The action bar and the clock. */
  resources: 'Ressources du robot',
  tile: (name: string, on: string, total: string) => `${name} : ${on} sur ${total}`,
  speeds: 'Vitesse du temps',
  pause: 'Pause',
  speed: (x: string) => `Vitesse ${x}`,
  powerPlan: 'PLAN D’ÉNERGIE',
  callHome: 'APPELER LA TERRE',
  orders: 'ORDRES',
  ordersLabel: 'File de commandes',
  equations: 'ÉQUATIONS',
  nextEvent: 'ÉVÉNEMENT SUIVANT ▸',
  nextEventLabel: 'Événement suivant',
  progress: 'Progression de la mission',
  /** The end of the flight. */
  over: 'Mission terminée',
  lost: 'CONTACT PERDU',
  notLaunched: 'NON LANCÉ',
  complete: 'MISSION PRINCIPALE ACCOMPLIE',
  silent: 'LE ROBOT S’EST TU.',
  printing: 'LE TÉLÉSCRIPTEUR IMPRIME VOTRE RAPPORT.',
  seeReport: 'VOIR LE RAPPORT DE MISSION ▸',
  /** The map and the ribbon of what is coming. */
  map: 'Carte de la mission',
  yourPath: 'VOTRE TRAJET',
  realPath: 'VRAI TRAJET NASA',
  ghost: (label: string) => `${label} : vrai trajet, tourné pour partir à côté du vôtre`,
  now: 'MAINTENANT',
  tickEng: (day: string) => `JOUR ${day}`,
  whenEng: (day: string, t: string) => `JOUR ${day} · T−${t} j`,
  comingUp: 'À VENIR',
  comingUpSub: 'À VENIR · CEUX-LÀ, VOUS LES VOYEZ ARRIVER',
  nextMonths: (n: string) => `${n} PROCHAINS MOIS`,
};

/** The footer line under the progress bar. */
export const endsInWords = (daysLeft: number) => (daysLeft <= 0 ? 'MISSION TERMINÉE' : `FIN DE LA MISSION DANS ${f.num(daysLeft)} ${daysLeft === 1 ? 'JOUR' : 'JOURS'}`);

/** The nudge when the clock is paused and nothing else is on screen. */
export const playNudge = (speedLabel: string) => `▶ APPUYEZ SUR ${speedLabel} POUR FAIRE AVANCER LE TEMPS`;

/** Labels on the CRT map. */
export const MAP_WORDS = {
  earth: 'TERRE',
  planet: (name: string) => name.toUpperCase(),
  sun: 'SOLEIL',
  storm: 'TEMPÊTE SOLAIRE',
  order: 'VOTRE ORDRE',
  reply: 'SA RÉPONSE',
  you: 'VOUS',
};

/** The log line while a solar storm crosses space toward the robot, and while it hits. */
export const stormLine = (phase: 'coming' | 'hitting', name: string, hitsIn: string) =>
  phase === 'coming' ? `LE SOLEIL A ÉRUPTÉ. UNE TEMPÊTE SOLAIRE FRAPPE ${name} DANS ${hitsIn}.` : `TEMPÊTE SOLAIRE SUR ${name}. DES PARTICULES PARTOUT.`;

// ---------------------------------------------------------------------------
// The robot's voice. It reports in the first person; every line reached Earth one light time after it was sent.

/** Names the 🎲 button cycles through on Pack (the first is the default). */
export const ROBOT_NAMES = ['PIP', 'NOVA', 'ZIPPY', 'BOLT', 'COMET', 'SPARKY', 'ORBIT', 'BEEP', 'ASTRO', 'DOT', 'RUSTY', 'TWINKLE'];
/** Longest robot name (letters): the twelve cells of the name screen, and still short enough for the map. */
export const ROBOT_NAME_MAX = 12;

/**
 * A typed name made safe for the map: capitals, letters, digits, spaces and dashes, no leading space, at most
 * ROBOT_NAME_MAX. Saved names are cleaned again when read back (saves.ts), so storage can't smuggle anything in.
 */
export const cleanRobotName = (raw: string) =>
  raw
    .toUpperCase()
    .replace(/[^A-Z0-9 -]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^ +/, '')
    .slice(0, ROBOT_NAME_MAX);

/** The name to show: the player's, or the default when the field was left empty. */
export const robotNameOr = (name: string | undefined) => (name && name.trim() ? name.trim() : ROBOT_NAMES[0]!);

/** The next suggestion after the current name. */
export const nextRobotName = (name: string) => ROBOT_NAMES[(ROBOT_NAMES.indexOf(name) + 1) % ROBOT_NAMES.length]!;

export const ROBOT_WORDS = {
  nameLabel: 'LE NOM DE VOTRE ROBOT',
  suggest: 'Proposer un nom',
  took: (dest: string, delay: string) => `DEPUIS ${dest} · ARRIVÉ EN ${delay}`,
  lastMessage: (name: string) => `DERNIER MESSAGE DE ${name}`,
};

/** NAME YOUR ROBOT (design screen 00), before the first mission. */
export const NAME_WORDS = {
  kicker: 'PAS DE TIR 39A · AVANT LANCEMENT',
  intro1: '> UN NOUVEAU ROBOT ATTEND SUR LE PAS DE TIR.',
  intro2: '> DONNEZ-LUI UN NOM.',
  count: (n: string, max: string) => `NOM · ${n} / ${max}`,
  input: 'Nom du robot',
  /** The design's three suggestions. */
  suggestions: ['VOYA', 'TALLY', 'KESTREL'],
  suggestion: (n: string) => `SUGGESTION ${n}`,
  launch: 'DÉCOLLER DANS LE CIEL DU JOUR',
  firstHead: (name: string, day: string) => `${name} · JOUR ${day} · ENVOYÉ À L’INSTANT`,
  noDelay: 'LA DERNIÈRE FOIS SANS AUCUN DÉLAI',
  firstWords: 'SYSTÈMES ALLUMÉS. RÉSERVOIR PLEIN. PRÊT QUAND VOUS L’ÊTES.',
  load: (name: string) => `CHARGER ${name}`,
  loadSub: 'Ensuite : la baie d’emballage',
  skip: (name: string) => `PASSER · L’APPELER ${name}`,
  sky: 'LE CIEL DU JOUR',
  skyLine: (date: string, minutes: string) => `AUJOURD’HUI · ${date} · MARS EST À ${minutes} MINUTES-LUMIÈRE`,
  skyPhone: (minutes: string) => `MARS EST À ${minutes} MINUTES-LUMIÈRE`,
  skyEng: (au: string, mkm: string, t: string) => `${au} · ${mkm} · t = d / c = ${t}`,
};

/**
 * Fill a word template: each {slot} becomes its value. The robot's lines are templates, not sentences glued from
 * pieces, so a template can move the slots wherever its sentence needs them.
 */
export const fill = (template: string, slots: Record<string, string>) => template.replace(/\{(\w+)\}/g, (all, k: string) => slots[k] ?? all);

/**
 * The robot's voice: terse uppercase telemetry, in the first person. Slots: {dest} {name} {option} {hazard}
 * {days} {dist} {fuel} {data} {dv} {burned} {dark} {lost} {period} {waited} {pct} {years}. Each kind has one or more variants; the
 * message's seq picks one, so a repeated kind does not repeat itself word for word.
 */
export const VOICE: Record<Exclude<VoiceKind, 'hit' | 'status'>, string[]> = {
  launch: ['DÉCOLLAGE. SYSTÈMES ALLUMÉS. PROCHAIN ARRÊT : {dest}.'],
  'launch-failed': ['LA FUSÉE A ÉCHOUÉ. JE N’AI JAMAIS QUITTÉ LE PAS DE TIR.'],
  halfway: ['À MI-CHEMIN DE {dest}. LA TERRE EST UN POINT BLEU DERRIÈRE MOI.'],
  arrived: ['ARRIVÉ À {dest}. MOTEUR ALLUMÉ. CAPTURÉ.'],
  science: ['INSTRUMENTS ALLUMÉS. {dest} EN DESSOUS. CARTOGRAPHIE.'],
  'heading-home': ['ÉCHANTILLON RANGÉ. DEMI-TOUR VERS LA TERRE.'],
  'bonus-time': ['LA PROLONGATION COMMENCE. TOUJOURS LÀ. TOUJOURS AU TRAVAIL.'],
  dark: ['SAISON D’ÉCLIPSES. JUSQU’À {dark} DE NUIT PAR ORBITE. SUR BATTERIE.', 'ENCORE LA SAISON D’OMBRE. {dark} DE NUIT PAR ORBITE. CHAUFFAGE UN PEU BAISSÉ.', 'ENCORE LA NUIT. JE CONNAIS LA ROUTINE.'],
  conjunction: ['LE SOLEIL EST ENTRE NOUS. PAS D’ORDRES POUR UN MOMENT. JE VOLE SEUL.'],
  'conjunction-end': ['LE SOLEIL S’EST ÉCARTÉ. JE VOUS ENTENDS À NOUVEAU.'],
  saved: ['{hazard} : PASSÉ. TOUS LES SYSTÈMES SONT SAINS.', 'ÇA A MARCHÉ. AUCUN DÉGÂT.', 'TOUT VA BIEN ICI.'],
  hurt: ['{hazard} : QUELQUE CHOSE A CASSÉ. JE VOLE TOUJOURS.', 'DÉGÂTS SUBIS. JE CONTINUE DU MIEUX QUE JE PEUX.'],
  'instrument-lost': ['UN INSTRUMENT PERDU. JE TRAVAILLE AVEC LE RESTE.'],
  'safe-mode': ['MODE SÉCURITÉ. TOUT LE SUPERFLU EST COUPÉ. J’ATTENDS VOS ORDRES.'],
  brownout: ['BATTERIE FAIBLE. JE COUPE DES ÉQUIPEMENTS POUR RESTER EN VIE.'],
  'wheel-spare': ['UNE ROUE EST TOMBÉE EN PANNE. LA ROUE DE SECOURS A PRIS LE RELAIS. POINTAGE TOUJOURS JUSTE.'],
  'out-of-fuel': ['RÉSERVOIR VIDE. JE NE PEUX PLUS MANŒUVRER.'],
  'prime-complete': ['MISSION PRINCIPALE ACCOMPLIE. TOUTE MA SCIENCE EST EN ROUTE.'],
  'last-words': ['MA BATTERIE EST FAIBLE ET IL COMMENCE À FAIRE NUIT.'],
  'order-received': ['ORDRE REÇU. {option}. FAIT.'],
  'acted-alone': ['AUCUN ORDRE À TEMPS. J’AI CHOISI {option}.'],
  'order-too-late': ['VOTRE ORDRE EST ARRIVÉ TROP TARD. J’AVAIS DÉJÀ AGI.'],
  'science-milestone': ['{pct} DE L’OBJECTIF SCIENTIFIQUE ENVOYÉ SUR TERRE.'],
  extension: ['ORDRE DE PROLONGATION REÇU. {years} DE PLUS. TOUJOURS LÀ.'],
  'signing-off': ['ICI {name}, TERMINÉ. MERCI, LA TERRE.'],
  targets: ['{name} EST EN ORBITE AUTOUR DE {dest}. QUE DOIT-IL REGARDER ?'],
  observing: ['ORDRE REÇU. IMAGE DE {target} EN ATTENTE.'],
  'observe-refused': ['JE NE PEUX PAS PHOTOGRAPHIER {target} MAINTENANT.'],
  'image-sent': ['PHOTO DE {target} ENVOYÉE SUR TERRE. {comment}'],
  'far-side': ['DERRIÈRE LA LUNE {lost} SUR {period}. PAS DE SIGNAL LÀ-BAS. JE VOLE SEUL.'],
  'link-back': ['LIAISON RÉTABLIE. VOTRE ORDRE A ATTENDU {waited} DERRIÈRE LA LUNE.'],
  'trim-burn': ['CORRECTION D’ORBITE : {dv}. LA GRAVITÉ BOSSELÉE DE LA LUNE M’ATTIRE VERS LE BAS. JE TIENS MON ORBITE.'],
};

/** The science targets in the robot's words (spec: UI rule 39): the name it uses and what it says when the picture goes home. */
export const TARGET_WORDS: Record<string, { name: string; comment: string }> = {
  'olympus-mons': { name: 'OLYMPUS MONS', comment: 'IL ÉTAIT PLUS LARGE QUE TOUT MON CHAMP DE VISION.' },
  'valles-marineris': { name: 'VALLES MARINERIS', comment: 'UNE FISSURE À TRAVERS TOUTE LA PLANÈTE. JE L’AI SUIVIE TOUT LE PASSAGE.' },
  'north-polar-cap': { name: 'CALOTTE POLAIRE NORD', comment: 'DES SPIRALES BLANCHES. LA GLACE ÉCRIT QUELQUE CHOSE.' },
  phobos: { name: 'PHOBOS', comment: 'ASSEZ PRÈS POUR VOIR LES SILLONS. IL TOMBE VERS MARS. LENTEMENT.' },
  deimos: { name: 'DÉIMOS', comment: 'PETIT. CALME. LISSE, COMME DU SABLE VERSÉ DESSUS.' },
  limb: { name: 'L’AIR TÉNU AU BORD DE LA PLANÈTE', comment: 'ICI, LE CIEL EST UNE SEULE LIGNE FINE. J’AI VOLÉ BAS POUR LA VOIR.' },
  'apollo-11': { name: 'LE SITE D’APOLLO 11', comment: 'L’ATTERRISSEUR EST TOUJOURS LÀ. LEURS EMPREINTES AUSSI.' },
  tycho: { name: 'TYCHO', comment: 'LEVER DE SOLEIL SUR LE PIC CENTRAL. SON OMBRE TRAVERSAIT TOUT LE FOND.' },
  shackleton: { name: 'SHACKLETON', comment: 'LE BORD EST ÉCLAIRÉ. LE FOND N’A JAMAIS VU LE SOLEIL.' },
  tsiolkovskiy: { name: 'TSIOLKOVSKI', comment: 'DE LA LAVE SOMBRE SUR LA FACE CACHÉE. PERSONNE SUR TERRE NE L’A JAMAIS VUE DE SES PROPRES YEUX.' },
};

export const targetName = (id: string) => TARGET_WORDS[id]?.name ?? id.toUpperCase();

/** Lines with a different shape for some values: a burn on arrival, plans and standing orders, a full goal. */
export const VOICE_ALT = {
  arrivedBurn: 'MOTEUR ALLUMÉ : {dv} DE VITESSE EN MOINS, {burned} DE CARBURANT. {dest} M’A CAPTURÉ.',
  plan: 'ORDRE REÇU. NOUVEAU PLAN D’ÉNERGIE CHARGÉ.',
  standing: 'ORDRE REÇU. NOUVEAUX ORDRES PERMANENTS ENREGISTRÉS.',
  standingChoice: 'PAS DE NOUVEL ORDRE. JE SUIS VOTRE ORDRE PERMANENT : {option}.',
  goalMet: 'OBJECTIF SCIENTIFIQUE ATTEINT. TOUT CE POUR QUOI JE SUIS VENU EST ENVOYÉ.',
  hitUnknown: 'PROBLÈME ICI. QUELQUE CHOSE VIENT DE MAL TOURNER.',
  observeDip: 'ORDRE REÇU. JE DESCENDS BAS POUR {target}. IMAGE EN ATTENTE. JE REMONTE DANS {days}.',
  observeFarSide: 'ORDRE REÇU. {target} EST SUR LA FACE CACHÉE. JE LA PHOTOGRAPHIERAI SEUL, HORS DE VOTRE VUE. IMAGE EN ATTENTE.',
  refusedFuel: 'PAS ASSEZ DE CARBURANT POUR {target}. JE GARDE CE QU’IL FAUT POUR RESTER EN ORBITE.',
  refusedUnreachable: 'JE NE VOIS PAS BIEN {target} DEPUIS CETTE ORBITE.',
  refusedAlready: '{target} EST DÉJÀ SUR MA LISTE.',
  refusedNotInOrbit: 'PAS ENCORE EN ORBITE. REDEMANDEZ-MOI À {dest}.',
};

/** Routine status (VOICE_RULES.statusEvery_days): on the way, at the destination, and on the way home. */
export const STATUS_VOICE: Record<'cruise' | 'orbit' | 'home', string[]> = {
  cruise: ['CROISIÈRE NOMINALE. {days} JOURS AVANT {dest}. IL RESTE {fuel} DE CARBURANT.', 'TOUT EST CALME. À {dist} DE LA TERRE. CAP MAINTENU.', 'VISEUR D’ÉTOILES VERROUILLÉ. {days} JOURS AVANT {dest}.'],
  orbit: ['ORBITE NOMINALE. {data} ENVOYÉS SUR TERRE JUSQU’ICI.', 'TOUT EST CALME. CARTOGRAPHIE. IL RESTE {fuel} DE CARBURANT.', 'CHAUFFAGE EN CYCLE. À {dist} DE LA TERRE. JE TIENS.'],
  home: ['RETOUR VERS LA TERRE. TOUT EST CALME. À {dist} DE LA TERRE.'],
};

const HIT_VOICE: Record<string, string[]> = {
  'solar-storm': ['TEMPÊTE ICI. DES PARTICULES FRAPPENT MES PANNEAUX.', 'ENCORE UNE TEMPÊTE SOLAIRE. JE LA SENS DANS MES CIRCUITS.'],
  'cme-shock': ['LA CME A FRAPPÉ. DES AURORES SOUS MOI.', 'ONDE DE CHOC DU SOLEIL. TOUT TREMBLE.'],
  'mars-dust-storm': ['TEMPÊTE DE POUSSIÈRE EN DESSOUS. L’AIR GONFLE VERS MON ORBITE.'],
  debris: ['QUELQUE CHOSE DE MINUSCULE VIENT DE ME FRÔLER. TRÈS VITE.'],
  'reaction-wheel': ['UNE DE MES ROUES GRINCE.'],
  'memory-corruption': ['ERREURS MÉMOIRE. VÉRIFICATIONS EN COURS.'],
  'radiation-damage': ['FORTES RADIATIONS AUTOUR DE {dest}. MES CIRCUITS PICOTENT.'],
};

/** What a line needs besides the message: names, and how to say an option and a hazard. */
export interface VoiceContext {
  dest: string;
  name: string;
  option?: (hazardType: string, optionId: string) => string;
  hazard?: (hazardType: string) => string;
}

const years = (n: number) => `${f.num(n)} ${n === 1 ? 'AN' : 'ANS'}`;

/** What the robot says, in its own words (uppercase telemetry). Every number is the message's, only formatted. */
function robotSaysEn(m: RobotMessage, ctx: VoiceContext): string {
  const v = m.values;
  const pick = (lines: string[]) => lines[m.seq % lines.length]!;
  const type = v.hazardType ?? '';
  const slots: Record<string, string> = {
    dest: ctx.dest.toUpperCase(),
    name: ctx.name.toUpperCase(),
    option: v.optionId ? (ctx.option ? ctx.option(type, v.optionId) : v.optionId.toUpperCase()) : '',
    hazard: type ? (ctx.hazard ? ctx.hazard(type) : type).toUpperCase() : '',
    ...(v.daysToArrival !== undefined ? { days: f.num(v.daysToArrival) } : {}),
    ...(v.earthDistance_m !== undefined ? { dist: f.millionKm(v.earthDistance_m).toUpperCase() } : {}),
    ...(v.propellantLeft_kg !== undefined ? { fuel: f.kg(v.propellantLeft_kg).toUpperCase() } : {}),
    ...(v.downlinked_bits !== undefined ? { data: f.bits(v.downlinked_bits).toUpperCase() } : {}),
    ...(v.dv_ms !== undefined ? { dv: f.speed(v.dv_ms).toUpperCase() } : {}),
    ...(v.propellant_kg !== undefined ? { burned: f.kg(v.propellant_kg).toUpperCase() } : {}),
    ...(v.longestEclipse_s !== undefined ? { dark: f.minutes(v.longestEclipse_s).toUpperCase() } : {}),
    ...(v.lost_s !== undefined ? { lost: f.minutes(v.lost_s).toUpperCase() } : {}),
    ...(v.period_s !== undefined ? { period: f.minutes(v.period_s).toUpperCase() } : {}),
    ...(v.waited_s !== undefined ? { waited: f.minutes(v.waited_s).toUpperCase() } : {}),
    ...(v.fraction !== undefined ? { pct: f.pct(v.fraction, 0) } : {}),
    ...(v.years !== undefined ? { years: years(v.years) } : {}),
    ...(v.targetId !== undefined ? { target: targetName(v.targetId), comment: TARGET_WORDS[v.targetId]?.comment ?? '' } : {}),
    ...(v.days !== undefined ? { days: `${f.num(v.days)} ${v.days === 1 ? 'JOUR' : 'JOURS'}` } : {}),
  };
  let t: string;
  if (m.kind === 'hit') t = pick(HIT_VOICE[type] ?? [VOICE_ALT.hitUnknown]);
  else if (m.kind === 'status') {
    const where = v.phase === 'cruise' || v.phase === 'launch' ? 'cruise' : v.phase === 'return' ? 'home' : 'orbit';
    t = pick(STATUS_VOICE[where]);
  } else if (m.kind === 'arrived' && v.dv_ms !== undefined) t = VOICE_ALT.arrivedBurn;
  else if (m.kind === 'order-received' && v.commandKind === 'power-plan') t = VOICE_ALT.plan;
  else if (m.kind === 'order-received' && v.commandKind === 'standing-orders') t = VOICE_ALT.standing;
  else if (m.kind === 'acted-alone' && v.by === 'standing-order') t = VOICE_ALT.standingChoice;
  else if (m.kind === 'science-milestone' && (v.fraction ?? 0) >= 1) t = VOICE_ALT.goalMet;
  else if (m.kind === 'observing' && (v.days ?? 1) > 1) t = VOICE_ALT.observeDip;
  else if (m.kind === 'observing' && v.farSide) t = VOICE_ALT.observeFarSide;
  else if (m.kind === 'observe-refused' && v.reason === 'fuel') t = VOICE_ALT.refusedFuel;
  else if (m.kind === 'observe-refused' && v.reason === 'unreachable') t = VOICE_ALT.refusedUnreachable;
  else if (m.kind === 'observe-refused' && v.reason === 'already-ordered') t = VOICE_ALT.refusedAlready;
  else if (m.kind === 'observe-refused' && v.reason === 'not-in-orbit') t = VOICE_ALT.refusedNotInOrbit;
  else t = pick(VOICE[m.kind]);
  return fill(t, slots);
}
export const robotSays = robotSaysEn;

/** The TRANSMISSIONS teletype (Fly & Survive), the robot's reply to an order, and the reply's trip home. */
export const TX_WORDS = {
  kicker: (name: string) => `TÉLÉSCRIPTEUR 02 · ${name} ⇄ TERRE`,
  title: 'TRANSMISSIONS',
  keyRobot: (name: string) => `NOIR · ${name}`,
  keyYou: 'ROUGE · VOUS',
  fromEarth: (name: string) => `TERRE ▸ ${name}`,
  day: (day: string) => `JOUR ${day}`,
  took: (delay: string) => `EN ${delay}`,
  /** On the pad there is no light time yet. */
  noDelay: 'AUCUN DÉLAI · SUR LE PAS DE TIR',
  reply: 'RÉPONDRE',
  queued: (t: string) => `L’ÉQUIPE RÉDIGE · DÉPART DANS ${t}`,
  inFlight: (t: string) => `EN VOL · ${t}`,
  replyInbound: 'LIVRÉ · RÉPONSE EN ROUTE',
  delivered: 'LIVRÉ',
  tooLate: 'TROP TARD',
  order: (what: string) => `ORDRE : ${what}.`,
  plan: 'NOUVEAU PLAN D’ÉNERGIE',
  standing: 'NOUVEAUX ORDRES PERMANENTS',
  observe: (target: string) => `OBSERVER ${target}`,
  extend: (years: string) => `CONTINUER ${years}`,
  /** Footer: "Everything PIP says is 12 MINUTES old by the time it prints here." */
  footBefore: (name: string) => `Tout ce que dit ${name} a `,
  footAge: (age: string) => `${age}`,
  footAfter: ' de retard quand ça s’imprime ici.',
  empty: 'RIEN POUR L’INSTANT. LE ROBOT EST ENCORE SUR LE PAS DE TIR.',
  log: '▾ JOURNAL',
  close: '▴ FERMER',
  logLabel: 'Journal des transmissions',
  replyFrom: (name: string, delay: string) => `RÉPONSE DE ${name} · EN ${delay}`,
  roundTrip: (t: string) => `VOTRE ORDRE A FAIT L’ALLER-RETOUR : ${t}`,
  roundTripEng: (t: string, name: string) => `ALLER-RETOUR 2t = ${t} · TERRE → ${name} → TERRE`,
  heard: (name: string) => `${name} VOUS A ENTENDU. RÉPONSE EN ROUTE`,
  replyReaches: 'LA RÉPONSE ARRIVE SUR TERRE DANS',
  alreadyActed: 'IL A DÉJÀ AGI. VOUS NE POUVEZ PAS ENCORE LE VOIR',
};

// ---------------------------------------------------------------------------
// Big moments

/** The language switch in every top bar (i18n.ts). */
export const LANG_WORDS = { label: 'Langue', en: 'EN', fr: 'FR' };

/** The ABOUT key on Home and its panel (the team, the repository and the project live in about.ts). */
export const ABOUT_WORDS = {
  menu: 'À PROPOS',
  title: 'À PROPOS DE CE PROJET',
  description:
    'Notre version de Signal Delay : un jeu de mission spatiale où vous gardez en vie un robot à des millions de kilomètres, et où chaque ordre arrive avec des minutes de retard. Nous avons simplifié l’interface, ajouté le choix anglais / français et recentré le jeu sur ses missions.',
  team: 'L’ÉQUIPE',
  repo: 'CODE SOURCE',
  repoLink: 'Voir le dépôt sur GitHub',
  close: 'FERMER',
};

/**
 * The cold open (spec UI rule 47): Mars Climate Orbiter, Sept. 23, 1999, on the first launch. Every fact comes from
 * the MCO rescue case (engine coldOpenFacts): the date, the craft, the insertion burn, the signal due from behind
 * Mars, the loss and the units.
 */
export const COLD_OPEN = {
  label: 'Mars Climate Orbiter, 1999 : le signal qui n’est jamais revenu',
  /** The headline date: "SEPTEMBER 23, 1999". */
  date: (iso: string) => f.longDate(iso),
  burn: (date: string, craft: string) => `${date} · ${craft.toUpperCase()} · MANŒUVRE D’INSERTION EN ORBITE`,
  expected: 'SIGNAL ATTENDU QUAND ELLE SORTIRA DE DERRIÈRE MARS',
  waiting: 'EN ATTENTE DU SIGNAL',
  lost: '— AUCUN SIGNAL —',
  units: 'UNE ÉQUIPE UTILISAIT DES LIVRES-FORCE. L’AUTRE, DES NEWTONS.',
  moral: 'CHAQUE ORDRE QUE VOUS ENVOYEZ ARRIVE EN RETARD. FAITES-LE COMPTER.',
  source: (citation: string) => `SOURCE · ${citation.toUpperCase()}`,
  skip: 'PASSER ▸',
};

export const MOMENT_WORDS = {
  countdownK: 'LANCEMENT DANS',
  count: (n: number) => `T−${f.num(n)}`,
  liftoff: 'DÉCOLLAGE !',
  skip: 'PASSER ▸',
  arrived: (dest: string, asteroid: boolean) => (asteroid ? `ARRIVÉ À ${dest} !` : `EN ORBITE AUTOUR DE ${dest} !`),
  arrivedSub: (name: string) => `${name} A ALLUMÉ SON MOTEUR ET A ÉTÉ CAPTURÉ PAR LA GRAVITÉ.`,
  arrivedSubBennu: (name: string) => `${name} A RALENTI POUR VOLER À CÔTÉ DE L’ASTÉROÏDE.`,
  storm: 'TEMPÊTE SOLAIRE !',
  stormSub: (name: string) => `DES PARTICULES DU SOLEIL FRAPPENT ${name}.`,
  launchFailed: 'LANCEMENT RATÉ',
};

// ---------------------------------------------------------------------------
// Rescue History (screens/Rescue.tsx). Its clues and the failure report's findings are cited texts from the data.

export const RESCUE_WORDS = {
  kicker: '🛟 Histoires de sauvetage',
  kickerYear: (year: string) => `🛟 Histoires de sauvetage · ${year}`,
  title: 'Sauvez une mission qui a été perdue',
  helper: 'De vraies sondes ont été perdues à cause de petites erreurs. Lisez le dossier, trouvez le bug et corrigez-le avant le lancement.',
  lostAtMars: 'Perdue à l’arrivée sur Mars',
  stars: (n: string) => `${n} étoiles`,
  /** What each case still to come is, in the order of Rescue.tsx COMING (names stay English). */
  coming: ['capsule, 2004', 'atterrisseur, 1999'],
  comingSoon: 'Bientôt',
  back: '◂ Retour',
  caseHelper: 'Elle a été perdue à l’arrivée sur Mars. Trouvez le bug avant son lancement.',
  whatHappened: 'Ce qui s’est passé',
  file: 'Dossier de mission',
  fact: {
    launch: 'Lancement',
    rocket: 'Fusée',
    launchMass: 'Masse au lancement',
    fuel: 'Carburant',
    power: 'Énergie à Mars',
    engine: 'Moteur principal',
    arrival: 'Arrivée',
    delay: 'Délai du signal à Mars',
    lowest: 'Point le plus bas prévu',
  },
  clues: 'Indices',
  which: 'Lequel est le bug ?',
  fromReport: 'Tiré du rapport d’échec',
  accuse: 'C’est le bug !',
  saved: '🎉 Bug trouvé. Mission sauvée !',
  starsOf: (n: string, max: string) => `${n} étoiles sur ${max}`,
  /** "Every push was [4.45×] bigger than the navigators thought ⓘ. Over the trip, the craft drifted [169 km] lower than planned." */
  factor: { before: 'Chaque poussée était ', mid: ' plus forte que ne le pensaient les navigateurs ', drift: '. Sur tout le trajet, la sonde a dérivé ', after: ' plus bas que prévu.' },
  factorTitle: 'Livres-force en newtons',
  chart: (plan: string, safe: string, actual: string) => `Prévu ${plan}, survivable ${safe}, réel ${actual}`,
  plan: (km: string) => `Prévu · ${km}`,
  safe: (km: string) => `Minimum sûr · ${km}`,
  happened: (km: string) => `Ce qui s’est passé · ${km}`,
  /** "Lowest point: plan ⓘ · safe limit ⓘ · estimate after the loss ⓘ" */
  note: { plan: 'Point le plus bas : prévu', safe: ' · limite sûre', estimate: ' · estimation après la perte' },
  noteTitle: { plan: 'Point le plus bas prévu', safe: 'Point le plus bas sûr', estimate: 'Point le plus bas estimé' },
  backToList: 'Retour aux histoires de sauvetage',
};

// ---------------------------------------------------------------------------
// ⓘ, the source of a number or a cited text (components/SourceInfo.tsx)

export const SOURCE_WORDS = {
  label: (title?: string) => (title ? `Source de ${title}` : 'Source'),
  kicker: 'Source',
  close: 'Fermer',
  estimate: 'ESTIMATION DU JEU · PAS UNE DONNÉE NASA',
  computed: 'CALCULÉ PAR LE MOTEUR',
  published: 'SOURCE PUBLIÉE',
  unit: (u: string) => `unité : ${u}`,
  open: 'Ouvrir la source ↗',
};

// ---------------------------------------------------------------------------
// Postcards from space

export const POSTCARD_WORDS = {
  menu: 'CARTES POSTALES',
  menuSub: 'De vraies images NASA que vos robots ont envoyées sur Terre.',
  view: (title: string) => `Carte postale : ${title}`,
  tile: (title: string, dest: string) => `${title} (${dest})`,
  title: 'CARTES POSTALES DE L’ESPACE',
  sub: 'De vraies images de missions NASA. Votre robot en envoie une quand sa science arrive sur Terre.',
  toast: (dest: string) => `📮 CARTE POSTALE DE ${dest} !`,
  look: 'TOUCHEZ POUR VOIR',
  keep: 'CONTINUER À VOLER ▸',
  close: 'FERMER',
  credit: (c: string) => `IMAGE : ${c}`,
  report: 'CARTES POSTALES DE CE VOL',
  none: 'Pas de carte postale cette fois : aucune science n’est arrivée sur Terre.',
  locked: 'VERROUILLÉE',
  /** How a locked card is earned, from its unlock share (0 = first data, 1 = the whole goal). */
  hint: (dest: string, share: number) =>
    share <= 0 ? `Volez vers ${dest} et envoyez votre première science.` : share >= 1 ? `Envoyez toute la science de ${dest}.` : `Envoyez la moitié de la science de ${dest}.`,
};

// ---------------------------------------------------------------------------
// Ranks and badges (engine ranks.ts)

export const RANK_WORDS: Record<string, string> = {
  cadet: 'CADET',
  'flight-controller': 'CONTRÔLEUR DE VOL',
  capcom: 'CAPCOM',
  'flight-director': 'DIRECTEUR DE VOL',
  'mission-legend': 'LÉGENDE DES MISSIONS',
};

export const CREW_WORDS = {
  title: 'DOSSIER D’ÉQUIPAGE',
  rank: 'VOTRE GRADE',
  toNext: (n: number, next: string) => `${f.num(n)}★ AVANT ${next}`,
  top: 'GRADE MAXIMUM',
  stars: (n: number, max: number) => `${f.num(n)} ÉTOILES SUR ${f.num(max)}`,
  badges: 'BADGES',
  open: 'Ouvrir votre dossier d’équipage',
  close: 'FERMER',
  realJob: 'LE VRAI MÉTIER',
  promoted: 'PROMU !',
  newBadge: 'NOUVEAU BADGE',
  earned: 'OBTENU',
  locked: 'PAS ENCORE',
};

export const BADGE_WORDS: Record<string, { name: string; how: string }> = {
  'first-flight': { name: 'PREMIER VOL', how: 'Gagnez une étoile sur n’importe quelle mission.' },
  'storm-survivor': { name: 'SURVIVANT DE LA TEMPÊTE', how: 'Traversez une tempête solaire sans perdre d’instrument.' },
  'through-the-sun': { name: 'À TRAVERS LE SOLEIL', how: 'Continuez à voler pendant que le Soleil bloque votre radio (une conjonction solaire).' },
  'night-shift': { name: 'ÉQUIPE DE NUIT', how: 'Traversez toute une saison d’éclipses sans panne de courant.' },
  'bonus-time': { name: 'TEMPS BONUS', how: 'Demandez une prolongation à la fin d’un vol.' },
  'sample-home': { name: 'ÉCHANTILLON RAPPORTÉ', how: 'Rapportez un morceau de l’astéroïde Bennu sur Terre.' },
  shutterbug: { name: 'PHOTOGRAPHE', how: 'Collectionnez toutes les cartes postales d’un même endroit.' },
  'daily-streak': { name: 'SÉRIE QUOTIDIENNE', how: 'Jouez la mission du jour trois jours de suite.' },
  rescuer: { name: 'SAUVETEUR', how: 'Sauvez un robot dans les histoires de sauvetage.' },
  'big-thinker': { name: 'GRAND PENSEUR', how: 'Découvrez pourquoi aucune fusée ne va directement à Jupiter.' },
};

/** Science Targets in the CRT after arrival (spec: UI rule 39; design screen 01, SCIENCE TARGETS). */
export const SCIENCE = {
  title: (dest: string) => `ORBITE DE ${dest} · CIBLES SCIENTIFIQUES`,
  titlePhone: (dest: string) => `ORBITE DE ${dest} · CHOISIR DES CIBLES`,
  hint: 'CHAQUE PHOTO COÛTE DU CARBURANT, DE LA BATTERIE OU DU RISQUE. VOUS NE POUVEZ PAS TOUT VOIR.',
  hintSome: (n: string) => `${n} COMMANDÉES · CHAQUE PHOTO COÛTE DU CARBURANT, DE LA BATTERIE OU DU RISQUE`,
  image: 'IMAGE',
  quality: { 3: 'NETTE', 2: 'BONNE', 1: 'MOYENNE' } as Record<1 | 2 | 3, string>,
  risk: { none: 'ORBITE HABITUELLE', low: 'FREINAGE FAIBLE', medium: 'FREINAGE MOYEN', high: 'FREINAGE FORT' } as Record<'none' | 'low' | 'medium' | 'high', string>,
  dust: 'POUSSIÉREUX',
  state: {
    ordered: 'ORDRE EN VOL',
    observing: 'OBSERVATION EN COURS',
    'on-board': 'À BORD',
    sent: 'EN ROUTE',
    home: 'ARRIVÉE ✓',
    refused: 'REFUSÉE',
  } as Record<'ordered' | 'observing' | 'on-board' | 'sent' | 'home' | 'refused', string>,
  observe: 'OBSERVER',
  orderTakes: (target: string, time: string, name: string) => `${target} · l’ordre met ${time} pour atteindre ${name}`,
  orderTakesShort: (time: string) => `ARRIVE DANS ${time.toUpperCase()}`,
  blocked: {
    ordered: ['Déjà commandée. Choisissez une autre cible.', 'DÉJÀ COMMANDÉE'],
    fuel: ['Pas assez de carburant. Le robot garde ce qu’il faut pour rester en orbite.', 'PAS ASSEZ DE CARBURANT'],
    unreachable: ['Cette orbite ne permet pas de la voir assez nettement.', 'INVISIBLE D’ICI'],
    blackout: ['Le Soleil gêne : aucun ordre tant qu’il ne s’est pas écarté.', 'LE SOLEIL GÊNE'],
    'not-flying': ['Le robot ne prend pas d’ordres.', 'PAS D’ORDRES MAINTENANT'],
  } as Record<'ordered' | 'fuel' | 'unreachable' | 'blackout' | 'not-flying', [string, string]>,
  done: 'TERMINÉ · CONTINUER À VOLER',
  doneShort: 'TERMINÉ',
  skip: 'PASSER LA SCIENCE',
  skipShort: 'PASSER',
  reopen: 'SCIENCE',
  globeCredit: { mars: 'MARS · MOSAÏQUE VIKING NASA/USGS', moon: 'LUNE · NASA SVS CGI MOON KIT (LROC)' } as Record<TargetBody, string>,
  eng: (res: string, size: string, dv: string, days: string) => `RÉS. ${res}/PX · ${size} · Δv ${dv} · ${days}`,
  marker: (n: string, name: string) => `${n} ${name}`,
  moonRing: (name: string) => `ORBITE DE ${name}`,
  /** The globe's labels (spec: UI rule 41): every number is the engine's, the drawing is not to scale. */
  periapsis: (from: string, to: string) => `PÉRIAPSIDE ${from} → ${to}`,
  periapsisNow: (h: string) => `PÉRIAPSIDE ${h}`,
  apoapsis: (from: string, to: string) => `APOAPSIDE ${from} → ${to}`,
  dragEng: (p: string, rho: string) => `P(ÉCHAUFFEMENT) ${p} · ρ/ρ₀ ×${rho}`,
  moonSub: (a: string) => `ORBITES À ${a} D’ALTITUDE`,
  orbitChange: 'CHANGEMENT D’ORBITE · ALLER ET RETOUR',
  limbSub: 'HAUTE ATMOSPHÈRE · VUE DE CÔTÉ',
  notToScale: 'ALTITUDES PAS À L’ÉCHELLE',
  orbiter: (name: string) => name,
  /** The order strip over the globe while an OBSERVE crosses space, and the flyover when it lands. */
  orderOut: (target: string, name: string, time: string) => `ORDRE VERS ${target} · ATTEINT ${name} DANS ${time}`,
  orderOutShort: (time: string) => `L’ORDRE ARRIVE DANS ${time}`,
  scanning: (name: string, target: string) => `${name} SURVOLE ${target} · BALAYAGE`,
  /** The phone's bottom sheet. */
  sheet: 'Cibles scientifiques',
  sheetMore: 'PLUS ▴',
  sheetLess: 'MOINS ▾',
};

/** The Moon scene on the globe (spec: UI rules 45–46; design 3d/Moon Globe.html). Numbers come from moonOrbitView. */
export const MOON_WORDS = {
  earth: (dist: string, oneWay: string) => `TERRE · ${dist} · ${oneWay}`,
  earthSub: 'VOIT TOUJOURS LA FACE VISIBLE',
  linkUp: (oneWay: string) => `LIAISON · VERROUILLÉE · ${oneWay}`,
  linkLost: 'LIAISON · PERDUE · FACE CACHÉE',
  far: 'AUCUN SIGNAL — DERRIÈRE LA LUNE',
  farSub: (lost: string, period: string) => `≈${lost} SUR CHAQUE PÉRIODE DE ${period} MIN`,
  allInView: 'LA TERRE VOIT TOUTE L’ORBITE AUJOURD’HUI',
  shadow: 'DANS L’OMBRE DE LA LUNE',
  shadowSub: (dark: string, period: string) => `${dark} SUR CHAQUE PÉRIODE DE ${period} MIN · SUR BATTERIE`,
  trim: 'MAINTIEN D’ORBITE',
  trimNext: (when: string, dv: string) => `LES MASCONS ABAISSENT LES ORBITES BASSES · PROCHAINES CORRECTIONS DANS ${when} · ${dv}`,
  legend: 'Ce que montre l’anneau',
  notToScale: 'PAS À L’ÉCHELLE · // DISTANCE DE LA TERRE RACCOURCIE',
  farTarget: 'FACE CACHÉE · AUCUN SIGNAL PENDANT L’OBSERVATION',
  /** The orbit-only panel on Moon 1 and Moon 2. */
  titleOf: (alt: string) => `ORBITE LUNAIRE · ${alt} D’ALTITUDE`,
  hint: 'LA TERRE NE VOUS VOIT PAS DERRIÈRE LA LUNE. LES ORDRES ATTENDENT LA LIAISON.',
  reopen: 'ORBITE LUNAIRE',
  done: 'TERMINÉ · CONTINUER À VOLER',
  doneShort: 'TERMINÉ',
};

/** The DOWNLINK drawer (spec: UI rule 40; design screen 01, DOWNLINK). */
export const DOWNLINK = {
  button: 'TÉLÉCHARGEMENT',
  waitingOn: (n: string, one: boolean, name: string) => `${n} ${one ? 'IMAGE EN ATTENTE' : 'IMAGES EN ATTENTE'} SUR ${name}`,
  allHome: (n: string) => `LES ${n} IMAGES SONT ARRIVÉES`,
  shortWaiting: (n: string) => `${n} EN ATTENTE`,
  shortHome: 'TOUT EST ARRIVÉ',
  open: 'OUVRIR ◂',
  close: 'FERMER ▸',
  kicker: (dish: string, sent: string) => `TÉLÉSCRIPTEUR 04 · DSN ${dish} · ${sent}`,
  kickerPhone: (dish: string) => `TÉLÉSCRIPTEUR 04 · DSN ${dish}`,
  sentBefore: (t: string) => `ENVOYÉ ${t} AVANT L’IMPRESSION`,
  noSignal: 'PAS ENCORE DE SIGNAL',
  title: 'TÉLÉCHARGEMENT',
  closeKey: '✕ FERMER',
  big: (n: string, one: boolean) => `${n} ${one ? 'IMAGE EN ATTENTE' : 'IMAGES EN ATTENTE'}`,
  bigHome: 'TOUTES LES IMAGES SONT ARRIVÉES',
  nextPass: (t: string) => `PROCHAIN PASSAGE DSN DANS ${t}`,
  passOpen: (t: string) => `PASSAGE DSN OUVERT · ENCORE ${t}`,
  noPass: 'PLUS DE PASSAGE DSN',
  row: {
    ordered: 'ORDRE ENVOYÉ',
    observing: 'OBSERVATION',
    waiting: 'EN ATTENTE',
    'coming-down': '↓',
    'on-its-way': 'EN ROUTE',
    home: 'ARRIVÉE ✓',
  } as Record<'ordered' | 'observing' | 'waiting' | 'coming-down' | 'on-its-way' | 'home', string>,
  skip: 'ALLER AU PASSAGE',
  skipSub: (t: string) => `Avancer de ${t}`,
  receiving: 'RÉCEPTION…',
  receivingSub: 'Ligne par ligne, au fil des bits',
  allDone: 'TOUT EST ARRIVÉ',
  allDoneSub: 'Fermer le tiroir',
  nothing: 'RIEN DE COMMANDÉ',
  nothingSub: 'Choisissez d’abord des cibles',
  reprint: 'RÉIMPRIMER',
  reprintSub: 'La dernière photo arrivée',
  imageOf: (i: string, n: string, name: string) => `IMAGE ${i} SUR ${n} — ${name}`,
  waitingDish: 'EN ATTENTE DE L’ANTENNE',
  paperLoaded: 'PAPIER CHARGÉ · RIEN À IMPRIMER POUR L’INSTANT',
  printing: (pct: string, size: string) => `RÉCEPTION · ${pct} · ${size}`,
  opened: 'OUVERTE EN COULEURS',
  voice: (name: string, line: string) => `${name}: “${line}”`,
  credit: (credit: string, mission: string, id: string) => `CRÉDIT IMAGE : ${credit} · ${mission} · ${id}`,
};

/** A globe's body in words. */
export const bodyWord = (b: TargetBody) => ({ mars: 'Mars', moon: 'Lune' })[b];

/** The globe's 2D/3D toggle (spec: UI rules 41, 44). */
export const GLOBE_WORDS = {
  toggleLabel: (body: string) => `Passer le globe de ${body} entre 3D et plat`,
  to2d: '2D',
  to3d: '3D',
};

/** The Mission Album (spec: UI rule 43; design screen 03, TELETYPE 03 · MISSION ALBUM). */
export const ALBUM = {
  label: 'Album de mission',
  kicker: (name: string) => `TÉLÉSCRIPTEUR 03 · ALBUM DE MISSION — ${name}`,
  meta: {
    complete: (day: string) => `JOUR 001–${day}`,
    lost: (day: string) => `DERNIER CONTACT · JOUR ${day}`,
    extended: (day: string) => `JOUR 001–${day} · ET ÇA CONTINUE`,
  },
  returned: (n: string, total: string) => `${n} CIBLES RAPPORTÉES SUR ${total}`,
  lostOn: (name: string, day: string) => `${name} A ÉTÉ PERDU LE JOUR ${day} —`,
  madeIt: (n: string, one: boolean) => `${n} ${one ? 'IMAGE EST ARRIVÉE' : 'IMAGES SONT ARRIVÉES'}.`,
  noneMadeIt: 'AUCUNE IMAGE N’EST ARRIVÉE.',
  ofScience: (pct: string) => `${pct} DE LA SCIENCE DE LA MISSION`,
  soFar: (pct: string) => `${pct} POUR L’INSTANT · TOUJOURS EN VOL`,
  subComplete: (name: string, day: string) => `${name} · MISSION PRINCIPALE ACCOMPLIE · JOUR ${day}`,
  subExtended: (name: string, day: string) => `${name} · MISSION PROLONGÉE · JOUR ${day}`,
  bar: 'SCIENCE DE LA MISSION · UN BLOC PAR CIBLE, À LA TAILLE DE CE QU’ELLE APPREND',
  barPct: (pct: string) => `${pct} RAPPORTÉS`,
  plus: (pct: string) => `+${pct} DE SCIENCE`,
  missed: (pct: string) => `${pct} MANQUÉS`,
  partialSci: 'PARTIE D’UNE IMAGE · PAS DE SCIENCE',
  notReturned: 'NON RAPPORTÉE',
  signalLost: '— SIGNAL PERDU —',
  partialCap: (pct: string) => `SIGNAL PERDU AVEC ${pct} ENVOYÉS`,
  credit: (credit: string, mission: string) => `CRÉDIT IMAGE : ${credit} · ${mission}`,
  why: {
    'never-ordered': () => 'JAMAIS OBSERVÉE',
    'order-lost': () => 'L’ORDRE N’EST JAMAIS ARRIVÉ',
    'refused-fuel': () => 'PASSÉE · PAS ASSEZ DE CARBURANT',
    'refused-unreachable': () => 'PASSÉE · INVISIBLE DEPUIS CETTE ORBITE',
    refused: () => 'PASSÉE · LE ROBOT A REFUSÉ',
    'never-taken': () => 'ENCORE EN OBSERVATION À LA FIN',
    'never-sent': (day: string) => `PRISE LE JOUR ${day} · JAMAIS ENVOYÉE`,
    'still-possible': () => 'ENCORE POSSIBLE · MISSION PROLONGÉE',
  } as Record<string, (day: string) => string>,
  foot: {
    complete: 'Chaque cadre vide est une cible encore là-haut. Pas pour cette mission.',
    lost: 'Les photos déjà arrivées comptent toujours. Les autres restent dans sa mémoire, quelque part au-dessus de Mars.',
    extended: 'Des cadres vides, et un robot avec assez de carburant pour les remplir.',
    all: 'Toutes les cibles sont arrivées. Plus rien à voir là-haut.',
    none: 'Aucune photo n’est arrivée. La prochaine fois, commandez une cible tôt et attendez un passage DSN.',
  },
  feed: 'FAIRE AVANCER LE PAPIER · DERNIÈRE TRANSMISSION ▾',
};

/** The Daily's science line (v0.8: science returned is the main score). */
export const DAILY_SCIENCE = {
  card: (pct: string) => `SCIENCE RAPPORTÉE ${pct}`,
  share: (pct: string) => `🔭 ${pct} de la science rapportée`,
};

// ---------------------------------------------------------------------------
// The Mission Report's frame, the comic's sound words and the Daily screen

export const REPORT_WORDS = {
  title: 'RAPPORT DE MISSION',
  titleLines: ['RAPPORT', 'DE MISSION'],
  kicker: (mission: string, dest: string, lastDay: string) => `TÉLÉSCRIPTEUR · ${mission.toUpperCase()} · ${dest.toUpperCase()} · JOUR 000–${lastDay}`,
  kickerPhone: (mission: string, day: string) => `${mission.toUpperCase()} · JOUR ${day}`,
  stars: (n: string) => `${n} étoiles sur 3`,
  saved: 'CE QUI VOUS A SAUVÉ',
  hurt: 'CE QUI VOUS A BLESSÉ',
  youVs: 'VOUS vs LA VRAIE',
  youVsLabel: 'Vous contre la vraie mission',
  you: 'VOUS',
  launch: 'LANCEMENT',
  plannedScience: 'SCIENCE PRÉVUE',
  metric: { wetMass: 'MASSE AU LANCEMENT', dryMass: 'MASSE À VIDE', propellant: 'ERGOLS', powerAtArrival: 'ÉNERGIE À L’ARRIVÉE', deltaVCapability: 'CAPACITÉ Δv' },
  noCompare: 'PAS ENCORE DE VRAIE MISSION À COMPARER',
  realLesson: 'VRAIE LEÇON',
  fromFlight: 'TIRÉE DE CE VOL',
  toVerify: 'À VÉRIFIER',
  lessonTitle: 'la leçon',
  next: (title: string) => `SUIVANT : ${title.toUpperCase()}`,
  flyAgain: 'REVOLER',
  lastWords: 'Le dernier message d’Opportunity',
  nextStar: (hint: string) => `PROCHAINE ÉTOILE · ${hint}`,
};

/** The comic's sound effects that are not a hazard's (PANEL_SOUND). */
export const COMIC_WORDS = { boom: 'KA-BOUM', zap: 'ZZZT !', whoosh: 'FIIIOUUU', beep: 'BIP BIP' };

/** The Daily's result screen, its share card and its share text. */
export const DAILY_WORDS = {
  no: (n: string) => `MISSION DU JOUR N° ${n}`,
  result: (n: string) => `Résultat de la mission du jour ${n}`,
  date: (date: string) => `${date} · MARS`,
  theme: (danger: string) => `JOUR DE ${danger.toUpperCase()}`,
  quiet: 'CROISIÈRE CALME',
  stars: (n: string) => `${n} étoiles sur 3`,
  how: 'Comment s’est passé chaque danger',
  none: 'AUCUNE CARTE DANGER AUJOURD’HUI. UN VOL CALME.',
  result_: { held: 'held', cost: 'vous a coûté', hurt: 'hurt' } as Record<'held' | 'cost' | 'hurt', string>,
  realOf: (date: string) => `, événement réel du ${date}`,
  day: 'JOUR',
  dayShort: 'J',
  alive: 'ROBOT EN VIE',
  lost: 'ROBOT PERDU',
  endDay: (day: string) => ` · JOUR ${day}`,
  streak: (n: string) => `SÉRIE ${n}`,
  madeIt: 'VOUS AVEZ RÉUSSI.',
  gone: 'LE ROBOT EST PERDU.',
  show: 'MONTREZ-LE À VOTRE ÉQUIPAGE.',
  copies: 'COPIÉ EN TEXTE',
  copied: 'COPIÉ ✓',
  share: 'PARTAGER LE RÉSULTAT',
  copy: 'COPIER LE RÉSULTAT',
  save: 'ENREGISTRER L’IMAGE',
  report: 'RAPPORT DE MISSION',
  next: (t: string) => `PROCHAINE MISSION DU JOUR DANS ${t}`,
  shareAlive: (day: string) => `🤖 en vie · jour ${day}`,
  shareLost: (day: string) => `💥 perdu · jour ${day}`,
  shareQuiet: '🟦 un vol calme',
};

// ---------------------------------------------------------------------------
// Team mode (spec: Team mode; design: Signal Delay - Team Setup.dc.html, screens T1 and T2). Call signs stay English,
// like robot names.

/** The four roles: names, the duty line and what each one owns (with the design's icons). */
export const ROLE_WORDS: Record<RoleId, { name: string; short: string; ab: string; duty: string; icon: SDIconName; owns: { label: string; icon: SDIconName }[] }> = {
  'flight-director': {
    name: 'DIRECTEUR DE VOL',
    short: 'DIR. DE VOL',
    ab: 'DV',
    duty: 'Fixe l’objectif, protège le budget, tranche en dernier.',
    icon: 'star',
    owns: [
      { label: 'OBJECTIF', icon: 'star' },
      { label: 'BUDGET', icon: 'lock' },
      { label: 'DERNIER MOT', icon: 'check' },
    ],
  },
  'spacecraft-engineer': {
    name: 'INGÉNIEUR DE LA SONDE',
    short: 'INGÉNIEUR',
    ab: 'ING',
    duty: 'Garde l’énergie, la batterie et le carburant dans le vert.',
    icon: 'power',
    owns: [
      { label: 'ÉNERGIE', icon: 'power' },
      { label: 'BATTERIE', icon: 'battery' },
      { label: 'CARBURANT', icon: 'fuel' },
    ],
  },
  'science-lead': {
    name: 'RESPONSABLE SCIENCE',
    short: 'SCIENCE',
    ab: 'SCI',
    duty: 'Choisit les instruments et les cibles sur Mars.',
    icon: 'camera',
    owns: [
      { label: 'INSTRUMENTS', icon: 'camera' },
      { label: 'CIBLES', icon: 'orbit' },
    ],
  },
  'comms-ops': {
    name: 'COMMS ET OPS',
    short: 'COMMS ET OPS',
    ab: 'COM',
    duty: 'Gère l’antenne, les appels vers la Terre et la file de commandes.',
    icon: 'dish',
    owns: [
      { label: 'ANTENNE', icon: 'dish' },
      { label: 'APPELS', icon: 'calendar' },
      { label: 'FILE', icon: 'computer' },
    ],
  },
};

/** Team Setup (T1) and the Home key. */
export const TEAM_WORDS = {
  menu: 'ÉQUIPE',
  menuSub: 'Jusqu’à quatre joueurs pilotent un seul robot ensemble',
  menuTag: 'COOP',
  kicker: 'MODE ÉQUIPE · VERS MARS',
  /** The four steps along the top (numbered by the screen). */
  steps: ['ÉQUIPE', 'EMBALLER', 'VOLER', 'RAPPORT'],
  step: (n: string, word: string) => `${n} ${word}`,
  crew: 'ÉQUIPAGE',
  whoFlies: 'QUI VOLE',
  play: 'JOUER',
  players: 'JOUEURS',
  where: 'OÙ',
  callSigns: 'INDICATIFS',
  callSignTitle: (sign: string) => `${sign} : touchez pour un autre indicatif`,
  solo: 'SOLO',
  soloSub: 'Un seul joueur tient les quatre rôles.',
  team: 'ÉQUIPE',
  teamSub: 'De deux à quatre joueurs. Chaque rôle défend son point de vue.',
  local: 'LOCAL',
  localSub: 'Un seul écran partagé : un projecteur de classe ou un ordinateur.',
  localShort: 'UN ÉCRAN PARTAGÉ',
  online: 'SALLE EN LIGNE',
  onlineSub: 'Un code de salle. Chaque joueur rejoint sur son propre téléphone.',
  onlineShort: 'TÉLÉPHONES + CODE DE SALLE',
  chipSolo: 'SOLO',
  chipCrew: (n: string) => `LOCAL · ÉQUIPAGE DE ${n}`,
  chipOnline: 'EN LIGNE · TÉLÉPHONES',
  lineOnline: 'SALLE EN LIGNE · CHAQUE JOUEUR SUR UN TÉLÉPHONE',
  onlineCrew: 'LES TÉLÉPHONES CHOISISSENT LEURS RÔLES DANS LA SALLE.',
  nextRoomMsg: 'ENSUITE : OUVREZ UNE SALLE ET PARTAGEZ LE CODE.',
  nextRoom: 'SUIVANT · OUVRIR LA SALLE',
  soloNoRoom: 'UNE SALLE EN LIGNE EST POUR UNE ÉQUIPE : CHOISISSEZ D’ABORD ÉQUIPE.',
  chipShort: (n: string) => `ÉQUIPAGE DE ${n}`,
  role: (n: string, ab: string) => `RÔLE ${n} · ${ab}`,
  heldBy: 'TENU PAR',
  handOn: (role: string, sign: string) => `${role}, tenu par ${sign} : touchez pour le passer au joueur suivant`,
  roles: (n: string) => `${n} RÔLES`,
  lineSolo: 'VOL EN SOLO · VOUS TENEZ LES QUATRE RÔLES',
  lineTeam: (n: string) => `${n} JOUEURS · UN ÉCRAN PARTAGÉ`,
  soloNoVotes: 'PAS DE VOTE. CHAQUE DÉCISION EST LA VÔTRE.',
  doubled: (names: string, many: boolean) => `${names} ${many ? 'TIENNENT' : 'TIENT'} DEUX RÔLES.`,
  oneEach: 'UN RÔLE CHACUN. CHAQUE RÔLE PEUT S’OPPOSER.',
  idle: (names: string) => `${names} N’A PAS ENCORE DE RÔLE. TOUCHEZ UNE PUCE TENU PAR.`,
  nextObjective: 'ENSUITE : LE DIRECTEUR DE VOL CHOISIT L’OBJECTIF DE LA MISSION.',
  tapHint: 'Touchez une puce TENU PAR pour passer un rôle à quelqu’un d’autre.',
  next: 'SUIVANT · OBJECTIF',
  /** Call signs or roles joined, as the design writes them. */
  join: (names: string[]) => names.join(' + '),
};

/** The Mission Objective (T2): the Flight Director picks, the others agree or object. */
export const OBJECTIVE_WORDS = {
  title: 'OBJECTIF DE LA MISSION',
  phoneTitle: 'OBJECTIF',
  picks: 'CHOISIT',
  fdChip: (sign: string) => `DIRECTEUR DE VOL · ${sign}`,
  fdPhone: (sign: string) => `LE DIRECTEUR DE VOL ${sign} CHOISIT · LES AUTRES VOTENT`,
  soloPhone: 'VOUS CHOISISSEZ · PERSONNE D’AUTRE NE VOTE',
  num: (n: string) => `OBJECTIF ${n}`,
  matters: 'LES CIBLES QUI COMPTENT LE PLUS',
  share: (p: string) => `${p} DE LA SCIENCE`,
  needs: (parts: string) => `COMPTE AVEC : ${parts}`,
  or: ' OU ',
  packed: 'À BORD',
  hardest: (why: string) => `LE PLUS DUR · ${why}`,
  strainShort: (ab: string, why: string) => `${ab} · ${why}`,
  why: { drag: 'RISQUE DE FREINAGE', data: 'LE PLUS DE DONNÉES', fuel: 'LE PLUS DE CARBURANT' },
  stampPick: 'CHOIX DU DV',
  stampLocked: 'VERROUILLÉ',
  agree: 'D’ACCORD',
  object: 'CONTRE',
  auto: 'MÊME JOUEUR QUE LE DIRECTEUR DE VOL · D’ACCORD',
  autoShort: 'D’ACCORD',
  voteTitle: (role: string, word: string) => `${role}: ${word}`,
  msgPick: 'DIRECTEUR DE VOL : CHOISISSEZ UN OBJECTIF.',
  msgWait: (n: string, one: boolean) => `EN ATTENTE DE ${n} ${one ? 'VOTE' : 'VOTES'}.`,
  msgObject: (roles: string, one: boolean) => `${roles} ${one ? 'S’OPPOSE' : 'S’OPPOSENT'}. DISCUTEZ, PUIS CHOISISSEZ À NOUVEAU OU PASSEZ OUTRE.`,
  msgAll: 'TOUT LE MONDE EST D’ACCORD. PRÊT À VERROUILLER.',
  msgLocked: (t: string) => `OBJECTIF VERROUILLÉ : ${t}.`,
  msgOverruled: (t: string) => `PASSÉ OUTRE. OBJECTIF VERROUILLÉ : ${t}.`,
  lock: 'VERROUILLER L’OBJECTIF',
  waiting: 'EN ATTENTE DES VOTES',
  overrule: 'PASSER OUTRE · DERNIER MOT',
  nextPack: 'SUIVANT · EMBALLER',
  objectives: {
    atmosphere: { title: 'ÉTUDIER L’ATMOSPHÈRE', line: 'Découvrez combien d’air il reste à Mars, et où est passé le reste.' },
    surface: { title: 'CARTOGRAPHIER LA SURFACE', line: 'Photographiez les plus grands sites de la planète aussi nettement que la caméra le permet.' },
    moons: { title: 'VISITER LES LUNES', line: 'Passez près de Phobos et Déimos et découvrez de quoi elles sont faites.' },
  } as Record<ObjectiveId, { title: string; line: string }>,
};

/** A solo player's objective (spec UI rule 56): picked in the Red Planet briefing, shown on Pack and in the report. */
export const OBJECTIVE_PICK_WORDS = {
  heading: 'CHOISISSEZ VOTRE OBJECTIF',
  sub: 'À quoi sert cette mission ? Ses cibles portent l’essentiel de la science, mais seulement avec la pièce scientifique adaptée à bord.',
  yours: 'VOTRE OBJECTIF',
  group: 'Objectif de la mission',
  needs: (parts: string) => `BESOIN : ${parts}`,
  onBoard: '✓ À BORD',
  notOnBoard: '✗ NON EMPORTÉ',
  startLocked: 'CHOISISSEZ-EN UN POUR COMMENCER',
  plate: 'OBJECTIF',
  change: 'CHANGER ▸',
  changeLabel: 'Changer l’objectif',
  warn: (parts: string) => `EMPORTEZ ${parts}, SINON CET OBJECTIF NE PEUT PAS ÊTRE ATTEINT.`,
  result: {
    met: (title: string, pct: string) => `OBJECTIF · ${title} · ATTEINT : ${pct} DE SA SCIENCE EST ARRIVÉE`,
    missed: (title: string, pct: string) => `OBJECTIF · ${title} · MANQUÉ : SEULEMENT ${pct} DE SA SCIENCE EST ARRIVÉE`,
    noPart: (title: string) => `OBJECTIF · ${title} · MANQUÉ : AUCUNE PIÈCE ADAPTÉE N’ÉTAIT À BORD`,
  },
};

/** The preset quick messages (team.json `quick`): the only way the team talks, since players may be children. */
export const QUICK_WORDS: Record<string, string> = {
  agree: 'D’ACCORD',
  disagree: 'PAS D’ACCORD',
  'too-heavy': 'TROP LOURD',
  'need-power': 'IL FAUT PLUS D’ÉNERGIE',
  'save-fuel': 'ÉCONOMISER LE CARBURANT',
  'science-first': 'LA SCIENCE D’ABORD',
  'wait-signal': 'ATTENDRE LE SIGNAL',
  'good-call': 'BONNE DÉCISION',
  help: 'AIDE ?',
};

/** Team Pack (design T3): the shelf by role, the shared limits, the conflict banner, the team line. */
export const TEAM_PACK_WORDS = {
  kicker: (objective: string) => `ÉQUIPE · OBJECTIF : ${objective}`,
  kickerNone: 'ÉQUIPE · VERS MARS',
  shelf: 'ÉTAGÈRE DE PIÈCES',
  byRole: 'PAR RÔLE',
  roleSpend: (cost: string, mass: string) => `${cost} · ${mass}`,
  limits: 'LIMITES PARTAGÉES',
  mass: 'MASSE · PARTAGÉE',
  budget: 'BUDGET · PARTAGÉ',
  of: (used: string, limit: string) => `${used} / ${limit}`,
  colRole: 'RÔLE',
  colMass: 'MASSE',
  colCost: 'COÛT',
  colShare: 'PART',
  over: { mass: 'TROP LOURD · NÉGOCIEZ', cost: 'BUDGET DÉPASSÉ · NÉGOCIEZ', room: 'PAS DE PLACE · NÉGOCIEZ' } as Record<'mass' | 'cost' | 'room', string>,
  overBy: (amount: string) => `+${amount}`,
  overLine: 'Discutez-en : un seul retrait suffit. Le directeur de vol tranche en cas d’égalité.',
  roomLine: (part: string) => `${part} ne tient pas. Quelqu’un doit faire de la place.`,
  line: 'LIGNE D’ÉQUIPE · MESSAGES PRÉDÉFINIS',
  msgs: (n: string) => `${n} MSG`,
  empty: 'PAS ENCORE DE MESSAGE. TOUCHEZ-EN UN CI-DESSOUS.',
  speakingAs: 'PARLE EN TANT QUE',
  speakAs: (role: string) => `Parler en tant que ${role}`,
  say: (role: string, words: string) => `${role} dit : ${words}`,
  partRole: (part: string, role: string) => `${part} (${role})`,
};

/** Team Fly (design T4): the danger card's vote strip, the role tokens, the final call and the team's teletype lines. */
export const TEAM_FLY_WORDS = {
  kicker: (objective: string) => `VOL · ${objective}`,
  whose: 'À QUI LA DÉCISION',
  stages: { recommend: 'RECOMMANDER', vote: 'VOTER', call: 'DERNIER MOT' } as Record<'recommend' | 'vote' | 'call', string>,
  stage: (n: string, word: string) => `${n} · ${word}`,
  allRoles: 'TOUS LES RÔLES',
  allShort: 'TOUS',
  clockHeld: 'HORLOGE EN PAUSE',
  /** The option letters on the cards, in order. */
  letters: ['A', 'B', 'C'],
  pick: (letter: string, label: string) => `${letter} · ${label}`,
  recommendedBy: (role: string, sign: string) => `RECOMMANDÉ PAR ${role} · ${sign}`,
  recommendNow: (role: string) => `${role} : TOUCHEZ UNE CARTE POUR RECOMMANDER`,
  votes: 'VOTES · TOUCHEZ VOTRE JETON',
  votesShort: 'VOTES',
  votesOf: (n: string, total: string) => `${n} SUR ${total}`,
  token: (who: string, letter: string) => `${who} : voter ${letter}`,
  tokenTaken: (who: string, letter: string) => `${who} a voté ${letter}`,
  finalCall: 'DERNIER MOT',
  leans: (letter: string) => `L’ÉQUIPE PENCHE POUR ${letter}`,
  noLean: 'PAS ENCORE DE VOTE',
  tapCard: 'TOUCHEZ UNE CARTE POUR CHOISIR',
  waiting: (n: string, one: boolean) => `EN ATTENTE DE ${n} ${one ? 'VOTE' : 'VOTES'}`,
  soloCall: 'À VOUS · TOUCHEZ UNE CARTE',
  called: (letter: string) => `DÉCIDÉ · ${letter}`,
  lockedForVote: 'VERROUILLÉ POUR LE VOTE',
  line: { recommend: (opt: string) => `RECOMMANDER ${opt}`, vote: (opt: string) => `VOTER ${opt}`, call: (opt: string) => `DERNIER MOT · ${opt}` },
  keyOwner: (key: string, role: string) => `${key} (${role})`,
  team: 'ÉQUIPE',
};

/** Team Debrief (design T5): the Mission Report's Team section, after the album and before FINAL TRANSMISSION. */
export const TEAM_REPORT_WORDS = {
  title: 'DÉBRIEFING D’ÉQUIPE',
  crew: (n: string) => `ÉQUIPAGE DE ${n}`,
  objective: (title: string) => `OBJECTIF : ${title}`,
  decisions: (n: string, one: boolean) => `${n} ${one ? 'CARTE DANGER VOTÉE' : 'CARTES DANGER VOTÉES'}`,
  cols: { role: 'RÔLE', key: 'DÉCISION CLÉ', effect: 'EFFET SUR LA MISSION', verdict: 'VERDICT' },
  score: 'SCORE D’ÉQUIPE',
  outOf: (max: string) => `/ ${max}`,
  outOfShort: (max: string) => `/${max}`,
  points: (p: string) => `+${p}`,
  parts: { votes: 'ACCORDS', conflicts: 'CONFLITS RÉSOLUS', objective: 'OBJECTIF ATTEINT' } as Record<'votes' | 'conflicts' | 'objective', string>,
  partsShort: { votes: 'ACCORDS', conflicts: 'CONFLITS', objective: 'OBJECTIF' } as Record<'votes' | 'conflicts' | 'objective', string>,
  nOf: (n: string, of: string) => `${n} / ${of}`,
  votesLine: (n: string, of: string) => `${n} DÉCISIONS SUR ${of} ONT SUIVI LA RECOMMANDATION`,
  noVotes: 'AUCUNE CARTE DANGER À VOTER',
  conflictsLine: (n: string, of: string) => `${n} DISPUTES BUDGÉTAIRES SUR ${of} RÉGLÉES PAR LA DISCUSSION`,
  noConflicts: 'AUCUNE DISPUTE BUDGÉTAIRE',
  objectiveLine: (title: string, met: boolean) => `${title} · ${met ? 'ATTEINT' : 'MANQUÉ'}`,
  met: 'ATTEINT',
  missed: 'MANQUÉ',
  none: 'AUCUN',
  note: 'Le score d’équipe n’appartient qu’à l’équipe : il ne change jamais les étoiles. Suivez les recommandations, réglez chaque dispute budgétaire et atteignez l’objectif pour un score maximal.',
  next: 'SUIVANT · DERNIÈRE TRANSMISSION',
  label: 'Débriefing d’équipe',
  /** The key decision's kicker. */
  when: {
    objective: 'AVANT LE LANCEMENT · OBJECTIF',
    card: (day: string, hazard: string) => `JOUR ${day} · ${hazard}`,
    observe: 'EN ORBITE · PHOTOS',
    dsn: 'PASSAGES DSN',
    part: 'EMBALLER · UNE PIÈCE',
    none: 'AUCUNE DÉCISION',
  },
  /** The key decision. */
  call: {
    objective: (title: string, overruled: boolean) => `« ${title} » VERROUILLÉ${overruled ? ' MALGRÉ UNE OBJECTION' : ''}.`,
    recommended: (opt: string) => `A RECOMMANDÉ ${opt}.`,
    called: (opt: string) => `A DÉCIDÉ ${opt}.`,
    agreed: (yes: string, no: string) => `L’ÉQUIPE A APPROUVÉ ${yes}–${no}.`,
    chose: (opt: string, yes: string, no: string) => `L’ÉQUIPE A CHOISI ${opt} ${yes}–${no}.`,
    observe: (n: string, one: boolean) => `A COMMANDÉ ${n} ${one ? 'PHOTO' : 'PHOTOS'}.`,
    dsn: (days: string) => `A RÉSERVÉ ${days} DE PASSAGES DSN.`,
    part: (name: string) => `A EMPORTÉ : ${name}.`,
    none: 'RIEN DANS LE JOURNAL.',
  },
  /** What it did. */
  effect: {
    objective: (share: string, met: boolean) => (met ? `Atteint : ${share} de la science de l’objectif est arrivée.` : `Manqué : seulement ${share} de la science de l’objectif est arrivée.`),
    noInstrument: 'Aucun instrument pour l’objectif n’était à bord.',
    cardGood: 'La sonde s’en est sortie.',
    cardBad: 'Ça s’est mal passé : la sonde l’a payé.',
    observe: (home: string, ordered: string, names: string, science: string) => `${home} sur ${ordered} sont arrivées (${names}). Science rapportée : ${science}.`,
    dsn: 'Plus de temps sur les grandes antennes, donc plus de données arrivées.',
    part: (dangers: string) => `Elle protégeait contre ${dangers}, et c’est arrivé.`,
    partIdle: 'Aucun des dangers qu’elle couvre n’est arrivé cette fois.',
    none: 'Aucune décision n’est revenue à ce rôle pendant ce vol.',
  },
  /** The stamp, by the key decision's kind and its verdict. */
  verdict: {
    objective: { good: 'OBJECTIF ATTEINT', bad: 'OBJECTIF MANQUÉ' },
    card: { good: 'BONNE DÉCISION', bad: 'DÉCISION COÛTEUSE' },
    observe: { good: 'TOUT ARRIVÉ', mixed: 'EN PARTIE ARRIVÉ', bad: 'RIEN D’ARRIVÉ' },
    dsn: { good: 'PLUS DE DONNÉES' },
    part: { good: 'ÇA VALAIT LE COUP', none: 'PAS NÉCESSAIRE' },
    none: { none: 'AUCUNE DÉCISION' },
  } as Record<string, Partial<Record<'good' | 'bad' | 'mixed' | 'none', string>>>,
};

/** The Online Room's host screen (design T6a; room states T7a) and the Home key a phone joins with. */
export const ONLINE_WORDS = {
  kicker: 'SALLE EN LIGNE · HÔTE',
  roomCode: 'CODE DE LA SALLE',
  steps: ['OUVREZ SIGNAL DELAY SUR UN TÉLÉPHONE', 'TOUCHEZ REJOINDRE · TAPEZ LE CODE', 'CHOISISSEZ UN RÔLE'],
  chipOpen: (n: string, max: string) => `SALLE OUVERTE · ${n}/${max}`,
  chipOpening: 'OUVERTURE DE LA SALLE…',
  chipLinked: (n: string, max: string) => `${n}/${max} CONNECTÉS`,
  chipPaused: (n: string, max: string) => `${n}/${max} CONNECTÉS · EN PAUSE`,
  chipOffline: 'RELAIS HORS LIGNE',
  chipClosed: 'SALLE FERMÉE',
  bar: (code: string, n: string, max: string) => `SALLE ${code} · ${n}/${max}`,
  slotJoined: (sign: string) => `${sign} · A REJOINT SUR TÉLÉPHONE`,
  slotWaiting: 'EN ATTENTE…',
  slotAway: (sign: string, clock: string) => `${sign} · RECONNEXION ${clock}`,
  slotHanded: (sign: string, by: string) => `${by} TIENT · ${sign} PEUT LE RÉCUPÉRER`,
  slotNoRelay: '— PAS DE RELAIS',
  freeSlot: (role: string, sign: string) => `${role}, ${sign} : touchez pour libérer cette place`,
  msgNeedDirector: 'EN ATTENTE D’UN DIRECTEUR DE VOL. LA MISSION EN A BESOIN POUR COMMENCER.',
  msgEmpty: (roles: string, director: string) => `LIBRES : ${roles}. LANCEZ MAINTENANT ET ${director} LES TIENT.`,
  msgReady: 'LES QUATRE RÔLES SONT PRIS. PRÊT.',
  msgOpening: 'OUVERTURE DE LA SALLE…',
  msgAway: (sign: string, clock: string) => `${sign} S’EST DÉCONNECTÉ. HORLOGE EN PAUSE. RÔLE GARDÉ PENDANT ${clock}.`,
  msgHanded: (by: string, role: string, sign: string) => `${by} TIENT ${role}. ${sign} LE RÉCUPÈRE DÈS SON RETOUR.`,
  msgRunning: 'MISSION EN COURS. CHAQUE TÉLÉPHONE NE MONTRE QUE SON RÔLE.',
  msgOffline: (tries: string, clock: string) => `RELAIS INJOIGNABLE · ${tries} ESSAIS · PROCHAIN ESSAI DANS ${clock}.`,
  msgNotSetUp: 'CETTE COPIE DU JEU N’A PAS DE RELAIS DE SALLE CONFIGURÉ.',
  msgResume: 'TAPEZ LE CODE DE REPRISE. CHAQUE TÉLÉPHONE QUI ÉTAIT DANS LA SALLE L’AFFICHE.',
  msgResumeUnknown: 'AUCUNE MISSION AVEC CE CODE SUR CET ÉCRAN (OU ELLE EST TROP ANCIENNE).',
  msgClosed: (code: string) => `LA SALLE A EXPIRÉ. CODE DE REPRISE : ${code}.`,
  note: 'Cet écran continue d’afficher tout le jeu. Les téléphones ne montrent que leur rôle.',
  noteAway: 'Un téléphone déconnecté ne perd jamais son rôle. PASSER MAINTENANT le transmet pour que la partie continue.',
  noteOffline: 'La coop locale garde les quatre mêmes rôles sur cet écran. La mission elle-même ne change pas.',
  noteResume: 'La mission revient depuis ce navigateur : même code de salle, même journal.',
  start: 'LANCER LA MISSION',
  handNow: (ab: string, sign: string) => `PASSER ${ab} À ${sign}`,
  relay: 'RELAIS DE SALLE',
  offline: 'HORS LIGNE',
  offlineLine: 'LES TÉLÉPHONES NE PEUVENT PAS REJOINDRE POUR L’INSTANT. CET ÉCRAN FONCTIONNE TOUJOURS.',
  retry: 'RÉESSAYER',
  retryLine: (tries: string, clock: string) => `ESSAI ${tries} · AUTO DANS ${clock}`,
  local: 'JOUER EN COOP LOCALE',
  localSub: 'UN ÉCRAN PARTAGÉ · LES QUATRE MÊMES RÔLES',
  paused: (day: string) => `MISSION EN PAUSE · JOUR ${day}`,
  reconnecting: 'RECONNEXION',
  roleHanded: 'RÔLE TRANSMIS',
  reconWho: (sign: string, role: string) => `${sign} · ${role}`,
  handedWho: (role: string, sign: string) => `${role} → ${sign}`,
  reconLine: (clock: string) => `RÔLE GARDÉ PENDANT ${clock} · RIEN N’ARRIVE AU ROBOT`,
  handedLine: (sign: string) => `${sign} RÉCUPÈRE LE RÔLE QUAND SON TÉLÉPHONE SE RECONNECTE.`,
  resume: 'REPRENDRE UNE MISSION',
  resumeKey: 'REPRENDRE',
  resumeOpen: 'REPRENDRE UNE MISSION ▸',
  resumeCode: 'CODE DE REPRISE',
  menu: 'REJOINDRE',
  menuSub: 'Rejoindre la salle d’une équipe sur ce téléphone',
  menuTag: 'SALLE',
};

/** Joining a room on a phone (design T6b; relay offline T7e). */
export const JOIN_WORDS = {
  title: 'REJOINDRE UNE SALLE',
  top: 'REJOINDRE',
  codeLabel: 'CODE DE LA SALLE · SUR LE GRAND ÉCRAN',
  codeInput: 'Code de la salle',
  look: 'TROUVER LA SALLE',
  searching: 'RECHERCHE DE LA SALLE…',
  found: 'SALLE TROUVÉE',
  badCode: 'UN CODE DE SALLE EST UN MOT ET TROIS CARACTÈRES, COMME CELUI DU GRAND ÉCRAN.',
  pickRole: 'CHOISISSEZ VOTRE RÔLE',
  free: 'LIBRE',
  you: '▸ VOUS',
  joinAs: (role: string) => `REJOINDRE EN TANT QUE ${role}`,
  pickFirst: 'CHOISISSEZ D’ABORD UN RÔLE',
  callSign: (sign: string) => `VOTRE INDICATIF · ${sign}`,
  full: 'CETTE SALLE EST PLEINE.',
  started: 'LA MISSION A COMMENCÉ. UN TÉLÉPHONE PEUT REPRENDRE UNE PLACE QUI ATTEND SON TÉLÉPHONE.',
  takeOver: (sign: string) => `REPRENDRE LA PLACE DE ${sign}`,
  protocol: 'CE TÉLÉPHONE A UNE VERSION PLUS ANCIENNE DU JEU. RECHARGEZ LA PAGE.',
  offlineTitle: 'RELAIS HORS LIGNE',
  offlineBody: (clock: string) => `Impossible de joindre le relais de salle. Votre code est bon : c’est le réseau le problème. Prochain essai dans ${clock}.`,
  notSetUp: 'Cette copie du jeu n’a pas de relais de salle configuré. Jouez plutôt en coop locale.',
  tryN: (n: string) => `ESSAI ${n}`,
  noRelay: 'PAS DE RELAIS ? JOUEZ EN COOP LOCALE',
  passPhone: 'FAITES TOURNER CE TÉLÉPHONE',
  passPhoneSub: 'Les quatre rôles sur un seul téléphone. Passez-le à chaque vote.',
  gather: 'REGROUPEZ-VOUS DEVANT L’ÉCRAN HÔTE',
  gatherSub: 'Demandez à l’hôte de toucher JOUER EN COOP LOCALE. Tout le monde joue sur le grand écran.',
  localHere: 'COOP LOCALE SUR CE TÉLÉPHONE',
  retryNow: 'RÉESSAYER MAINTENANT',
};

/** A phone's controller (design T6c–f; room states T7b, T7c, T7d). */
export const CONTROLLER_WORDS = {
  youAre: (sign: string) => `VOUS ÊTES · ${sign}`,
  youreIn: (sign: string) => `VOUS ÊTES DEDANS · ${sign}`,
  linked: 'CONNECTÉ',
  noSignal: 'AUCUN SIGNAL',
  roomClosed: 'SALLE FERMÉE',
  day: (d: string) => `JOUR ${d}`,
  crew: (n: string, max: string) => `ÉQUIPAGE · ${n} SUR ${max}`,
  hostBig: 'HÔTE · GRAND ÉCRAN',
  open: 'LIBRE',
  meTag: (sign: string) => `${sign} · VOUS`,
  waiting: 'EN ATTENTE DU DÉPART PAR LE DIRECTEUR DE VOL',
  waitingNoFd: 'PAS ENCORE DE DIRECTEUR DE VOL. QUE QUELQU’UN LE PRENNE.',
  openRoles: (roles: string) => `ENCORE LIBRES : ${roles} · LE DIRECTEUR DE VOL PEUT QUAND MÊME LANCER`,
  allIn: 'LES QUATRE SONT LÀ · PRÊT À LANCER',
  keepOpen: 'Gardez cet écran ouvert. Quand la mission commence, il devient vos commandes.',
  changeRole: 'CHANGER DE RÔLE',
  leave: 'QUITTER LA SALLE',
  turnMine: { recommend: 'À VOUS · RECOMMANDER', vote: 'À VOUS · VOTER', call: 'À VOUS · DONNER LE DERNIER MOT' } as Record<'recommend' | 'vote' | 'call', string>,
  turnWait: (abs: string) => `EN ATTENTE · ${abs}`,
  turnDone: (pick: string) => `ORDRE ENVOYÉ · ${pick}`,
  calm: 'AUCUN DANGER POUR L’INSTANT',
  calmLine: 'Regardez le grand écran. Une carte danger arrive ici dès que la Terre la voit.',
  objective: 'OBJECTIF',
  notSet: 'NON DÉFINI',
  ends: 'LA MISSION FINIT DANS',
  danger: (title: string) => `DANGER · ${title}`,
  recBy: (role: string, pick: string) => `RECOMMANDÉ PAR ${role} : ${pick}`,
  waitRec: (role: string) => `EN ATTENTE DE LA RECOMMANDATION DE ${role}`,
  teamVotes: 'VOTES DE L’ÉQUIPE',
  finalCall: 'DERNIER MOT',
  finalPick: 'TOUCHEZ D’ABORD UN CHOIX CI-DESSUS',
  finalSend: (pick: string) => `ENVOYER ${pick}`,
  finalOverrule: (pick: string) => `ENVOYER ${pick} · PASSE OUTRE L’ÉQUIPE`,
  yourRec: 'VOTRE RECOMMANDATION · L’ÉQUIPE LA VOIT',
  yourVote: 'VOTRE VOTE',
  voteTag: 'TOUCHEZ POUR VOTER',
  votedTag: 'VOTRE VOTE',
  gauges: 'LA SONDE',
  gauge: { power: 'ÉNERGIE', fuel: 'CARBURANT', data: 'DONNÉES', systems: 'SYSTÈMES' } as Record<'power' | 'fuel' | 'data' | 'systems', string>,
  targets: 'CIBLES SCIENTIFIQUES',
  targetsLater: 'LES CIBLES S’OUVRENT SUR L’ORBITE SCIENTIFIQUE.',
  observe: 'OBSERVER',
  targetState: { ready: 'PRÊTE', ordered: 'COMMANDÉE', observing: 'EN OBSERVATION', 'on-board': 'À BORD', sent: 'ENVOI', home: 'ARRIVÉE', refused: 'REFUSÉE' } as Record<string, string>,
  nextPass: 'PROCHAIN PASSAGE DSN',
  noPass: 'AUCUN EN VUE',
  passNow: 'EN VUE MAINTENANT',
  lightTime: 'TEMPS-LUMIÈRE ALLER SIMPLE',
  queue: 'FILE DE COMMANDES',
  queueEmpty: 'RIEN EN ROUTE.',
  queueKinds: { 'power-plan': 'PLAN D’ÉNERGIE', observe: 'OBSERVER', respond: 'ORDRE DE DANGER', 'standing-orders': 'ORDRES PERMANENTS' } as Record<string, string>,
  book: (dish: string) => `RÉSERVER LA GRANDE ANTENNE · ${dish}`,
  booked: 'GRANDE ANTENNE RÉSERVÉE',
  lost: 'SIGNAL PERDU',
  reconnectTry: (n: string) => `RECONNEXION · ESSAI ${n}`,
  lostBody: 'L’horloge de l’équipe est en pause. Vos commandes reviennent exactement comme vous les avez laissées.',
  teamSees: 'CE QUE VOIT VOTRE ÉQUIPE',
  teamSeesLine: (sign: string) => `${sign} SE RECONNECTE · HORLOGE EN PAUSE`,
  retryNow: 'RÉESSAYER MAINTENANT',
  hostLeft: 'L’ÉCRAN HÔTE S’EST FERMÉ',
  expired: 'LA SALLE A EXPIRÉ',
  ended: 'L’HÔTE A FERMÉ LA SALLE',
  hostLeftBody: 'Rien n’est perdu. La mission est sauvegardée à son dernier ordre.',
  roomEnded: 'SALLE TERMINÉE',
  resumeCode: 'CODE DE REPRISE',
  resumeHow: (code: string) => `L’HÔTE TAPE CE CODE SUR LE GRAND ÉCRAN. ENSUITE, TOUT LE MONDE REJOINT AVEC ${code}.`,
  copy: 'COPIER LE CODE DE REPRISE',
  copied: 'CODE COPIÉ ✓',
  backHome: 'RETOUR À L’ACCUEIL',
  savedRole: 'VOTRE RÔLE',
  savedStage: 'OÙ',
  stages: { lobby: 'SALLE D’ATTENTE', objective: 'OBJECTIF', pack: 'EMBALLAGE', fly: 'EN VOL', report: 'RAPPORT' } as Record<string, string>,
  report: 'MISSION TERMINÉE · LE RAPPORT EST SUR LE GRAND ÉCRAN',
  bounce: { 'too-fast': 'DOUCEMENT · UNE TOUCHE À LA FOIS', 'not-your-role': 'CE N’EST PAS VOTRE RÔLE POUR L’INSTANT', taken: 'QUELQU’UN D’AUTRE A CE RÔLE' } as Record<string, string>,
  bounced: 'L’HÔTE N’A PAS PU PRENDRE ÇA EN COMPTE',
  last: (ab: string, words: string) => `DERNIER · [${ab}] ${words}`,
  noLast: 'PAS ENCORE DE MESSAGE',
  pickObjective: 'CHOISISSEZ L’OBJECTIF',
  fdPicks: (sign: string) => `LE DIRECTEUR DE VOL (${sign}) CHOISIT`,
  yourParts: 'VOS PIÈCES',
  packedTag: 'EMPORTÉE',
  addTag: 'AJOUTER',
  fullTag: 'PAS DE PLACE',
  launch: 'LANCEMENT',
  launchWait: 'LE DIRECTEUR DE VOL LANCE',
  blocked: 'PAS PRÊT AU LANCEMENT',
  speaking: 'MESSAGES RAPIDES',
};

/** The default mission names (starters.ts), shown in the player's language; a renamed mission keeps its name. */
export const MISSION_NAMES: Record<string, string> = {
  'Silver Lantern': 'Lanterne d’argent',
  'Cloud Diver': 'Plongeur des nuages',
  'Red Atmosphere': 'Atmosphère rouge',
  'Pebble Catcher': 'Attrape-cailloux',
  'Storm Watcher': 'Guetteur de tempêtes',
};
