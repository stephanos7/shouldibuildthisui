import type { DecisionFacts } from '../types/DecisionFacts';

export function normalizeQuestionnaireValues(input: DecisionFacts): DecisionFacts {
  return { ...input };
}
