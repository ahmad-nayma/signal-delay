// The design system (theme.css) and the removal of audio, checked on the sources themselves:
// - the nine design-system colours are defined exactly, and the roles point at them (grounds, text, interactive, CTA);
// - Space Grotesk, Orbitron (technical titles) and JetBrains Mono (readouts) are the type families, loaded by index.html;
// - container shadows stay between 10 % and 20 % opacity; the active / interactive glow is neon cyan #00D2FF;
// - no audio API, audio element, sound module or audio file is left anywhere in the app.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('..', import.meta.url));
const theme = readFileSync(join(root, 'src/ui/styles/theme.css'), 'utf8');
const html = readFileSync(join(root, 'index.html'), 'utf8');

function files(dir: string, re: RegExp): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p, re) : re.test(n) ? [p] : [];
  });
}
const token = (name: string) => theme.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();

describe('design system', () => {
  it('defines the nine colours exactly', () => {
    expect(token('ds-primary')).toBe('#001d3a');
    expect(token('ds-primary-2')).toBe('#0b1b2a');
    expect(token('ds-secondary')).toBe('#00d2ff');
    expect(token('ds-secondary-2')).toBe('#0099ff');
    expect(token('ds-accent')).toBe('#ff9900');
    expect(token('ds-accent-2')).toBe('#ffad00');
    expect(token('ds-character')).toBe('#c68b59');
    expect(token('ds-character-2')).toBe('#d49b6a');
    expect(token('ds-neutral')).toBe('#ffffff');
  });

  it('gives each role its design-system colour: dark grounds, white text, cyan screens, orange calls to action', () => {
    expect(token('sd-room')).toBe('var(--ds-primary-2)');
    expect(token('sd-chassis')).toBe('var(--ds-primary)');
    expect(token('sd-ink')).toBe('var(--ds-neutral)');
    expect(token('sd-crt-hi')).toBe('var(--ds-secondary)');
    expect(token('sd-crt-mid')).toBe('var(--ds-secondary-2)');
    expect(token('sd-amber')).toBe('var(--ds-accent)');
    expect(token('sd-amber-hi')).toBe('var(--ds-accent-2)');
    expect(token('sd-character')).toBe('var(--ds-character)');
  });

  it('sets Space Grotesk for text and keys, Orbitron for technical titles, JetBrains Mono for readouts, and loads all three', () => {
    expect(token('sd-sans-font')).toMatch(/^'Space Grotesk'.*sans-serif$/);
    expect(token('sd-tech-font')).toMatch(/^'Orbitron'/);
    expect(token('sd-mono-font')).toMatch(/^'JetBrains Mono'.*monospace$/);
    for (const t of ['sd-display', 'sd-body', 'sd-mono']) expect(token(t)).toBe('var(--sd-sans-font)');
    expect(token('sd-crt-font')).toBe('var(--sd-mono-font)');
    expect(token('sd-tech')).toBe('var(--sd-tech-font)');
    expect(html).toMatch(/family=Orbitron/);
    expect(html).toMatch(/family=Space\+Grotesk/);
    expect(html).toMatch(/family=JetBrains\+Mono/);
    expect(html).not.toMatch(/Share\+Tech|Exo|VT323|Noto/);
  });

  it('keeps container drop shadows between 10 % and 20 % opacity', () => {
    for (const t of ['sd-shadow-frame', 'sd-shadow-card', 'sd-shadow-soft']) {
      const alphas = [...token(t)!.matchAll(/rgba\(\s*0,\s*0,\s*0,\s*([\d.]+)\)/g)].map((m) => Number(m[1]));
      expect(alphas.length, t).toBeGreaterThan(0);
      for (const a of alphas) {
        expect(a, t).toBeGreaterThanOrEqual(0.1);
        expect(a, t).toBeLessThanOrEqual(0.2);
      }
    }
  });

  it('glows neon cyan (#00D2FF) on focus, hover and active elements', () => {
    expect(token('sd-glow-cyan')).toMatch(/rgba\(0, 210, 255/);
    expect(theme).toMatch(/:focus-visible \{ outline: 2px solid var\(--ds-secondary\)[^}]*box-shadow: var\(--sd-glow-cyan\)/);
    expect(theme).toMatch(/\[aria-pressed='true'\], \[aria-selected='true'\], \[aria-checked='true'\]\)[^{]*\{ box-shadow: var\(--sd-glow-cyan\)/);
  });
});

describe('no audio left', () => {
  const src = files(join(root, 'src'), /\.(ts|tsx)$/);
  it('no audio API, element or sound module in the source', () => {
    const bad = src.filter((p) => /AudioContext|new Audio\(|<audio|<video|HTMLMediaElement|from '[./]*sound'|useLoop|SoundToggle/.test(readFileSync(p, 'utf8')));
    expect(bad.map((p) => relative(root, p))).toEqual([]);
  });

  it('no audio files in the assets, and no sound setting saved', () => {
    const audio = files(join(root, 'public'), /\.(mp3|wav|ogg|oga|m4a|aac|flac|webm)$/i);
    expect(audio.map((p) => relative(root, p))).toEqual([]);
    expect(src.some((p) => readFileSync(p, 'utf8').includes("'sd.sound'"))).toBe(false);
  });
});
