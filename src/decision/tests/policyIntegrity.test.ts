import { describe, expect, it } from 'vitest';
import { validatePolicy } from '../engine/validatePolicy';
import { recommendationPolicy } from '../policy/recommendationPolicy';
import { decisionFactOptions } from '../types/DecisionFacts';
import { validPaths } from '../types/Path';
import type { Policy, RuleMetadata } from '../types/Policy';

function clonePolicy(policy: Policy): Policy {
  return structuredClone(policy);
}

function getAllRules(policy: Policy) {
  return [...policy.gates, ...policy.baseRules, ...policy.interactionRules];
}

describe('policy integrity', () => {
  it('accepts the shipped policy', () => {
    expect(() => validatePolicy(recommendationPolicy)).not.toThrow();
  });

  it('enforces exactly one gate', () => {
    expect(recommendationPolicy.gates).toHaveLength(1);
  });

  it('uses unique rule ids across gates, base rules, and interaction rules', () => {
    const ruleIds = getAllRules(recommendationPolicy).map((rule) => rule.id);

    expect(new Set(ruleIds).size).toBe(ruleIds.length);
  });

  it('requires id, label, intent, and reason on every rule', () => {
    for (const rule of getAllRules(recommendationPolicy)) {
      const metadata = rule as RuleMetadata;

      expect(metadata.id.trim()).not.toBe('');
      expect(metadata.label.trim()).not.toBe('');
      expect(metadata.intent.trim()).not.toBe('');
      expect(metadata.reason.trim()).not.toBe('');
    }
  });

  it('marks the gate as uneditable and non-gate rules as configurable', () => {
    expect(recommendationPolicy.gates[0].editable).toBe(false);

    for (const rule of [...recommendationPolicy.baseRules, ...recommendationPolicy.interactionRules]) {
      expect(rule.enabled).toBeTypeOf('boolean');
      expect(rule.editable).toBeTypeOf('boolean');
    }
  });

  it('limits condition fields, values, operators, paths, and score ranges to valid policy data', () => {
    const validFieldNames = new Set(Object.keys(decisionFactOptions));
    const validOperators = new Set(['equals', 'notEquals', 'in', 'notIn']);
    const validPathSet = new Set(validPaths);

    for (const rule of getAllRules(recommendationPolicy)) {
      for (const condition of rule.conditions) {
        expect(validFieldNames.has(condition.field)).toBe(true);
        expect(validOperators.has(condition.operator)).toBe(true);

        const allowedValues = new Set(
          decisionFactOptions[condition.field as keyof typeof decisionFactOptions]
        );
        const values = Array.isArray(condition.value) ? condition.value : [condition.value];

        for (const value of values) {
          expect(allowedValues.has(value)).toBe(true);
        }
      }

      if ('scores' in rule) {
        for (const [path, score] of Object.entries(rule.scores)) {
          expect(validPathSet.has(path as (typeof validPaths)[number])).toBe(true);
          expect(Number.isInteger(score)).toBe(true);
          expect(score).toBeGreaterThanOrEqual(-5);
          expect(score).toBeLessThanOrEqual(5);
        }
      }
    }
  });

  it('requires a non-empty policy version', () => {
    expect(recommendationPolicy.version.trim()).not.toBe('');
  });

  it('references every required decision fact in at least one rule condition', () => {
    const referencedFields = new Set(
      getAllRules(recommendationPolicy).flatMap((rule) =>
        rule.conditions.map((condition) => condition.field)
      )
    );

    for (const fieldName of Object.keys(decisionFactOptions) as Array<keyof typeof decisionFactOptions>) {
      expect(referencedFields.has(fieldName)).toBe(true);
    }
  });
});

describe('validatePolicy failures', () => {
  it('rejects policies without exactly one gate', () => {
    const withoutGate = clonePolicy(recommendationPolicy);
    withoutGate.gates = [];

    const withTwoGates = clonePolicy(recommendationPolicy);
    withTwoGates.gates = [...withTwoGates.gates, withTwoGates.gates[0]];

    expect(() => validatePolicy(withoutGate)).toThrow(/exactly one gate/i);
    expect(() => validatePolicy(withTwoGates)).toThrow(/exactly one gate/i);
  });

  it('rejects duplicate rule ids', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.baseRules[0].id = policy.gates[0].id;

    expect(() => validatePolicy(policy)).toThrow(/duplicate rule id/i);
  });

  it('rejects missing metadata', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.baseRules[0].reason = ' ';

    expect(() => validatePolicy(policy)).toThrow(/must include label, intent, and reason/i);
  });

  it('rejects invalid condition fields', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.baseRules[0].conditions[0] = {
      field: 'notARealField' as never,
      operator: 'equals',
      value: 'prototype'
    };

    expect(() => validatePolicy(policy)).toThrow(/invalid field/i);
  });

  it('rejects invalid condition values', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.baseRules[0].conditions[0] = {
      field: 'ownershipHorizon',
      operator: 'equals',
      value: 'forever' as never
    };

    expect(() => validatePolicy(policy)).toThrow(/invalid value/i);
  });

  it('rejects unsupported operators', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.baseRules[0].conditions[0] = {
      field: 'ownershipHorizon',
      operator: 'greaterThan' as never,
      value: 'prototype'
    };

    expect(() => validatePolicy(policy)).toThrow(/unsupported operator/i);
  });

  it('rejects invalid score paths', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.baseRules[0].scores = {
      not_a_real_path: 1
    } as never;

    expect(() => validatePolicy(policy)).toThrow(/invalid path/i);
  });

  it('rejects editable gates', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.gates[0].editable = true as never;

    expect(() => validatePolicy(policy)).toThrow(/must not be editable/i);
  });

  it('rejects non-integer scores', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.baseRules[0].scores = {
      build_it_yourself: 1.5
    };

    expect(() => validatePolicy(policy)).toThrow(/integer scores/i);
  });

  it('rejects scores outside the allowed range', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.baseRules[0].scores = {
      build_it_yourself: 6
    };

    expect(() => validatePolicy(policy)).toThrow(/between -5 and \+5/i);
  });

  it('rejects blank policy versions', () => {
    const policy = clonePolicy(recommendationPolicy);
    policy.version = ' ';

    expect(() => validatePolicy(policy)).toThrow(/policy version is required/i);
  });
});
