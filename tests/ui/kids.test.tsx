// @vitest-environment jsdom
// SPACE KIDS / PETIT ASTRONAUTE (screens/KidsMode.tsx): the key beside the Cadet / Engineer lever opens Cadet's loop
// made simple: pick the Moon or Mars, fill the rocket from four big parts (LIFT OFF waits for a science part), fly the
// real Mission operations (at most two danger cards, at Mars a moment to pick pictures), then a short report with at
// least one star. No gauge, no number, no engine readout on the way, and Cadet / Engineer stay as they were.
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/ui/App';
import { KidsMode } from '../../src/ui/screens/KidsMode';
import { setLang } from '../../src/ui/i18n';
import { dailyDate } from '../../src/engine/daily';
import { kidsTrip } from '../../src/engine/kids';
import * as f from '../../src/ui/format';
import { KIDS_WORDS, kidsFar, kidsMission, MODE_WORDS } from '../../src/ui/sdWords';
import './setup';

const pass = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

/** Let the flight run, answering every danger card with BE CAREFUL and picking the first place to photograph. */
function flyToReport() {
  for (let i = 0; i < 600; i++) {
    if (screen.queryByRole('button', { name: KIDS_WORDS.again })) return;
    const careful = screen.queryByRole('button', { name: KIDS_WORDS.careful });
    if (careful) fireEvent.click(careful);
    const snaps = screen.queryByRole('group', { name: KIDS_WORDS.photos });
    if (snaps) {
      fireEvent.click(snaps.querySelector('button')!);
      fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.snap }));
    }
    pass(300);
  }
  throw new Error('the kids flight did not reach the report');
}

afterEach(() => {
  vi.useRealTimers();
  setLang('en');
});

describe('Space Kids', () => {
  it('Home → hello → the Moon → pack (the camera shines until packed) → fly → a report with stars and true facts', () => {
    vi.useFakeTimers();
    render(<App />);
    expect(screen.getByRole('switch', { name: 'Engineer mode' }).getAttribute('aria-checked')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: MODE_WORDS.kidsLabel }));

    expect(screen.getByText(KIDS_WORDS.hello)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.start }));
    expect(screen.getByText(KIDS_WORDS.where)).toBeTruthy();
    expect(screen.getByRole('button', { name: KIDS_WORDS.places.mars })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.places.moon }));

    // four big parts; nothing packed yet, so LIFT OFF waits
    const shelf = screen.getByRole('group', { name: KIDS_WORDS.pack });
    expect(shelf.querySelectorAll('button')).toHaveLength(4);
    const liftOff = () => screen.getByRole('button', { name: KIDS_WORDS.launch }) as HTMLButtonElement;
    expect(liftOff().disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.parts.battery!.name }));
    expect(screen.getByText(KIDS_WORDS.parts.battery!.says)).toBeTruthy();
    pass(1500);
    // a battery is not science: the robot asks for the shining part, the camera
    expect(screen.getByText(KIDS_WORDS.need)).toBeTruthy();
    const camera = screen.getByRole('button', { name: KIDS_WORDS.parts.camera!.name });
    expect(camera.className).toContain('need');
    expect(liftOff().disabled).toBe(true);
    fireEvent.click(camera);
    expect(camera.getAttribute('aria-pressed')).toBe('true');
    expect(liftOff().disabled).toBe(false);
    fireEvent.click(liftOff());

    // the flight: the trip and the robot's line; no gauge or technical readout
    expect(screen.getByRole('region', { name: KIDS_WORDS.progress })).toBeTruthy();
    expect(screen.queryByRole('meter')).toBeNull();
    flyToReport();

    // the report: stars, the robot's line, the real NASA facts
    expect(screen.getByRole('img', { name: KIDS_WORDS.stars }).querySelectorAll('.kd-star-slot.on').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(KIDS_WORDS.good) ?? screen.queryByText(KIDS_WORDS.lost)).toBeTruthy();
    const trip = kidsTrip('moon', dailyDate(Date.now()));
    expect(screen.getByText(kidsFar('moon', f.km(trip.distance_m)))).toBeTruthy();
    expect(screen.getByText(KIDS_WORDS.photo)).toBeTruthy();
    expect(screen.queryByRole('meter')).toBeNull();
    expect(screen.queryByText(/kg|Δv|m\/s|\bW\b|\$M/)).toBeNull();

    // FLY AGAIN goes back to the rocket, still packed
    fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.again }));
    expect(screen.getByRole('button', { name: KIDS_WORDS.parts.camera!.name }).getAttribute('aria-pressed')).toBe('true');
    expect(liftOff().disabled).toBe(false);
  });

  it('Mars: the robot asks what to photograph, and the picture comes home in MY PICTURES; MAVEN’s real trip', () => {
    vi.useFakeTimers();
    const onHome = vi.fn();
    render(<KidsMode today={dailyDate(Date.now())} nextSeed={() => 2} onHome={onHome} onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.start }));
    fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.places.mars }));
    for (const id of ['camera', 'solar', 'battery', 'shield']) fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.parts[id]!.name }));
    fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.launch }));
    let asked = false;
    for (let i = 0; i < 600 && !asked; i++) {
      const careful = screen.queryByRole('button', { name: KIDS_WORDS.careful });
      if (careful) fireEvent.click(careful);
      asked = screen.queryByRole('group', { name: KIDS_WORDS.photos }) !== null;
      if (!asked) pass(300);
    }
    expect(asked).toBe(true);
    // TAKE PICTURES waits for a pick
    expect((screen.getByRole('button', { name: KIDS_WORDS.snap }) as HTMLButtonElement).disabled).toBe(true);
    flyToReport();
    expect(screen.getByText(KIDS_WORDS.myPhotos)).toBeTruthy();
    const trip = kidsTrip('mars', dailyDate(Date.now()));
    expect(screen.getByText(kidsMission('MAVEN', f.days(trip.mission!.days)))).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: KIDS_WORDS.home }));
    expect(onHome).toHaveBeenCalled();
  });

  it('speaks French: PETIT ASTRONAUTE, the robot’s first line and the places', () => {
    setLang('fr');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: MODE_WORDS.kidsLabel }));
    expect(MODE_WORDS.kids).toBe('PETIT ASTRONAUTE');
    expect(screen.getByText('Salut ! Je suis un robot de l’espace.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'C’EST PARTI !' }));
    expect(screen.getByRole('button', { name: 'La Lune' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Mars' }));
    expect(screen.getByRole('button', { name: 'Appareil photo' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'DÉCOLLAGE !' })).toBeTruthy();
  });
});
