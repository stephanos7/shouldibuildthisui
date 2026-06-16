import { evaluateCondition } from './evaluateCondition';
import type { AppliedRule } from '../types/DecisionResult';
import type { DecisionFacts } from '../types/DecisionFacts';
import type { ScoredRule } from '../types/Policy';

export function applyInteractionRules(facts: DecisionFacts, rules: ScoredRule[]): AppliedRule[] {
  return rules
    .filter((rule) => rule.conditions.every((condition) => evaluateCondition(facts, condition)))
    .map((rule) => ({
      ruleId: rule.id,
      label: rule.label,
      intent: rule.intent,
      reason: rule.reason,
      ruleType: 'interaction' as const,
      scores: rule.scores
    }));
}
