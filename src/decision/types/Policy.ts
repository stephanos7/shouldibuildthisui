import type { DecisionFacts } from './DecisionFacts';
import type { Path } from './Path';

export type ConditionOperator = 'equals' | 'notEquals' | 'in' | 'notIn';

type EqualityCondition<K extends keyof DecisionFacts> = {
  field: K;
  operator: 'equals' | 'notEquals';
  value: DecisionFacts[K];
};

type SetCondition<K extends keyof DecisionFacts> = {
  field: K;
  operator: 'in' | 'notIn';
  value: DecisionFacts[K][];
};

export type Condition = {
  [K in keyof DecisionFacts]: EqualityCondition<K> | SetCondition<K>;
}[keyof DecisionFacts];

export type RuleMetadata = {
  id: string;
  label: string;
  intent: string;
  reason: string;
};

export type GatePolicy = RuleMetadata & {
  editable: false;
  conditions: Condition[];
  recommendation: Path;
};

export type ScoreMap = Partial<Record<Path, number>>;

export type ScoredRule = RuleMetadata & {
  enabled: boolean;
  editable: boolean;
  conditions: Condition[];
  scores: ScoreMap;
};

export type Policy = {
  version: string;
  gates: GatePolicy[];
  baseRules: ScoredRule[];
  interactionRules: ScoredRule[];
};
