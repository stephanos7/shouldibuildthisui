import type { AppliedRule, DecisionExplanation, DecisionResult } from '../types/DecisionResult';
import type { Path } from '../types/Path';

function getPathDelta(rule: AppliedRule, path: Path): number {
  return rule.scores?.[path] ?? 0;
}

function collectRulesForPath(
  appliedRules: AppliedRule[],
  path: Path,
  direction: 'positive' | 'negative'
): AppliedRule[] {
  return appliedRules.filter((rule) => {
    const delta = getPathDelta(rule, path);
    return direction === 'positive' ? delta > 0 : delta < 0;
  });
}

export function buildExplanation(params: {
  decisionType: DecisionResult['decisionType'];
  recommendation: Path;
  rankedPaths: Path[];
  scores: Record<Path, number>;
  appliedRules: AppliedRule[];
}): DecisionExplanation {
  const { decisionType, recommendation, rankedPaths, scores, appliedRules } = params;

  if (decisionType === 'gate') {
    const gateRule = appliedRules[0];

    return {
      summary: gateRule
        ? `Recommended ${recommendation} because the gate "${gateRule.label}" matched.`
        : `Recommended ${recommendation} because a gate matched.`,
      recommendationReasons: gateRule ? [gateRule.reason] : [],
      counterSignals: []
    };
  }

  const positiveRules = collectRulesForPath(appliedRules, recommendation, 'positive');
  const negativeRules = collectRulesForPath(appliedRules, recommendation, 'negative');
  const runnerUp = rankedPaths[1];
  const margin = scores[recommendation] - scores[runnerUp];
  const runnerUpPositiveRules = collectRulesForPath(appliedRules, runnerUp, 'positive');

  return {
    summary: `Recommended ${recommendation} with a ${margin}-point lead over ${runnerUp}.`,
    recommendationReasons: positiveRules.map((rule) => rule.reason),
    counterSignals: negativeRules.map((rule) => rule.reason),
    runnerUp:
      margin <= 1
        ? {
            path: runnerUp,
            scoreDelta: margin,
            reasons: runnerUpPositiveRules.map((rule) => rule.reason)
          }
        : undefined
  };
}
