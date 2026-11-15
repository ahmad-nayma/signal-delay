// Margins → status → risk → score: one margin feeds three modules (meter.ts, risk.ts, scoring.ts).
// physics.test.ts checks each function at a few points; this file checks that the three rules agree with
// each other on the shared 10% threshold, and that the piecewise curves have no jumps.
import { describe, expect, it } from 'vitest';
import { GAME_RULES } from '../src/engine/constants';
import { makeMeter, marginStatus } from '../src/engine/meter';
import { marginFactor, phaseFailure } from '../src/engine/risk';
import { MARGIN_BAND, marginBandScore } from '../src/engine/scoring';

// Margins from −20% to +100% in 0.5% steps (241 values).
const SWEEP = Array.from({ length: 241 }, (_, i) => -0.2 + i * 0.005);
const REC = GAME_RULES.marginWarning.value; // 0.10

describe('margin rules agree across meter, risk and scoring', () => {
  it('the warning threshold, the risk knee and the score band start at the same margin', () => {
    expect(REC).toBe(0.1);
    expect(MARGIN_BAND.low.value).toBe(REC);
  });

  it('status "ok" ⇔ no risk penalty; "warning" ⇔ finite penalty > 1; "over" ⇔ certain failure', () => {
    for (const m of SWEEP) {
      const status = marginStatus(m);
      const f = marginFactor(m);
      if (status === 'ok') expect(f, `m = ${m}`).toBe(1);
      else if (status === 'warning') {
        expect(f, `m = ${m}`).toBeGreaterThan(1);
        expect(Number.isFinite(f), `m = ${m}`).toBe(true);
      } else {
        expect(f, `m = ${m}`).toBe(Infinity);
        // An over-margin resource makes any phase that depends on it fail for certain (p capped at 1).
        expect(phaseFailure(0.02, [m])).toBe(1);
      }
    }
  });

  it('a margin scored 100 is never penalised by the risk model', () => {
    for (const m of SWEEP) if (marginBandScore(m) === 100) expect(marginFactor(m), `m = ${m}`).toBe(1);
  });

  it('marginFactor never decreases as the margin shrinks (more margin is never riskier)', () => {
    for (let i = 1; i < SWEEP.length; i++) {
      expect(marginFactor(SWEEP[i - 1]!)).toBeGreaterThanOrEqual(marginFactor(SWEEP[i]!));
    }
  });

  it('marginFactor and marginBandScore are continuous at their knees', () => {
    const eps = 1e-9;
    // f(0.1⁻) = 1 + 2·(eps/0.1) → 1; f(0⁺) = 1 + 2·(0.1 − eps)/0.1 → 3
    expect(marginFactor(REC - eps)).toBeCloseTo(1, 6);
    expect(marginFactor(eps)).toBeCloseTo(3, 6);
    // score(0.1⁻) = 100·(0.1 − eps)/0.1 → 100; score(0.3⁺) = 100·(0.8 − 0.3 − eps)/0.5 → 100; score(0.8⁻) → 0
    expect(marginBandScore(MARGIN_BAND.low.value - eps)).toBeCloseTo(100, 4);
    expect(marginBandScore(MARGIN_BAND.high.value + eps)).toBeCloseTo(100, 4);
    expect(marginBandScore(MARGIN_BAND.zeroAt.value - eps)).toBeCloseTo(0, 4);
  });

  it('marginBandScore stays within 0–100 for every margin, including NaN', () => {
    for (const m of [...SWEEP, NaN, Infinity, -Infinity]) {
      const s = marginBandScore(m);
      expect(s, `m = ${m}`).toBeGreaterThanOrEqual(0);
      expect(s, `m = ${m}`).toBeLessThanOrEqual(100);
    }
  });

  it('makeMeter: headroom = limit − used and the status follows the margin given', () => {
    // 900 kg used of a 1000 kg limit: headroom 100 kg, margin 10% → exactly on the threshold → ok
    const ok = makeMeter(900, 1000, 0.1, 'm', {});
    expect(ok.headroom).toBe(100);
    expect(ok.status).toBe('ok');
    expect(ok).not.toHaveProperty('calibrated');
    // 1050 used of 1000: headroom −50, margin −5% → over
    const over = makeMeter(1050, 1000, -0.05, 'm', {}, true);
    expect(over.headroom).toBe(-50);
    expect(over.status).toBe('over');
    expect(over.calibrated).toBe(true);
  });
});
