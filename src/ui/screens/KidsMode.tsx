// SPACE KIDS / PETIT ASTRONAUTE: Cadet's real loop for children of about four to ten, on the same engine (kids.ts).
// The robot says hello → pick the Moon or Mars (real NASA photos) → fill the rocket from four big parts (the real Pack
// nose; LIFT OFF waits for a science part, and the part the robot still needs shines) → the flight: the real Mission
// operations moved on a beat at a time, the rocket gliding from Earth to the destination, at most two danger cards
// as two big buttons (the robot answers any others), and at Mars one moment to pick places to photograph → a short
// report: at least one star, the pictures that came home, a part to try next time, and the real NASA facts.
// No gauge, no technical readout; this screen only formats the engine's numbers. Its state lives here alone.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  KIDS_DESTINATIONS,
  kidsAnswer,
  kidsDone,
  kidsFlightView,
  kidsLaunch,
  kidsPack,
  kidsPhotos,
  kidsPostcard,
  kidsReport,
  kidsShelf,
  kidsStep,
  kidsToggle,
  kidsTrip,
  type KidsDestination,
  type KidsFlight,
} from '../../engine/kids';
import type { PartId } from '../../engine/pack';
import { said } from '../cited';
import { SourceInfo } from '../components/SourceInfo';
import { targetSrc } from '../components/fly/Downlink';
import { postcardSrc } from '../components/sd/PostcardView';
import * as f from '../format';
import { BackButton } from '../components/sd/BackButton';
import { LangToggle } from '../components/sd/LangToggle';
import { SDIcon } from '../components/sd/SDIcon';
import { dangerLook, KIDS_WORDS, kidsFar, kidsHello, kidsMission, PART_LOOK, POSTCARD_WORDS, ROBOT_NAMES, targetName } from '../sdWords';
import { starterDesign, today } from '../starters';

type Phase = 'hello' | 'where' | 'pack' | 'fly' | 'report';

/** One beat of the flight (the engine moves the clock on by KIDS_RULES.step_days a beat). */
const BEAT_MS = 280;
/** How long a cheer shows; how long the end of the flight holds before the report. */
const CHEER_MS = 1300;
const LANDED_MS = 1400;
/** The three stars of a report (index only; how many shine is the engine's). */
const STAR_SLOTS = [0, 1, 2] as const;

/** The friendly robot (the game's character colour), its eyes blinking, a little hop when it cheers. */
function Mascot({ happy, name }: { happy: boolean; name: string }) {
  return (
    <div className={`kd-mascot${happy ? ' happy' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 120 130" className="kd-bot">
        <path d="M60 18 V6" className="kd-bot-line" />
        <circle cx="60" cy="6" r="6" className="kd-bot-light" />
        <rect x="14" y="18" width="92" height="70" rx="26" className="kd-bot-head" />
        <rect x="26" y="32" width="68" height="40" rx="18" className="kd-bot-face" />
        <g className="kd-bot-eyes">
          <circle cx="46" cy="50" r="7" />
          <circle cx="74" cy="50" r="7" />
        </g>
        <path d={happy ? 'M44 62 Q60 76 76 62' : 'M48 63 Q60 70 72 63'} className="kd-bot-smile" />
        <rect x="34" y="92" width="52" height="34" rx="14" className="kd-bot-head" />
        <circle cx="60" cy="108" r="6" className="kd-bot-light" />
      </svg>
      <span className="kd-name">{name}</span>
    </div>
  );
}

/** The rocket, nose up: the parts the child packed show in its round windows. */
function KidRocket({ parts, lit, small }: { parts: PartId[]; lit?: boolean; small?: boolean }) {
  return (
    <div className={`kd-rocket-box${small ? ' small' : ''}`}>
      <svg viewBox="0 -4 200 340" className={`kd-rocket${lit ? ' lit' : ''}`} role="img" aria-label={KIDS_WORDS.rocket}>
        <path d="M64 176 L26 246 L64 232 Z" className="kd-wing" />
        <path d="M136 176 L174 246 L136 232 Z" className="kd-wing" />
        <path d="M86 236 H114 L120 262 H80 Z" className="kd-nozzle" />
        <path d={`M84 264 Q100 ${lit ? 330 : 296} 116 264 Q100 280 84 264 Z`} className="kd-flame" />
        <rect x="58" y="96" width="84" height="144" rx="30" className="kd-body" />
        <path d="M58 212 H142" className="kd-band" />
        <path d="M58 112 Q100 0 142 112 Z" className="kd-cone" />
      </svg>
      {!small && (
        <ul className="kd-hold" aria-label={KIDS_WORDS.rocket}>
          {parts.map((id) => (
            <li key={id} className="kd-hold-part" title={KIDS_WORDS.parts[id]?.name ?? PART_LOOK[id].name}>
              <SDIcon icon={PART_LOOK[id].icon} size={26} color="var(--ds-primary)" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** A burst of stars (pure CSS, eight fixed directions). */
function Sparkles({ n }: { n: number }) {
  return (
    <div key={n} className="kd-sparkles" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className={`kd-spark s${i}`}>
          <SDIcon icon="star" size={22} color="var(--ds-accent-2)" fill />
        </span>
      ))}
    </div>
  );
}

/** The trip: Earth on one side, the destination's NASA photo on the other, the rocket gliding between them. */
function Trip({ dest, flight }: { dest: KidsDestination; flight: KidsFlight }) {
  const view = kidsFlightView(flight);
  return (
    <section className={`kd-stage kd-trip leg-${view.leg}`} style={{ '--kd-at': view.fraction } as CSSProperties} aria-label={KIDS_WORDS.progress}>
      <span className="kd-earth" aria-hidden="true" />
      <img className="kd-goal" src={postcardSrc(kidsPostcard(dest))} alt={KIDS_WORDS.places[dest]} />
      <span className="kd-path" aria-hidden="true">
        <span className="kd-path-fill" />
      </span>
      <span className="kd-ship" aria-hidden="true">
        <KidRocket parts={[]} lit small />
      </span>
    </section>
  );
}

/** After the flight: the real NASA photo of where the rocket flew, its caption, and the engine's true facts. */
function RealFacts({ dest, day }: { dest: KidsDestination; day: string }) {
  const trip = useMemo(() => kidsTrip(dest, day), [dest, day]);
  const card = trip.postcard;
  const title = said(card.title);
  const caption = said(card.caption.value);
  const dist = dest === 'moon' ? f.km(trip.distance_m) : f.millionKm(trip.distance_m);
  return (
    <figure className="kd-real">
      <span className="kd-real-k">{KIDS_WORDS.photo}</span>
      <img className="kd-real-img" src={postcardSrc(card)} alt={caption} />
      <figcaption className="kd-real-body">
        <span className="kd-real-title">{title}</span>
        <span className="kd-real-caption">
          {caption}
          <SourceInfo s={card.caption} title={title} />
        </span>
        <span className="kd-real-credit">{POSTCARD_WORDS.credit(card.credit)}</span>
      </figcaption>
      <div className="kd-facts">
        <span className="kd-real-k">{KIDS_WORDS.facts}</span>
        <ul>
          <li>
            <SDIcon icon="orbit" size={26} color="var(--ds-secondary)" />
            <span>
              {kidsFar(dest, dist)}
              <SourceInfo s={trip.distance} title={kidsFar(dest, dist)} />
            </span>
          </li>
          <li>
            <SDIcon icon="dish" size={26} color="var(--ds-secondary)" />
            <span>
              {kidsHello(f.durationWords(trip.lightTime_s).toLowerCase())}
              <SourceInfo s={trip.lightSpeed} title={KIDS_WORDS.facts} />
            </span>
          </li>
          {trip.mission && (
            <li>
              <SDIcon icon="star" size={26} color="var(--ds-accent-2)" fill />
              <span>
                {kidsMission(trip.mission.label, f.days(trip.mission.days))}
                <SourceInfo s={trip.mission.arrival} title={trip.mission.label} />
              </span>
            </li>
          )}
        </ul>
      </div>
    </figure>
  );
}

interface Props {
  /** Today (ISO date): Mars' real distance is today's. */
  today: string;
  /** The robot's name (empty: the first default name). */
  robotName?: string;
  /** A seed for each new flight (App: ?seed=N, or a new random one). */
  nextSeed: () => number;
  onHome: () => void;
  onBack?: () => void;
}

export function KidsMode({ today: day, robotName, nextSeed, onHome, onBack }: Props) {
  const name = robotName || ROBOT_NAMES[0]!;
  const [phase, setPhase] = useState<Phase>('hello');
  const [dest, setDest] = useState<KidsDestination>();
  const [parts, setParts] = useState<PartId[]>([]);
  const [flight, setFlight] = useState<KidsFlight>();
  const [snaps, setSnaps] = useState<string[]>([]);
  /** A short line from the robot (a cheer, a part's job) that shows for a moment. */
  const [note, setNote] = useState<{ text: string; cheer: boolean }>();
  const [bursts, setBursts] = useState(0);
  const noteTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(noteTimer.current), []);
  const say = (text: string, cheer = false) => {
    clearTimeout(noteTimer.current);
    setNote({ text, cheer });
    noteTimer.current = setTimeout(() => setNote(undefined), CHEER_MS);
  };
  const cheer = (i: number) => {
    setBursts((b) => b + 1);
    say(KIDS_WORDS.cheers[i % KIDS_WORDS.cheers.length]!, true);
  };

  const base = useMemo(() => (dest ? starterDesign(dest, today()) : undefined), [dest]);
  const pack = useMemo(() => (base ? kidsPack(base, parts) : undefined), [base, parts]);
  const shelf = dest ? kidsShelf(dest) : [];

  // The flight: one beat at a time while nothing waits for the child; the report opens a moment after the end.
  const done = flight ? kidsDone(flight) : false;
  const waiting = flight?.stop !== undefined;
  useEffect(() => {
    if (phase !== 'fly' || !flight || waiting) return;
    if (done) {
      const t = setTimeout(() => setPhase('report'), LANDED_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setFlight((fl) => (fl ? kidsStep(fl) : fl)), BEAT_MS);
    return () => clearTimeout(t);
  }, [phase, flight, waiting, done]);

  const report = useMemo(() => (phase === 'report' && flight ? kidsReport(flight) : undefined), [phase, flight]);

  const pickPlace = (d: KidsDestination, i: number) => {
    setDest(d);
    setParts([]);
    cheer(i);
    setPhase('pack');
  };
  const tapPart = (id: PartId) => {
    if (!base) return;
    const next = kidsToggle(base, parts, id);
    const added = next.parts.includes(id) && !parts.includes(id);
    setParts(next.parts);
    if (added) {
      setBursts((b) => b + 1);
      say(KIDS_WORDS.parts[id]?.says ?? PART_LOOK[id].name, true);
    } else say(KIDS_WORDS.out);
  };
  const liftOff = () => {
    if (!pack?.ready) return;
    setNote(undefined);
    setSnaps([]);
    setFlight(kidsLaunch(pack.design, nextSeed()));
    setPhase('fly');
  };
  const answer = (choice: 'safe' | 'brave') => {
    setFlight((fl) => (fl ? kidsAnswer(fl, choice) : fl));
    say(KIDS_WORDS.answered, true);
  };
  const tapSnap = (id: string, max: number) =>
    setSnaps((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < max ? [...s, id] : s));
  const takePictures = () => {
    setFlight((fl) => (fl ? kidsPhotos(fl, snaps) : fl));
    cheer(snaps.length);
  };
  const again = () => {
    setFlight(undefined);
    setNote(undefined);
    setPhase('pack');
  };
  const goBack = () => {
    if (phase === 'pack') setPhase('where');
    else if (phase === 'fly') again();
    else if (phase === 'report') onHome();
    else onBack?.();
  };

  const stop = phase === 'fly' ? flight?.stop : undefined;
  const leg = flight ? kidsFlightView(flight).leg : 'launch';
  const line: string[] = note
    ? [note.text]
    : phase === 'hello'
      ? [KIDS_WORDS.hello, KIDS_WORDS.helpMe]
      : phase === 'where'
        ? [KIDS_WORDS.where]
        : phase === 'pack'
          ? [pack?.ready ? KIDS_WORDS.ready : parts.length ? KIDS_WORDS.need : KIDS_WORDS.pack]
          : phase === 'fly'
            ? stop?.kind === 'card'
              ? [KIDS_WORDS.dangers[stop.hazardType] ?? KIDS_WORDS.danger]
              : stop?.kind === 'photos'
                ? [KIDS_WORDS.photos]
                : [leg === 'launch' || leg === 'cruise' ? KIDS_WORDS.flyingTo[dest ?? 'moon'] : KIDS_WORDS.legs[leg]]
            : [report?.lost ? KIDS_WORDS.lost : KIDS_WORDS.good];
  const happy = !!note || phase === 'hello' || (phase === 'report' && !report?.lost) || (phase === 'fly' && !stop);

  return (
    <div className={`sd kd kd-${phase}`}>
      <header className="kd-top">
        {onBack ? <BackButton onBack={goBack} /> : <span />}
        <h1 className="kd-title">
          <SDIcon icon="star" size={26} color="var(--ds-accent-2)" fill />
          {KIDS_WORDS.title}
        </h1>
        <LangToggle />
      </header>

      <main className="kd-main">
        {phase === 'fly' && dest && flight ? (
          <Trip dest={dest} flight={flight} />
        ) : phase === 'report' && dest ? (
          <section className="kd-stage kd-report-stage">
            <img className="kd-arrive" src={postcardSrc(kidsPostcard(dest))} alt="" />
            <div className="kd-stars" role="img" aria-label={KIDS_WORDS.stars}>
              {STAR_SLOTS.map((i) => (
                <span key={i} className={`kd-star-slot${report && i < report.stars ? ' on' : ''}`}>
                  <SDIcon icon="star" size={64} color="var(--ds-accent-2)" fill={!!report && i < report.stars} />
                </span>
              ))}
            </div>
          </section>
        ) : (
          <section className="kd-stage">
            <KidRocket parts={pack?.parts ?? []} />
            {bursts > 0 && <Sparkles n={bursts} />}
          </section>
        )}

        <section className="kd-story">
          <div className="kd-talk">
            <Mascot happy={happy} name={name} />
            <div className={`kd-bubble${note?.cheer ? ' cheer' : ''}${stop?.kind === 'card' ? ' alert' : ''}`} role="status" aria-live="polite">
              {line.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>

          {phase === 'hello' && (
            <button type="button" className="kd-big" onClick={() => setPhase('where')}>
              <SDIcon icon="play" size={30} color="currentColor" fill />
              {KIDS_WORDS.start}
            </button>
          )}

          {phase === 'where' && (
            <div className="kd-choices two" role="group" aria-label={KIDS_WORDS.where}>
              {KIDS_DESTINATIONS.map((d, i) => (
                <button key={d} type="button" className={`kd-choice photo${dest === d ? ' on' : ''}`} onClick={() => pickPlace(d, i)} aria-label={KIDS_WORDS.places[d]}>
                  <img className="kd-choice-photo" src={postcardSrc(kidsPostcard(d))} alt="" />
                  <span className="kd-choice-name">{KIDS_WORDS.places[d]}</span>
                </button>
              ))}
            </div>
          )}

          {phase === 'pack' && pack && (
            <>
              <div className="kd-choices four" role="group" aria-label={KIDS_WORDS.pack}>
                {shelf.map((id) => {
                  const on = pack.parts.includes(id);
                  const label = KIDS_WORDS.parts[id]?.name ?? PART_LOOK[id].name;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`kd-choice part${on ? ' on' : ''}${pack.need === id ? ' need' : ''}`}
                      onClick={() => tapPart(id)}
                      aria-pressed={on}
                      aria-label={label}
                    >
                      <span className="kd-part-pic">
                        <SDIcon icon={PART_LOOK[id].icon} size={56} color="currentColor" />
                        {on && (
                          <span className="kd-part-tick">
                            <SDIcon icon="check" size={22} color="var(--ds-primary)" />
                          </span>
                        )}
                      </span>
                      <span className="kd-choice-name">{label}</span>
                    </button>
                  );
                })}
              </div>
              <button type="button" className="kd-big kd-launch" onClick={liftOff} disabled={!pack.ready}>
                <SDIcon icon="burn" size={34} color="currentColor" />
                {KIDS_WORDS.launch}
              </button>
            </>
          )}

          {stop?.kind === 'card' && (
            <div className="kd-card" role="group" aria-label={KIDS_WORDS.dangers[stop.hazardType] ?? KIDS_WORDS.danger}>
              <span className="kd-card-pic" aria-hidden="true">
                <SDIcon icon={dangerLook(stop.hazardType, stop.hazardType).icon} size={72} color="var(--ds-accent-2)" />
              </span>
              <div className="kd-card-keys">
                <button type="button" className="kd-big kd-safe" onClick={() => answer('safe')}>
                  <SDIcon icon="shield" size={30} color="currentColor" />
                  {KIDS_WORDS.careful}
                </button>
                {stop.brave && (
                  <button type="button" className="kd-big ghost" onClick={() => answer('brave')}>
                    <SDIcon icon="play" size={30} color="currentColor" fill />
                    {KIDS_WORDS.brave}
                  </button>
                )}
              </div>
            </div>
          )}

          {stop?.kind === 'photos' && (
            <>
              <div className="kd-choices snaps" role="group" aria-label={KIDS_WORDS.photos}>
                {stop.targets.map((id) => (
                  <button key={id} type="button" className={`kd-choice photo snap${snaps.includes(id) ? ' on' : ''}`} onClick={() => tapSnap(id, stop.max)} aria-pressed={snaps.includes(id)} aria-label={targetName(id)}>
                    <img className="kd-choice-photo" src={targetSrc(id)} alt="" loading="lazy" />
                    <span className="kd-choice-name">{targetName(id)}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="kd-big" onClick={takePictures} disabled={snaps.length === 0}>
                <SDIcon icon="camera" size={30} color="currentColor" />
                {KIDS_WORDS.snap}
              </button>
            </>
          )}

          {phase === 'report' && report && dest && (
            <>
              {report.photosHome.length > 0 && (
                <div className="kd-album">
                  <span className="kd-real-k">{KIDS_WORDS.myPhotos}</span>
                  <ul>
                    {report.photosHome.map((id) => (
                      <li key={id}>
                        <img src={targetSrc(id)} alt={targetName(id)} />
                        <span>{targetName(id)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.hint && (
                <div className="kd-hint">
                  <span>{KIDS_WORDS.nextTime}</span>
                  <span className="kd-hint-part">
                    <SDIcon icon={PART_LOOK[report.hint].icon} size={34} color="var(--ds-primary)" />
                    {KIDS_WORDS.parts[report.hint]?.name ?? PART_LOOK[report.hint].name}
                  </span>
                </div>
              )}
              <RealFacts dest={dest} day={day} />
              <div className="kd-end">
                <button type="button" className="kd-big" onClick={again}>
                  {KIDS_WORDS.again}
                </button>
                <button type="button" className="kd-big ghost" onClick={onHome}>
                  {KIDS_WORDS.home}
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
