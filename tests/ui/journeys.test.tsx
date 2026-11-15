// @vitest-environment jsdom
// Player journeys, end to end, after the audio was removed: every main flow runs without a crash, without an error in
// the console, and without ever touching an audio API. Each journey watches AudioContext, webkitAudioContext and
// HTMLMediaElement.play: none may be called.
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/ui/App';
import { setLang } from '../../src/ui/i18n';
import { COLD_OPEN, FINISH_CONFIRM, HOME_WORDS, NAV, PREVIEW_WORDS, SIDE_TABS } from '../../src/ui/sdWords';
import { pickObjective } from './setup';

function pass(ms: number, step = 50) {
  for (let t = 0; t < ms; t += step) act(() => vi.advanceTimersByTime(step));
}

let audio: { ctx: ReturnType<typeof vi.fn>; webkit: ReturnType<typeof vi.fn>; play: { mock: { calls: unknown[] } } };
let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  audio = { ctx: vi.fn(), webkit: vi.fn(), play };
  vi.stubGlobal('AudioContext', audio.ctx);
  vi.stubGlobal('webkitAudioContext', audio.webkit);
  consoleError = vi.spyOn(console, 'error');
});

afterEach(() => {
  // no journey may reach for sound, nor log an error
  expect(audio.ctx).not.toHaveBeenCalled();
  expect(audio.webkit).not.toHaveBeenCalled();
  expect(audio.play.mock.calls).toEqual([]);
  expect(document.querySelector('audio, video')).toBeNull();
  expect(consoleError).not.toHaveBeenCalled();
  vi.restoreAllMocks();
});

/** No sound key anywhere on screen. */
const noSoundKey = () => expect(screen.queryByRole('button', { name: /^Sound (on|off)$/ })).toBeNull();

/** Home → mission map → Red Planet → Pack (objective picked). */
function openMars() {
  localStorage.setItem('sd.seen', JSON.stringify(['name', 'brief:mars', 'coach', 'launch:mars']));
  localStorage.setItem('mdt.progress', JSON.stringify({ 'moon-1': 1, 'moon-2': 1, 'moon-3': 1 }));
  render(<App />);
  noSoundKey();
  fireEvent.click(screen.getByRole('button', { name: 'CHOOSE A MISSION ▸' }));
  fireEvent.click(screen.getByRole('button', { name: /^Red Planet/ }));
  pass(100);
  pickObjective();
}

/** Arm, launch, finish the mission and open the report. */
function flyToReport() {
  fireEvent.click(screen.getByRole('switch', { name: 'Arm' }));
  fireEvent.click(screen.getByRole('button', { name: 'LAUNCH' }));
  pass(100);
  noSoundKey();
  fireEvent.click(screen.getByRole('button', { name: NAV.finish }));
  fireEvent.click(within(screen.getByRole('dialog', { name: FINISH_CONFIRM.title })).getByRole('button', { name: FINISH_CONFIRM.yes }));
  fireEvent.click(screen.getByRole('button', { name: 'SEE MISSION REPORT ▸' }));
}

describe('player journeys with no audio', () => {
  it('a brand-new player: the cold open starts at once (no tap gate), then Name Your Robot, then Home', () => {
    vi.useFakeTimers();
    localStorage.removeItem('sd.seen');
    render(<App />);
    expect(screen.getByRole('main', { name: COLD_OPEN.label }).getAttribute('data-beat')).toBe('burn');
    noSoundKey();
    pass(17_000, 33);
    fireEvent.click(screen.getByRole('button', { name: /^SKIP · CALL IT/ }));
    expect(screen.getByRole('button', { name: /^Play: mission/ })).toBeTruthy();
  });

  it('Cadet: pack Mars with the live preview, check the danger deck tab, launch, fly to the end, read the report', () => {
    vi.useFakeTimers();
    openMars();
    const preview = within(screen.getByRole('region', { name: PREVIEW_WORDS.label }));
    const before = preview.getAllByRole('listitem').length;
    fireEvent.click(screen.getByRole('button', { name: 'Pack Big battery' }));
    expect(preview.getAllByRole('listitem').length).toBe(before + 1);
    fireEvent.click(screen.getByRole('tab', { name: SIDE_TABS.dangers }));
    expect(screen.getByRole('list', { name: 'Danger deck' })).toBeTruthy();
    flyToReport();
    expect(screen.getByRole('heading', { name: 'MISSION REPORT' })).toBeTruthy();
    noSoundKey();
  });

  it('a danger card can be answered mid-flight', () => {
    vi.useFakeTimers();
    window.history.replaceState({}, '', '/?seed=2013'); // the README's seed: a solar storm comes early
    openMars();
    fireEvent.click(screen.getByRole('switch', { name: 'Arm' }));
    fireEvent.click(screen.getByRole('button', { name: 'LAUNCH' }));
    pass(100);
    // jump event to event; an eclipse "plan ahead" card or a result is answered on the way
    for (let i = 0; i < 80 && !screen.queryByRole('dialog', { name: /DANGER CARD/ }); i++) {
      const plan = screen.queryByRole('dialog', { name: /PLAN AHEAD/ });
      const cont = screen.queryByRole('button', { name: 'CONTINUE ▸' });
      const next = screen.queryByRole('button', { name: 'Next event' });
      if (plan) fireEvent.click(plan.querySelector<HTMLButtonElement>('.dc-choice:not([disabled])')!);
      else if (cont) fireEvent.click(cont);
      else if (next) fireEvent.click(next);
      pass(300);
    }
    const card = screen.getByRole('dialog', { name: /DANGER CARD/ });
    const choice = card.querySelector<HTMLButtonElement>('.dc-choice:not([disabled])');
    expect(choice).toBeTruthy();
    fireEvent.click(choice!);
    pass(500);
    expect(screen.queryByRole('dialog', { name: /DANGER CARD/ })).toBeNull();
    window.history.replaceState({}, '', '/');
  });

  it('the same flight in French, from Pack to the report', () => {
    vi.useFakeTimers();
    setLang('fr');
    localStorage.setItem('sd.seen', JSON.stringify(['name', 'brief:mars', 'coach', 'launch:mars']));
    localStorage.setItem('mdt.progress', JSON.stringify({ 'moon-1': 1, 'moon-2': 1, 'moon-3': 1 }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'CHOISIR UNE MISSION ▸' }));
    fireEvent.click(screen.getByRole('button', { name: /^Planète rouge/ }));
    pass(100);
    fireEvent.click(document.querySelector<HTMLButtonElement>('.sd-brief-objcard')!);
    fireEvent.click(document.querySelector<HTMLButtonElement>('.sd-brief-foot .sd-cta')!);
    fireEvent.click(screen.getByRole('switch', { name: 'Armer' }));
    fireEvent.click(screen.getByRole('button', { name: 'LANCEMENT' }));
    pass(100);
    fireEvent.click(screen.getByRole('button', { name: NAV.finish }));
    fireEvent.click(within(screen.getByRole('dialog', { name: FINISH_CONFIRM.title })).getByRole('button', { name: FINISH_CONFIRM.yes }));
    fireEvent.click(screen.getByRole('button', { name: 'VOIR LE RAPPORT DE MISSION ▸' }));
    expect(screen.getByRole('heading', { name: 'RAPPORT DE MISSION' })).toBeTruthy();
  });

  it('Home’s other doors open and come back: Daily, Rescue History, Postcards, Team, How to play, About', () => {
    vi.useFakeTimers();
    localStorage.setItem('sd.seen', JSON.stringify(['name', 'coach']));
    render(<App />);
    const home = () => screen.getByRole('button', { name: /^Play: mission/ });
    for (const name of [new RegExp(`^${HOME_WORDS.rescue}`), /^POSTCARDS/, /^TEAM/]) {
      fireEvent.click(screen.getAllByRole('button', { name })[0]!);
      pass(100);
      fireEvent.click(screen.getAllByRole('button', { name: 'Back' })[0]!);
      pass(100);
      expect(home()).toBeTruthy();
    }
    fireEvent.click(screen.getAllByRole('button', { name: /HOW TO PLAY/ })[0]!);
    expect(screen.getByRole('dialog', { name: 'HOW TO PLAY' })).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getAllByRole('button', { name: /ABOUT/ })[0]!);
    expect(screen.getByRole('dialog', { name: 'ABOUT THIS PROJECT' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'CLOSE' }));
    expect(home()).toBeTruthy();
  });

  it('the Daily mission flies to its share card', async () => {
    vi.useFakeTimers();
    localStorage.setItem('sd.seen', JSON.stringify(['name', 'coach', 'launch:daily']));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^DAILY MISSION/ }));
    // the Daily first reads the space-weather snapshot (offline in tests): let that promise settle
    for (let i = 0; i < 5; i++) await act(async () => { await Promise.resolve(); });
    pass(200);
    fireEvent.click(screen.getByRole('button', { name: NAV.finish }));
    fireEvent.click(within(screen.getByRole('dialog', { name: FINISH_CONFIRM.title })).getByRole('button', { name: FINISH_CONFIRM.yes }));
    fireEvent.click(screen.getByRole('button', { name: 'SEE MISSION REPORT ▸' }));
    expect(screen.getAllByText(/DAILY #/).length).toBeGreaterThan(0);
  });
});
