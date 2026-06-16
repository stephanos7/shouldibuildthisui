import { describe, expect, it } from 'vitest';
import {
  isValidOverrideScore,
  validateRecalibrationOverrides,
  validateRuleRecalibrationOverride
} from '../validateRecalibrationOverride';

describe('validateRecalibrationOverride', () => {
  it('accepts valid rule overrides', () => {
    expect(
      validateRuleRecalibrationOverride({
        ruleId: 'scale-multi-team-multi-app',
        enabled: false,
        scores: {
          mui_x_premium: 4
        },
        reason: 'Updated reason.',
        internalNote: 'Internal note.',
        updatedAt: '2026-06-16T00:00:00.000Z'
      })
    ).toEqual({
      ruleId: 'scale-multi-team-multi-app',
      enabled: false,
      scores: {
        mui_x_premium: 4
      },
      reason: 'Updated reason.',
      internalNote: 'Internal note.',
      updatedAt: '2026-06-16T00:00:00.000Z'
    });
  });

  it('rejects invalid rule overrides', () => {
    expect(
      validateRuleRecalibrationOverride({
        ruleId: 'scale-multi-team-multi-app',
        scores: {
          mui_x_premium: 9
        },
        updatedAt: '2026-06-16T00:00:00.000Z'
      })
    ).toBeNull();
  });

  it('accepts valid override collections', () => {
    expect(
      validateRecalibrationOverrides({
        version: 1,
        policyVersion: 'initial-production-policy-v1',
        updatedAt: '2026-06-16T00:00:00.000Z',
        overrides: {
          'scale-multi-team-multi-app': {
            ruleId: 'scale-multi-team-multi-app',
            enabled: true,
            updatedAt: '2026-06-16T00:00:00.000Z'
          }
        }
      })
    ).not.toBeNull();
  });

  it('rejects malformed override collections', () => {
    expect(
      validateRecalibrationOverrides({
        version: 2,
        policyVersion: 'initial-production-policy-v1',
        updatedAt: '2026-06-16T00:00:00.000Z',
        overrides: {}
      })
    ).toBeNull();
  });

  it('validates override score ranges as integers between -5 and 5', () => {
    expect(isValidOverrideScore(-5)).toBe(true);
    expect(isValidOverrideScore(5)).toBe(true);
    expect(isValidOverrideScore(1.5)).toBe(false);
    expect(isValidOverrideScore(6)).toBe(false);
  });
});
