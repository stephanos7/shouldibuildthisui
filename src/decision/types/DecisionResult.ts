import type { DecisionFacts } from './DecisionFacts';
import type { Path } from './Path';
import type { ScoreMap } from './Policy';

export type Confidence = 'low' | 'medium' | 'high';

export type AppliedRule = {
  ruleId: string;
  label: string;
  intent: string;
  reason: string;
  ruleType: 'gate' | 'base' | 'interaction';
  recommendation?: Path;
  scores?: ScoreMap;
};

export type DecisionExplanation = {
  summary: string;
  recommendationReasons: string[];
  counterSignals: string[];
  runnerUp?: {
    path: Path;
    scoreDelta: number;
    reasons: string[];
  };
};

export type DecisionResult = {
  decisionType: 'gate' | 'score';
  policyVersion: string;
  facts: DecisionFacts;
  recommendation: Path;
  rankedPaths: Path[];
  scores: Record<Path, number>;
  confidence: Confidence;
  appliedRules: AppliedRule[];
  explanation: DecisionExplanation;
};
