import type { DecisionResult } from '../../decision/types/DecisionResult';
import type { QuestionnaireValues } from './questionnaireSchema';

export type QuestionnaireResultState = {
  input: QuestionnaireValues;
  result: DecisionResult;
};
