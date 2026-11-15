// ABOUT (Home): what this version of the project is, who made it and where its code lives (about.ts).
import { useEffect } from 'react';
import { ABOUT } from '../../about';
import { ABOUT_WORDS } from '../../sdWords';

export function AboutPanel({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="sd-overlay" role="dialog" aria-modal="true" aria-label={ABOUT_WORDS.title} onClick={onClose}>
      <div className="sd-brief sd-paper ab" onClick={(e) => e.stopPropagation()}>
        <div className="sd-brief-head">
          <span className="sd-brief-concept">{ABOUT_WORDS.title}</span>
          <h2 className="sd-brief-title">{ABOUT.projectName}</h2>
          <span className="ab-team-name">{ABOUT.teamName}</span>
        </div>
        <p className="sd-brief-job">{ABOUT_WORDS.description}</p>
        <section className="sd-brief-sec" aria-label={ABOUT_WORDS.team}>
          <h3>{ABOUT_WORDS.team}</h3>
          <ul className="ab-members">
            {ABOUT.members.map((m) => (
              <li key={m.name}>
                <span className="ab-member">{m.name}</span>
                {m.role && <span className="ab-role">{m.role}</span>}
              </li>
            ))}
          </ul>
        </section>
        <section className="sd-brief-sec" aria-label={ABOUT_WORDS.repo}>
          <h3>{ABOUT_WORDS.repo}</h3>
          <a className="ab-repo" href={ABOUT.repoUrl} target="_blank" rel="noreferrer">
            {ABOUT_WORDS.repoLink} ↗
          </a>
          <span className="ab-url" dir="ltr">
            {ABOUT.repoUrl}
          </span>
        </section>
        <div className="sd-brief-foot">
          <button type="button" className="sd-cta" onClick={onClose}>
            {ABOUT_WORDS.close}
          </button>
        </div>
      </div>
    </div>
  );
}
