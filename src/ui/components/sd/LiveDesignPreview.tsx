// LIVE DESIGN PREVIEW (Pack): the robot exactly as packed, drawn as a cutaway of its rocket. It reads the same
// `packed` list the nose grid and the engine read, so adding or removing a part redraws it at once. A drawing only:
// every number on Pack still comes from the engine (MISSION LIMITS, the weight scale).
//
// Layout: every part on board (the brain and the engine too) is a module in the cutaway window. The rocket lies nose
// right, so the whole craft fits a side column and a phone alike. The modules are ordered by zone, nose to tail
// (sensors and radio, power, brain, protection, propulsion), then spread evenly over the whole length of the window,
// so the rocket never shows an empty end. Each module is sized to the hull where it sits (smaller in the nose cone)
// and the window clips them, so nothing ever crosses the hull.
import { useId, useMemo } from 'react';
import type { Packed, PartId } from '../../../engine/pack';
import * as f from '../../format';
import { PART_LOOK, PREVIEW_WORDS } from '../../sdWords';
import { SD_ICON_PATHS, SDIcon } from './SDIcon';

interface Props {
  /** The parts packed in the nose right now (Pack state, or the team's log in Team mode). */
  packed: Packed;
  /** The rocket the craft flies on (its own name, English data). */
  rocketName?: string;
  /** The weight scale's state (engine cadetGauges): the hull glows amber or red when the craft gets heavy. */
  weight: 'ok' | 'warning' | 'over';
  compact?: boolean;
}

/** Parts every craft carries: listed apart from the additions, but drawn like every other module. */
const ALWAYS: readonly PartId[] = ['computer', 'engine'];

/** Zone of each part, nose (0) to tail (4): sensors and radio, power, brain, protection, propulsion. */
const ZONE: Record<PartId, number> = {
  dish: 0,
  camera: 0,
  spectrometer: 0,
  sniffer: 0,
  magnetometer: 0,
  radar: 0,
  solar: 1,
  battery: 1,
  computer: 2,
  spare: 2,
  autopilot: 2,
  shield: 3,
  bumper: 3,
  heater: 3,
  tank: 4,
  engine: 4,
};

// ---- Drawing geometry (SVG units, layout only): the rocket lies nose right, tail left ----
const VB_W = 440;
const VB_H = 206;
const CY = VB_H / 2;
const TAIL = 58;
const CORE_R = 37;
const BOAT_L = 236;
const BOAT_R = 252;
const FAIRING_R = 45;
const SHOULDER = 334;
const TIP = 428;
const WALL = 7;
const WIN_L = 68;
const WIN_R = 392;
const GAP = 5;
const MOD_MAX_W = 62;
const MOD_MAX_H = 54;
/** Label lines above and below the hull: near and far, so neighbouring labels never collide. */
const LABEL_Y = { top: [38, 20], bottom: [174, 192] } as const;

/** Half the hull's height at x. */
export function hull(x: number): number {
  if (x >= TIP || x < TAIL) return x < TAIL ? CORE_R : 0;
  if (x > SHOULDER) {
    // tangent ogive, approximated by an ellipse quadrant: round shoulder, sharp tip
    const t = (x - SHOULDER) / (TIP - SHOULDER);
    return FAIRING_R * Math.sqrt(Math.max(0, 1 - t * t)) * (1 - 0.18 * t);
  }
  if (x >= BOAT_R) return FAIRING_R;
  if (x > BOAT_L) return CORE_R + ((FAIRING_R - CORE_R) * (x - BOAT_L)) / (BOAT_R - BOAT_L);
  return CORE_R;
}

/** The hull outline (or the cutaway window, `inset` inside it), sampled along the nose cone. */
function hullPath(inset = 0, from = TAIL, to = TIP): string {
  const xs: number[] = [from, BOAT_L, BOAT_R, SHOULDER];
  for (let x = SHOULDER + 4; x < to; x += 4) xs.push(x);
  xs.push(to);
  const half = (x: number) => Math.max(0, hull(x) - inset);
  const top = xs.map((x) => `${x.toFixed(1)} ${(CY - half(x)).toFixed(1)}`);
  const bottom = [...xs].reverse().map((x) => `${x.toFixed(1)} ${(CY + half(x)).toFixed(1)}`);
  return `M${top.join(' L')} L${bottom.join(' L')} Z`;
}

/** The window the modules live in (tests check the layout against it). */
export const PREVIEW_WINDOW = { left: WIN_L, right: WIN_R, centre: CY, wall: WALL };

interface Slot {
  id: PartId;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Label above (-1) or below (1) the hull, on its near (0) or far (1) line. */
  side: -1 | 1;
  level: 0 | 1;
}

/**
 * Spread the modules over the whole window, nose to tail. One row while they fit, two when the row would get too
 * crowded; the columns share the window's length evenly (no end left empty) and each module takes the hull's height
 * where it sits, so the ones in the nose cone are smaller and nothing crosses the hull.
 */
export function layoutModules(ids: readonly PartId[]): Slot[] {
  const order = [...ids].sort((a, b) => ZONE[a] - ZONE[b]);
  const n = order.length;
  if (n === 0) return [];
  const rows = n > 6 ? 2 : 1;
  const cols = Math.ceil(n / rows);
  const pitch = (WIN_R - WIN_L) / cols;
  // a lone row of a few parts gets wide modules; a crowded one shares the length
  const w = Math.min(rows === 2 ? MOD_MAX_W * 0.8 : MOD_MAX_W, pitch - GAP);
  return order.map((id, i) => {
    const c = rows === 2 ? Math.floor(i / 2) : i;
    const r = rows === 2 ? i % 2 : 0;
    const x = WIN_R - (c + 1) * pitch + (pitch - w) / 2;
    const room = 2 * (Math.min(hull(x), hull(x + w)) - WALL - 4);
    const full = Math.max(14, Math.min(rows === 2 ? 2 * MOD_MAX_H : MOD_MAX_H, room));
    // a column of two splits the height; the last column of an odd count holds one module, centred
    const pair = rows === 2 && !(c === cols - 1 && n % 2 === 1);
    const h = pair ? (full - GAP) / 2 : Math.min(full, MOD_MAX_H);
    const y = pair ? CY - full / 2 + r * (h + GAP) : CY - h / 2;
    const side: -1 | 1 = rows === 2 ? (pair ? (r === 0 ? -1 : 1) : c % 2 === 0 ? -1 : 1) : c % 2 === 0 ? -1 : 1;
    const level = (rows === 2 ? c % 2 : Math.floor(c / 2) % 2) as 0 | 1;
    return { id, x, y, w, h, side, level };
  });
}

/** A module's icon, its leader line and its short name above or below the hull (the box is drawn in the window). */
function ModuleMarks({ s }: { s: Slot }) {
  const look = PART_LOOK[s.id];
  const icon = Math.min(20, s.h - 8, s.w - 10);
  const k = icon / 24;
  const cx = s.x + s.w / 2;
  const edge = s.side < 0 ? s.y : s.y + s.h;
  const ly = (s.side < 0 ? LABEL_Y.top : LABEL_Y.bottom)[s.level];
  const end = ly + (s.side < 0 ? 5 : -11);
  return (
    <g className="ldp-mod ldp-part">
      {icon >= 8 && (
        <path
          d={SD_ICON_PATHS[look.icon]}
          className="ldp-mod-icon"
          transform={`translate(${(cx - icon / 2).toFixed(1)} ${(s.y + s.h / 2 - icon / 2).toFixed(1)}) scale(${k.toFixed(3)})`}
        />
      )}
      <path d={`M${cx.toFixed(1)} ${edge.toFixed(1)} V${end}`} className="ldp-leader" />
      <circle cx={cx} cy={end} r="1.8" className="ldp-leader-dot" />
      <text x={cx} y={ly} className="ldp-mod-label" textAnchor="middle">
        {look.short}
      </text>
    </g>
  );
}

export function LiveDesignPreview({ packed, rocketName, weight, compact }: Props) {
  const uid = useId().replace(/:/g, '');
  const ids = useMemo(() => [...new Set(packed.map((p) => p.id))], [packed]);
  const added = ids.filter((id) => !ALWAYS.includes(id));
  const slots = useMemo(() => layoutModules(ids), [ids]);
  const outline = useMemo(() => hullPath(), []);
  const inner = useMemo(() => hullPath(WALL, WIN_L - 4, TIP - 16), []);
  const g = (n: string) => `${uid}-${n}`;
  return (
    <section className={`ldp${compact ? ' compact' : ''}`} aria-label={PREVIEW_WORDS.label}>
      <div className="ldp-head">
        <span className="pk-panel-title">{PREVIEW_WORDS.title}</span>
        <span className="pk-deck-sub">{PREVIEW_WORDS.sub}</span>
      </div>
      <div className="ldp-stage">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="ldp-svg" role="img" aria-label={PREVIEW_WORDS.parts(f.num(ids.length))}>
          <defs>
            <linearGradient id={g('hull')} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" className="ldp-st-edge" />
              <stop offset="0.3" className="ldp-st-hi" />
              <stop offset="0.62" className="ldp-st-mid" />
              <stop offset="1" className="ldp-st-shade" />
            </linearGradient>
            <linearGradient id={g('metal')} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" className="ldp-st-metal-d" />
              <stop offset="0.4" className="ldp-st-metal-l" />
              <stop offset="1" className="ldp-st-metal-d" />
            </linearGradient>
            <linearGradient id={g('gloss')} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" className="ldp-st-gloss" />
              <stop offset="0.55" className="ldp-st-clear" />
            </linearGradient>
            <radialGradient id={g('plume')} cx="1" cy="0.5" r="1">
              <stop offset="0" className="ldp-st-plume" />
              <stop offset="1" className="ldp-st-clear" />
            </radialGradient>
            <clipPath id={g('win')}>
              <path d={inner} />
            </clipPath>
          </defs>

          {/* Plume, engines and fins sit behind the hull */}
          <g className={`ldp-rocket ${weight}`}>
            <ellipse cx={TAIL - 44} cy={CY} rx="40" ry="22" fill={`url(#${g('plume')})`} className="ldp-plume" />
            {[-13, 13].map((dy) => (
              <path key={dy} d={`M${TAIL} ${CY + dy - 7} L${TAIL} ${CY + dy + 7} L${TAIL - 26} ${CY + dy + 12} L${TAIL - 26} ${CY + dy - 12} Z`} fill={`url(#${g('metal')})`} className="ldp-bell" />
            ))}
            <path d={`M${TAIL + 66} ${CY - CORE_R} L${TAIL - 6} ${CY - CORE_R - 24} L${TAIL + 4} ${CY - CORE_R} Z`} className="ldp-fin" />
            <path d={`M${TAIL + 66} ${CY + CORE_R} L${TAIL - 6} ${CY + CORE_R + 24} L${TAIL + 4} ${CY + CORE_R} Z`} className="ldp-fin" />
            {/* The hull: shaded like a cylinder lit from above */}
            <path d={outline} fill={`url(#${g('hull')})`} className="ldp-hull" />
            {/* Seams: interstage, payload adapter, fairing split */}
            <path d={`M${TAIL + 30} ${CY - CORE_R} V${CY + CORE_R} M${BOAT_L - 36} ${CY - CORE_R} V${CY + CORE_R} M${BOAT_R} ${CY - FAIRING_R} V${CY + FAIRING_R} M${SHOULDER} ${CY - FAIRING_R} V${CY + FAIRING_R}`} className="ldp-seam" />
          </g>

          {/* The cutaway window: a dark bay, frames and tank domes faintly behind the modules */}
          <path d={inner} className="ldp-bay" />
          <g clipPath={`url(#${g('win')})`}>
            <g className="ldp-structure" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <path key={i} d={`M${WIN_L + i * 30} ${CY - 50} V${CY + 50}`} />
              ))}
              <path d={`M${WIN_L - 10} ${CY} H${TIP}`} />
              <path d={`M${TAIL + 70} ${CY - 26} Q${TAIL + 48} ${CY} ${TAIL + 70} ${CY + 26} M${BOAT_L - 50} ${CY - 26} Q${BOAT_L - 28} ${CY} ${BOAT_L - 50} ${CY + 26}`} />
            </g>
            {slots.map((s) => (
              <g key={s.id} className="ldp-part">
                <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={Math.min(6, s.h / 4)} fill={PART_LOOK[s.id].color} className="ldp-mod-box" />
                <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={Math.min(6, s.h / 4)} fill={`url(#${g('gloss')})`} className="ldp-mod-gloss" />
              </g>
            ))}
          </g>
          <path d={inner} className="ldp-bay-rim" />
          {/* Icons, leaders and labels (labels sit above and below the hull, never clipped) */}
          {slots.map((s) => (
            <ModuleMarks key={s.id} s={s} />
          ))}
          <path d={outline} className={`ldp-outline ${weight}`} />
        </svg>
      </div>
      <div className="ldp-foot">
        <span className="sd-label">{PREVIEW_WORDS.parts(f.num(ids.length))}</span>
        {rocketName && <span className="sd-label dim">{PREVIEW_WORDS.on(rocketName)}</span>}
      </div>
      {added.length === 0 ? (
        <p className="ldp-empty">{PREVIEW_WORDS.empty}</p>
      ) : (
        <ul className="ldp-chips" aria-label={PREVIEW_WORDS.title}>
          {added.map((id) => (
            <li key={id} className="ldp-chip-item">
              <SDIcon icon={PART_LOOK[id].icon} size={14} color={PART_LOOK[id].color} />
              {PART_LOOK[id].name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
