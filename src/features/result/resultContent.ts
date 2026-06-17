import { pathDefinitions } from '../../decision/policy/pathDefinitions';
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
