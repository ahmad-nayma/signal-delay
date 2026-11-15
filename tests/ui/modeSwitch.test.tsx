// @vitest-environment jsdom
// Cadet → Engineer → Cadet on a level's Pack keeps the level: First Light (Moon 1) keeps its short teaching shelf
// instead of turning into a free build with every Moon part.
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../../src/ui/App';
import './setup';

function pass(ms: number, step = 50) {
  for (let t = 0; t < ms; t += step) act(() => vi.advanceTimersByTime(step));
}

const lever = () => screen.getByRole('switch', { name: 'Engineer mode' });

describe('mode switch on a level', () => {
  it('Engineer and back to Cadet keeps First Light and its shelf', () => {
    vi.useFakeTimers();
    localStorage.setItem('sd.seen', JSON.stringify(['name', 'brief:moon-1']));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^CHOOSE A MISSION/ }));
    fireEvent.click(screen.getByRole('button', { name: /^First Light/ }));
    pass(100);
    // Moon 1's shelf: no spectrometer, no heater
    expect(screen.queryByRole('button', { name: 'Pack Spectrometer' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Pack Heater pack' })).toBeNull();
    fireEvent.click(lever());
    pass(100);
    // the Engineer Build Bay's top bar: Cadet / Engineer
    fireEvent.click(within(screen.getByRole('group', { name: 'Mode' })).getByRole('button', { name: 'Cadet' }));
    pass(100);
    // still First Light: the same short shelf, not the free build's every part
    expect(screen.queryByRole('button', { name: 'Pack Spectrometer' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Pack Heater pack' })).toBeNull();
  });
});
