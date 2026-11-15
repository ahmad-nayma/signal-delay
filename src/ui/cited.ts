// The data's cited texts in the player's language. The data stays English and Sourced; a screen shows
// `said(s.value)` and hands ⓘ the Sourced record itself, so the English original, its source and its link stay one
// tap away. The French lives in cited.fr.ts, keyed by the exact English.
import { CITED_FR } from './cited.fr';
import { lang } from './i18n';

/** A cited text (or a data title) as the player reads it: its French when French is on and it has one. */
export const said = (en: string): string => (lang() === 'fr' ? (CITED_FR[en] ?? en) : en);
