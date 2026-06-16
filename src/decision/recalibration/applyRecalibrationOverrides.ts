import { getEditableRules } from './getEditableRules';
import { isValidOverrideScore } from './validateRecalibrationOverride';
import type { Policy, ScoredRule } from '../types/Policy';
import type { RecalibrationOverrides, RuleRecalibrationOverride } from '../types/Recalibration';
import type { Path } from '../types/Path';

function applyRuleOverride(
  rule: ScoredRule,
  override: RuleRecalibrationOverride | undefined
): ScoredRule {
  if (!override || !rule.editable) {
    return { ...rule, scores: { ...rule.scores } };
  }

  const scores = { ...rule.scores };

  for (const [path, value] of Object.entries(override.scores ?? {})) {
    if (isValidOverrideScore(value)) {
      scores[path as Path] = value;
    }
  }

  return {
    ...rule,
    enabled: override.enabled ?? rule.enabled,
    reason: override.reason ?? rule.reason,
    scores
  };
}

export function applyRecalibrationOverrides(
  policy: Policy,
  overrides: RecalibrationOverrides | null | undefined
): Policy {
  const editableRuleIds = new Set(getEditableRules(policy).map((rule) => rule.id));

  const overrideMap =
    overrides && overrides.version === 1 && overrides.policyVersion === policy.version
      ? overrides.overrides
      : {};

  return {
    ...policy,
    gates: policy.gates.map((gate) => ({ ...gate, conditions: [...gate.conditions] })),
    baseRules: policy.baseRules.map((rule) =>
      editableRuleIds.has(rule.id) ? applyRuleOverride(rule, overrideMap[rule.id]) : rule
    ),
    interactionRules: policy.interactionRules.map((rule) =>
      editableRuleIds.has(rule.id) ? applyRuleOverride(rule, overrideMap[rule.id]) : rule
    )
  };
}
