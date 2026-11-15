// The language of the words on screen: English (default) or French. A deliberately simple structure:
// - English lives in sdWords.ts and opsWords.ts; French in sdWords.fr.ts and opsWords.fr.ts, which have exactly the
//   same exports (same tables, same functions, same arguments), with every word in French.
// - Switching language writes the other language's tables into the English tables (keeping the English to restore
//   later), hands its word functions to `live` (i18n/live.ts), sets format.ts' numbers, dates and units, and
//   re-renders the App (useLang). Screens read the words as usual and need no change.
// - The choice is saved in the browser (`sd.lang`) and sets <html lang>.
import { useSyncExternalStore } from 'react';
import { setFormatLang } from './format';
import { setLiveWords } from './i18n/live';
import * as OPS_EN from './opsWords';
import * as OPS_FR from './opsWords.fr';
import * as SD_EN from './sdWords';
import * as SD_FR from './sdWords.fr';

export type Lang = 'en' | 'fr';
export const LANGS: readonly Lang[] = ['en', 'fr'];

const LANG_KEY = 'sd.lang';

/** Each language as pairs of (the English module, the same module in that language). */
const MODULES: Record<Exclude<Lang, 'en'>, [Record<string, unknown>, Record<string, unknown>][]> = {
  fr: [
    [SD_EN, SD_FR],
    [OPS_EN, OPS_FR],
  ],
};

/** English values replaced by a translation, so a switch back restores them exactly. */
const english = new Map<object, Map<PropertyKey, unknown>>();

const isTable = (v: unknown): v is Record<PropertyKey, unknown> => v !== null && typeof v === 'object';

function patch(target: Record<PropertyKey, unknown>, words: Record<PropertyKey, unknown>) {
  for (const [k, v] of Object.entries(words)) {
    const cur = target[k];
    if (isTable(cur) && isTable(v)) patch(cur, v);
    else {
      let saved = english.get(target);
      if (!saved) english.set(target, (saved = new Map()));
      if (!saved.has(k)) saved.set(k, cur);
      target[k] = v;
    }
  }
}

function restoreEnglish() {
  for (const [target, saved] of english) for (const [k, v] of saved) (target as Record<PropertyKey, unknown>)[k] = v;
  english.clear();
}

function loadLang(): Lang {
  try {
    const raw = localStorage.getItem(LANG_KEY);
    return raw && (JSON.parse(raw) as { lang?: unknown }).lang === 'fr' ? 'fr' : 'en';
  } catch {
    return 'en';
  }
}

function saveLang(l: Lang) {
  try {
    localStorage.setItem(LANG_KEY, JSON.stringify({ lang: l }));
  } catch {
    /* storage unavailable: this visit only */
  }
}

let current: Lang = 'en';
const listeners = new Set<() => void>();

function apply(l: Lang) {
  restoreEnglish();
  const fns: Record<string, unknown> = {};
  if (l !== 'en') {
    for (const [en, other] of MODULES[l]) {
      for (const [name, words] of Object.entries(other)) {
        const table = en[name];
        if (typeof words === 'function') fns[name] = words;
        else if (isTable(table) && isTable(words)) patch(table, words);
      }
    }
  }
  setLiveWords(fns);
  setFormatLang(l);
  current = l;
  if (typeof document !== 'undefined') document.documentElement.lang = l;
}

export const lang = (): Lang => current;

/** Switch the words on screen; saved, and every `useLang` re-renders. */
export function setLang(l: Lang): void {
  if (current === l) return;
  apply(l);
  saveLang(l);
  for (const fn of listeners) fn();
}

/** Apply the saved language at start-up (main.tsx), before the first render. */
export const initLang = () => apply(loadLang());

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** The language, re-rendering on a switch (App reads it, so every screen re-renders). */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, lang, lang);
}
