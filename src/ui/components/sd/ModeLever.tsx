// The CADET / ENGINEER lever (design: top-right of every screen). Engineer shows the numbers and sources.
// With `onKids` (Home), a third key beside it opens SPACE KIDS, Cadet's loop made simple for young children; it is a
// separate screen, not a third value of Mode, so the Cadet and Engineer flows stay as they are.
import { MODE_WORDS } from '../../sdWords';
import { SDIcon } from './SDIcon';

export type Mode = 'cadet' | 'engineer';

interface Props {
  mode: Mode;
  onMode: (m: Mode) => void;
  /** Open SPACE KIDS (Home only). */
  onKids?: () => void;
}

export function ModeLever({ mode, onMode, onKids }: Props) {
  const eng = mode === 'engineer';
  const flip = () => onMode(eng ? 'cadet' : 'engineer');
  return (
    <div className="sd-lever">
      <span className={`sd-lever-word${eng ? '' : ' on'}`} aria-hidden="true">
        {MODE_WORDS.cadet}
      </span>
      <button type="button" role="switch" aria-checked={eng} aria-label="Engineer mode" title="Engineer mode shows numbers and sources" className="sd-lever-switch" onClick={flip}>
        <span className="sd-lever-knob" />
      </button>
      <span className={`sd-lever-word${eng ? ' on' : ''}`} aria-hidden="true">
        {MODE_WORDS.engineer}
      </span>
      <button type="button" className="sd-lever-short" aria-pressed={eng} aria-label="Engineer mode (short)" onClick={flip}>
        {MODE_WORDS.short}
      </button>
      {onKids && (
        <button type="button" className="sd-kids-key" aria-label={MODE_WORDS.kidsLabel} title={MODE_WORDS.kidsLabel} onClick={onKids}>
          <span className="sd-kids-icon">
            <SDIcon icon="star" size={16} color="var(--ds-accent-2)" fill />
          </span>
          {MODE_WORDS.kids}
        </button>
      )}
    </div>
  );
}
