import type { CalibrationScenario } from '../../decision/tests/calibrationScenarios';
import type { DecisionResult } from '../../decision/types/DecisionResult';

export type EvaluatedScenario = {
  scenario: CalibrationScenario;
  result: DecisionResult;
  passed: boolean;
};
