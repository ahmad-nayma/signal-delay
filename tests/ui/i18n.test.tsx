// @vitest-environment jsdom
// EN / FR (src/ui/i18n.ts; French in sdWords.fr.ts and opsWords.fr.ts): the French files have exactly the English
// exports, every word function follows the language, the switch is saved and switching back restores the English.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { App } from '../../src/ui/App';
import { CITED_FR } from '../../src/ui/cited.fr';
import * as f from '../../src/ui/format';
import { lang, setLang } from '../../src/ui/i18n';
import { LIVE } from '../../src/ui/i18n/live';
import * as OPS_EN from '../../src/ui/opsWords';
import * as OPS_FR from '../../src/ui/opsWords.fr';
import * as SD_EN from '../../src/ui/sdWords';
import { ABOUT_WORDS, endsInWords, HOME_WORDS, NAV } from '../../src/ui/sdWords';
import * as SD_FR from '../../src/ui/sdWords.fr';
import './setup';

const PAIRS = [
  ['sdWords', SD_EN, SD_FR],
  ['opsWords', OPS_EN, OPS_FR],
] as const;

/** Every path in a table, with the kind of value found there. */
function shape(v: unknown, path = ''): string[] {
  if (Array.isArray(v)) return [`${path}[${v.length}]`, ...v.flatMap((x, i) => shape(x, `${path}.${i}`))];
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => shape(x, `${path}.${k}`));
  return [`${path}:${typeof v}`];
}

/** Every string in a table, however deep. */
function strings(v: unknown): string[] {
  if (typeof v === 'string') return [v];
  if (v && typeof v === 'object') return Object.values(v).flatMap(strings);
  return [];
}

describe('French words', () => {
  it.each(PAIRS)('%s.fr has the same exports, tables and kinds as the English', (_name, en, fr) => {
    expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort());
    for (const k of Object.keys(en)) expect(shape((fr as Record<string, unknown>)[k]), k).toEqual(shape((en as Record<string, unknown>)[k]));
  });

  it.each(PAIRS)('every word function of %s follows the language', (_name, en) => {
    for (const [k, v] of Object.entries(en)) if (typeof v === 'function') expect((v as { [LIVE]?: string })[LIVE], k).toBe(k);
  });

  it('almost every English word has a French version', () => {
    const en = PAIRS.flatMap(([, e]) => strings(Object.values(e)));
    const fr = PAIRS.flatMap(([, , x]) => strings(Object.values(x)));
    const same = en.filter((s, i) => s === fr[i] && /[a-z]{3}/i.test(s) && !s.startsWith('var(')).length;
    // left as they are: icon names, robot names, NASA and mission names, codes
    expect(same / en.length).toBeLessThan(0.12);
  });

  it('switching writes the French into the tables, functions and formats, and switching back restores the English', () => {
    const play = HOME_WORDS.play;
    const back = NAV.back;
    setLang('fr');
    expect(lang()).toBe('fr');
    expect(HOME_WORDS.play).toBe('JOUER');
    expect(endsInWords(3)).toContain('JOURS');
    expect(f.days(2)).toBe('2 jours');
    expect(f.num(1234.5, 1)).toMatch(/1\s234,5/);
    setLang('en');
    expect(HOME_WORDS.play).toBe(play);
    expect(NAV.back).toBe(back);
    expect(endsInWords(3)).toContain('DAYS');
    expect(f.num(1234.5, 1)).toBe('1,234.5');
  });
});

describe('French cited texts', () => {
  it('every English key is still a text in src/data (a changed text would silently show in English)', () => {
    const dir = join(__dirname, '../../src/data');
    const texts = new Set(readdirSync(dir).filter((n) => n.endsWith('.json')).flatMap((n) => strings(JSON.parse(readFileSync(join(dir, n), 'utf8')))));
    for (const en of Object.keys(CITED_FR)) expect(texts.has(en), en).toBe(true);
  });
});

describe('the language switch', () => {
  it('turns Home into French and back; the choice is saved', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /^Language:/ })[0]!);
    expect(document.documentElement.lang).toBe('fr');
    expect(screen.getByText('JOUER')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('sd.lang')!)).toEqual({ lang: 'fr' });
    fireEvent.click(screen.getAllByRole('button', { name: /^Langue:/ })[0]!);
    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByText(HOME_WORDS.play)).toBeTruthy();
  });
});

describe('ABOUT', () => {
  it('opens a panel with the description, the team and the repository link; CLOSE shuts it', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: new RegExp(ABOUT_WORDS.menu) })[0]!);
    const dialog = screen.getByRole('dialog', { name: ABOUT_WORDS.title });
    expect(dialog.textContent).toContain(ABOUT_WORDS.description);
    expect(screen.getByRole('link', { name: new RegExp(ABOUT_WORDS.repoLink) }).getAttribute('href')).toMatch(/^https:\/\/github\.com\//);
    fireEvent.click(screen.getByRole('button', { name: ABOUT_WORDS.close }));
    expect(screen.queryByRole('dialog', { name: ABOUT_WORDS.title })).toBeNull();
  });
});
