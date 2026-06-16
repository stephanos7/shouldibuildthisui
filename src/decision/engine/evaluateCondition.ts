import type { DecisionFacts } from '../types/DecisionFacts';
import type { Condition } from '../types/Policy';

export function evaluateCondition(facts: DecisionFacts, condition: Condition): boolean {
  const factValue = facts[condition.field] as string;

  switch (condition.operator) {
    case 'equals':
      return factValue === condition.value;
    case 'notEquals':
      return factValue !== condition.value;
    case 'in':
      return (condition.value as string[]).includes(factValue);
    case 'notIn':
      return !(condition.value as string[]).includes(factValue);
  }
}
