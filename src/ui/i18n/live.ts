// A word function that answers in the current language. sdWords.ts and opsWords.ts wrap each of their top-level
// word functions in `live(name, english)`; i18n.ts hands in the other language's functions of the same names.
// No imports here, so the word files can use it without a cycle.
const overrides = new Map<string, (...args: never[]) => unknown>();

/** Marks a wrapped export, so a test can check every word function follows the language. */
export const LIVE = Symbol('live word function');

export function live<F extends (...args: never[]) => unknown>(name: string, english: F): F {
  const wrapped = ((...args: never[]) => ((overrides.get(name) as F | undefined) ?? english)(...args)) as F & { [LIVE]?: string };
  wrapped[LIVE] = name;
  return wrapped;
}

/** The functions of the language now on screen (empty for English). */
export function setLiveWords(fns: Record<string, unknown>) {
  overrides.clear();
  for (const [name, fn] of Object.entries(fns)) if (typeof fn === 'function') overrides.set(name, fn as (...args: never[]) => unknown);
}
