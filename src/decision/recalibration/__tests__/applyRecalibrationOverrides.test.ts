import { describe, expect, it } from 'vitest';
import { applyRecalibrationOverrides } from '../applyRecalibrationOverrides';
import { recommendationPolicy } from '../../policy/recommendationPolicy';
import type { Policy } from '../../types/Policy';
import type { RecalibrationOverrides } from '../../types/Recalibration';

function clonePolicy(policy: Policy): Policy {
  return structuredClone(policy);
}

function createOverrides(
  overrides: RecalibrationOverrides['overrides']
): RecalibrationOverrides {
  return {
    version: 1,
    policyVersion: recommendationPolicy.version,
    updatedAt: '2026-06-16T00:00:00.000Z',
    overrides
  };
}

describe('applyRecalibrationOverrides', () => {
  it('applies valid score overrides', () => {
    const policy = applyRecalibrationOverrides(
      recommendationPolicy,
      createOverrides({
        'scale-multi-team-multi-app': {
          ruleId: 'scale-multi-team-multi-app',
          scores: {
            mui_x_premium: 4,
            mui_x_enterprise: 1
          },
          updatedAt: '2026-06-16T00:00:00.000Z'
        }
      })
    );

    const rule = policy.interactionRules.find((entry) => entry.id === 'scale-multi-team-multi-app');

    expect(rule?.scores).toEqual({
      mui_x_premium: 4,
      mui_x_enterprise: 1
    });
  });

  it('applies enabled and reason overrides', () => {
    const policy = applyRecalibrationOverrides(
      recommendationPolicy,
      createOverrides({
        'delivery-fixed-deadline-pressure': {
          ruleId: 'delivery-fixed-deadline-pressure',
          enabled: false,
          reason: 'Local calibration lowered this signal.',
          updatedAt: '2026-06-16T00:00:00.000Z'
        }
      })
    );

    const rule = policy.baseRules.find((entry) => entry.id === 'delivery-fixed-deadline-pressure');

    expect(rule?.enabled).toBe(false);
    expect(rule?.reason).toBe('Local calibration lowered this signal.');
  });

  it('ignores gate overrides and unknown rule overrides', () => {
    const policy = applyRecalibrationOverrides(
      recommendationPolicy,
      createOverrides({
        'gate-prototype-simple-internal-tool': {
          ruleId: 'gate-prototype-simple-internal-tool',
          reason: 'Should not apply.',
          updatedAt: '2026-06-16T00:00:00.000Z'
        },
        'unknown-rule': {
          ruleId: 'unknown-rule',
          enabled: false,
          updatedAt: '2026-06-16T00:00:00.000Z'
        }
      })
    );

    expect(policy.gates[0].reason).toBe(recommendationPolicy.gates[0].reason);
    expect(
      policy.baseRules.some((rule) => rule.id === 'unknown-rule') ||
        policy.interactionRules.some((rule) => rule.id === 'unknown-rule')
    ).toBe(false);
  });

  it('ignores invalid scores and preserves ids and conditions', () => {
    const policy = applyRecalibrationOverrides(
      recommendationPolicy,
      {
        version: 1,
        policyVersion: recommendationPolicy.version,
        updatedAt: '2026-06-16T00:00:00.000Z',
        overrides: {
          'scale-multi-team-multi-app': {
            ruleId: 'scale-multi-team-multi-app',
            scores: {
              mui_x_premium: 6,
              mui_x_enterprise: 2.5,
              mui_core: -2
            } as never,
            updatedAt: '2026-06-16T00:00:00.000Z'
          }
        }
      }
    );

    const originalRule = recommendationPolicy.interactionRules.find(
      (entry) => entry.id === 'scale-multi-team-multi-app'
    );
    const updatedRule = policy.interactionRules.find(
      (entry) => entry.id === 'scale-multi-team-multi-app'
    );

    expect(updatedRule?.scores).toEqual({
      ...originalRule?.scores,
      mui_core: -2
    });
    expect(updatedRule?.id).toBe(originalRule?.id);
    expect(updatedRule?.conditions).toEqual(originalRule?.conditions);
  });

  it('does not mutate the base policy', () => {
    const originalPolicy = clonePolicy(recommendationPolicy);

    applyRecalibrationOverrides(
      recommendationPolicy,
      createOverrides({
        'scale-multi-team-multi-app': {
          ruleId: 'scale-multi-team-multi-app',
          enabled: false,
          reason: 'Updated locally.',
          scores: {
            mui_x_premium: -1
          },
          updatedAt: '2026-06-16T00:00:00.000Z'
        }
      })
    );

    expect(recommendationPolicy).toEqual(originalPolicy);
  });
});
