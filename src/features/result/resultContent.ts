import { pathDefinitions } from '../../decision/policy/pathDefinitions';
import type { AppliedRule } from '../../decision/types/DecisionResult';
import type { DecisionResult } from '../../decision/types/DecisionResult';
import type { Confidence } from '../../decision/types/DecisionResult';
import type { Path } from '../../decision/types/Path';

export function getPathDefinition(path: Path) {
  return pathDefinitions.find((definition) => definition.id === path);
}

export function formatDecisionType(decisionType: 'gate' | 'score') {
  return decisionType === 'gate' ? 'Gate recommendation' : 'Scored recommendation';
}

export function formatConfidenceLabel(confidence: Confidence) {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1);
}

export function getConfidenceSupportingCopy(confidence: Confidence) {
  switch (confidence) {
    case 'low':
      return 'This result is close. The runner-up path may also be appropriate depending on how your needs evolve.';
    case 'medium':
      return 'This recommendation has a meaningful lead, but the runner-up still reflects nearby tradeoffs.';
    case 'high':
      return 'This recommendation has a clear lead over the alternatives.';
  }
}

export function formatPointDelta(value: number) {
  return `${value}-point lead`;
}

export function getLeadDelta(result: DecisionResult) {
  if (result.explanation.runnerUp) {
    return result.explanation.runnerUp.scoreDelta;
  }

  const [topPath, nextPath] = result.rankedPaths;

  if (!topPath || !nextPath) {
    return 0;
  }

  return result.scores[topPath] - result.scores[nextPath];
}

export function getLeadSummary(result: DecisionResult) {
  const leadDelta = getLeadDelta(result);

  if (!result.explanation.runnerUp) {
    return leadDelta > 0
      ? `This path leads the next option by ${formatPointDelta(leadDelta)}.`
      : 'This path has a clear lead with no meaningful runner-up.';
  }

  const runnerUp = getPathDefinition(result.explanation.runnerUp.path);

  return `It leads ${runnerUp?.label ?? result.explanation.runnerUp.path} by ${formatPointDelta(
    leadDelta
  )}.`;
}

function getRecommendedPathContribution(rule: AppliedRule, recommendation: Path) {
  return rule.scores?.[recommendation];
}

function canSortFactorsByContribution(appliedRules: AppliedRule[], recommendation: Path) {
  if (appliedRules.length === 0) {
    return false;
  }

  return appliedRules.every((rule) => {
    if (!rule.scores) {
      return false;
    }

    const contribution = getRecommendedPathContribution(rule, recommendation);

    return typeof contribution === 'number';
  });
}

export function sortAppliedRulesForDisplay(appliedRules: AppliedRule[], recommendation: Path) {
  if (!canSortFactorsByContribution(appliedRules, recommendation)) {
    return appliedRules;
  }

  return [...appliedRules].sort((left, right) => {
    const leftContribution = Math.abs(getRecommendedPathContribution(left, recommendation) ?? 0);
    const rightContribution = Math.abs(getRecommendedPathContribution(right, recommendation) ?? 0);

    return rightContribution - leftContribution;
  });
}

export function getVisibleFactors(appliedRules: AppliedRule[], recommendation: Path) {
  return sortAppliedRulesForDisplay(appliedRules, recommendation).slice(0, 3);
}

export function getHiddenFactors(appliedRules: AppliedRule[], recommendation: Path) {
  return sortAppliedRulesForDisplay(appliedRules, recommendation).slice(3);
}

export function getViewAllFactorsLabel(factorCount: number) {
  if (factorCount <= 1) {
    return 'View scoring factor';
  }

  return `View all ${factorCount} scoring factors`;
}
