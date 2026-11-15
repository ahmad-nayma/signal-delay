// @vitest-environment jsdom
// HOME and the DAILY share card (Signal Delay screens 04–05): counts, grid and streak are engine output.
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { dailyDate, dailyGrid, dailyNumber, dailyStreak } from '../../src/engine/daily';
import { marsNow } from '../../src/engine/marsNow';
import { presetDesign } from '../../src/engine/missions';
import { runOperations } from '../../src/engine/ops/index';
import { App } from '../../src/ui/App';
import * as f from '../../src/ui/format';
import { Daily, shareText } from '../../src/ui/screens/Daily';
import { DAILY_SCIENCE, LIVE_WEATHER } from '../../src/ui/sdWords';
import './setup';

describe('Home', () => {
  it('opens in Cadet mode with PLAY on the next open level and the engine’s counts on the keys', () => {
    localStorage.setItem('mdt.progress', JSON.stringify({ 'moon-1': 1, 'rescue-mco': 2 }));
    render(<App />);
    expect(screen.getByRole('button', { name: `Play: mission ${f.num(2)}, Heavy Lifting` })).toBeTruthy();
    expect(screen.getByText(`${f.num(1)} OF ${f.num(1)}`)).toBeTruthy(); // rescues solved
    expect(screen.queryByRole('button', { name: /^NOTEBOOK/ })).toBeNull(); // the Notebook was removed
    expect(screen.getByText('NEW TODAY')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: `Play: mission ${f.num(2)}, Heavy Lifting` }));
    expect(screen.getByRole('group', { name: /Nose:/ })).toBeTruthy();
  });

  it('MARS RIGHT NOW shows today’s distance, light time and next conjunction from the engine', () => {
    render(<App />);
    const m = marsNow(dailyDate(Date.now()));
    const plate = screen.getByRole('region', { name: 'Mars right now' });
    expect(within(plate).getByText(f.millionKm(m.distance_m))).toBeTruthy();
    expect(within(plate).getByText(f.lightTime(m.lightTime_s))).toBeTruthy();
    if (m.conjunction.now) expect(within(plate).getByText(/SOLAR CONJUNCTION NOW/)).toBeTruthy();
    else {
      expect(within(plate).getByText(f.isoDate(m.conjunction.closestDate))).toBeTruthy();
      expect(within(plate).getByText(f.days(m.conjunction.inDays))).toBeTruthy();
    }
  });

});

describe('Daily share card', () => {
  const s = runOperations(presetDesign('maven'), { seed: 2013, policy: 'safe', extension: 'end' }).state;
  const g = dailyGrid(s);

  it('one row per danger with its result, the streak, and the share text with no choices in it', () => {
    vi.useFakeTimers();
    const played = ['2026-11-09', '2026-11-10'];
    render(<Daily number={dailyNumber('2026-11-10')} date="2026-11-10" grid={g} played={played} mode="cadet" onMode={vi.fn()} onHome={vi.fn()} />);
    expect(within(screen.getByRole('list', { name: 'How each danger went' })).getAllByRole('listitem').length).toBe(g.rows.length);
    expect(screen.getByText(`STREAK ${f.num(dailyStreak(played, '2026-11-10'))}`)).toBeTruthy();
    const text = shareText(dailyNumber('2026-11-10'), g);
    expect(text).toContain(`DAILY #${f.num(dailyNumber('2026-11-10'))}`);
    expect(text).not.toMatch(/SHIELD|KEEP|WAIT|CLIMB/); // no spoilers: never what was picked
    // Science returned is the main score (v0.8): on the card and in the share text.
    expect(g.science).toBeDefined();
    expect(text).toContain(DAILY_SCIENCE.share(f.pct(g.science!, 0)));
    expect(screen.getByText(DAILY_SCIENCE.card(f.pct(g.science!, 0)))).toBeTruthy();
    expect(screen.getByText(/NEXT DAILY IN/)).toBeTruthy();
  });

  it('offline weather says so on the card and in the share text', () => {
    const off = { ...g, weather: 'offline' as const };
    render(<Daily number={dailyNumber('2026-11-10')} date="2026-11-10" grid={off} played={[]} mode="cadet" onMode={vi.fn()} onHome={vi.fn()} />);
    expect(screen.getAllByText(LIVE_WEATHER.offline).length).toBeGreaterThan(0);
    expect(shareText(dailyNumber('2026-11-10'), off)).toContain(LIVE_WEATHER.shareOffline);
  });

  it('live weather: the card says LIVE SUN, and a real storm’s row carries its real date', () => {
    const live = { ...g, weather: 'live' as const, rows: [{ type: 'solar-storm', day: 120, result: 'held' as const, realDate: '2030-01-03' }] };
    render(<Daily number={dailyNumber('2026-11-10')} date="2026-11-10" grid={live} played={[]} mode="cadet" onMode={vi.fn()} onHome={vi.fn()} />);
    expect(screen.getAllByText(LIVE_WEATHER.live).length).toBeGreaterThan(0);
    const row = within(screen.getByRole('list', { name: 'How each danger went' })).getByRole('listitem');
    expect(row.getAttribute('aria-label')).toContain(f.isoDate('2030-01-03'));
    expect(within(row).getByText(LIVE_WEATHER.realOn)).toBeTruthy();
    const text = shareText(dailyNumber('2026-11-10'), live);
    expect(text).toContain(LIVE_WEATHER.shareLive);
  });

  it('an old save with no weather shows neither label', () => {
    render(<Daily number={dailyNumber('2026-11-10')} date="2026-11-10" grid={g} played={[]} mode="cadet" onMode={vi.fn()} onHome={vi.fn()} />);
    expect(screen.queryByText(LIVE_WEATHER.live)).toBeNull();
    expect(screen.queryByText(LIVE_WEATHER.offline)).toBeNull();
  });
});
