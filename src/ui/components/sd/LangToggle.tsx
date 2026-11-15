// EN / FR: the language of the words on screen (i18n.ts), saved in the browser. Numbers stay the same.
import { setLang, useLang } from '../../i18n';
import { crossFade } from '../../motion';
import { LANG_WORDS } from '../../sdWords';

export function LangToggle({ className = '' }: { className?: string }) {
  const lang = useLang();
  const other = lang === 'en' ? 'fr' : 'en';
  return (
    <button
      type="button"
      className={`sd-ghost-btn sd-lang ${className}`}
      aria-label={`${LANG_WORDS.label}: ${LANG_WORDS[lang]} → ${LANG_WORDS[other]}`}
      title={LANG_WORDS.label}
      onClick={() => {
        setLang(other);
        crossFade();
      }}
    >
      <span className={lang === 'en' ? 'on' : ''} lang="en">
        {LANG_WORDS.en}
      </span>
      <span className="sd-lang-bar" aria-hidden="true">
        /
      </span>
      <span className={lang === 'fr' ? 'on' : ''} lang="fr">
        {LANG_WORDS.fr}
      </span>
    </button>
  );
}
