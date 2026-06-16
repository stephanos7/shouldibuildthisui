import { evaluateCondition } from './evaluateCondition';
import type { AppliedRule } from '../types/DecisionResult';
import type { DecisionFacts } from '../types/DecisionFacts';
import type { ScoredRule } from '../types/Policy';

export function applyBaseRules(facts: DecisionFacts, rules: ScoredRule[]): AppliedRule[] {
  return rules
    .filter((rule) => rule.conditions.every((condition) => evaluateCondition(facts, condition)))
    .map((rule) => ({
      ruleId: rule.id,
      label: rule.label,
      intent: rule.intent,
      reason: rule.reason,
      ruleType: 'base' as const,
      scores: rule.scores
    }));
}
