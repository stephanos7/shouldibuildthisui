import type { Policy, ScoredRule } from '../types/Policy';

export function getEditableRules(policy: Policy): ScoredRule[] {
  return [...policy.baseRules, ...policy.interactionRules].filter((rule) => rule.editable);
}
