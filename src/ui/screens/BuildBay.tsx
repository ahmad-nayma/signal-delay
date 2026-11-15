// Build Bay (mockup: Build Bay.dc.html). Everything on screen is evaluateDesign(design) or a Sourced value.
// The drawing of the craft is the centre of the screen; the parts catalogue (left) and the mission budget (right) are
// side panels that fold into narrow rails, so the drawing can take the whole width. A folded budget keeps the craft's
// overall state and the Launch key on its rail. Each meter's equation and inputs sit in a fold of their own.
import { useState } from 'react';
import { METER_KEYS } from '../../engine/compare';
import type { FullEvaluation } from '../../engine/index';
import type { Design, MeterStatus } from '../../engine/types';
import { BlockerBar } from '../components/BlockerBar';
import { BudgetPanel } from '../components/BudgetPanel';
import { CraftDrawing } from '../components/CraftDrawing';
import { StatusIcon } from '../components/icons';
import { PartsCatalog } from '../components/PartsCatalog';
import { applyPart, type SlotKind } from '../designOps';
import { launchBurst } from '../motion';
import { useOpsRisk } from '../riskRunner';

interface Props {
  design: Design;
  ev: FullEvaluation;
  engineer: boolean;
  onChange: (d: Design) => void;
  onLaunch: () => void;
}

const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1c2 2 3 5 3 8v4H5V9c0-3 1-6 3-8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export function BuildBay({ design, ev, engineer, onChange, onLaunch }: Props) {
  const [dragKind, setDragKind] = useState<SlotKind | undefined>();
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [budgetOpen, setBudgetOpen] = useState(true);
  const blocked = ev.blockers.length > 0;
  const risk = useOpsRisk(design);
  // the rail's single mark: the worst state among the meters (no number)
  const statuses: MeterStatus[] = METER_KEYS.map((k) => ev.meters[k].status);
  const worst: MeterStatus = statuses.includes('over') ? 'over' : statuses.includes('warning') ? 'warning' : 'ok';
  const launch = (e: React.MouseEvent<HTMLButtonElement>) => launchBurst(e.currentTarget, onLaunch);

  return (
    <div className={`bay${catalogOpen ? '' : ' cat-closed'}${budgetOpen ? '' : ' bud-closed'}`}>
      <div className="bay-side left">
        <button type="button" className="bay-toggle" aria-expanded={catalogOpen} aria-controls="bay-catalog" aria-label={catalogOpen ? 'Fold the parts catalogue' : 'Open the parts catalogue'} onClick={() => setCatalogOpen((o) => !o)}>
          <span className="bay-toggle-arrow" aria-hidden="true">
            ◂
          </span>
          <span className="bay-toggle-k">Parts</span>
        </button>
        <div id="bay-catalog" className="bay-side-body" {...(catalogOpen ? {} : { inert: true })}>
          <PartsCatalog design={design} ev={ev} engineer={engineer} onChange={onChange} onDragKind={setDragKind} />
        </div>
      </div>

      <CraftDrawing design={design} ev={ev} dragKind={dragKind} onDrop={(p) => onChange(applyPart(design, p))} />

      <div className="bay-side right">
        <button type="button" className="bay-toggle" aria-expanded={budgetOpen} aria-controls="bay-budget" aria-label={budgetOpen ? 'Fold the mission budget' : 'Open the mission budget'} onClick={() => setBudgetOpen((o) => !o)}>
          <span className="bay-toggle-arrow" aria-hidden="true">
            ▸
          </span>
          <span className="bay-toggle-k">Budget</span>
          <span className={`chip ${worst} bay-rail-state`}>
            <StatusIcon status={worst} />
          </span>
        </button>
        {!budgetOpen && (
          <button type="button" className="cta bay-rail-launch" disabled={blocked} onClick={launch} aria-label="Launch" title={blocked ? 'Locked until every blocker is fixed' : 'Launch'}>
            <RocketIcon />
          </button>
        )}
        <aside id="bay-budget" className="budget bay-side-body" aria-label="Mission budget" {...(budgetOpen ? {} : { inert: true })}>
          <BudgetPanel ev={ev} design={design} engineer={engineer} risk={risk} />
          <BlockerBar ev={ev} engineer={engineer} risk={risk} />
          <button className="cta" disabled={blocked} onClick={launch}>
            <RocketIcon />
            Launch
          </button>
          <div className="cta-sub">{blocked ? 'Locked until every blocker is fixed' : 'Launch window and flight are simulated by the engine'}</div>
        </aside>
      </div>
    </div>
  );
}
