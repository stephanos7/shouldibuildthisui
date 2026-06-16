import { evaluateCondition } from './evaluateCondition';
import type { DecisionFacts } from '../types/DecisionFacts';
import type { GatePolicy } from '../types/Policy';

export function applyGate(facts: DecisionFacts, gates: GatePolicy[]): GatePolicy | null {
  return (
    gates.find((gate) => gate.conditions.every((condition) => evaluateCondition(facts, condition))) ??
    null
  );
}
