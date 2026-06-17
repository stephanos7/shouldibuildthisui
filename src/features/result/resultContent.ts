import { pathDefinitions } from "../../decision/policy/pathDefinitions";
import type { AppliedRule } from "../../decision/types/DecisionResult";
import type { DecisionResult } from "../../decision/types/DecisionResult";
import type { Confidence } from "../../decision/types/DecisionResult";
import type { Path } from "../../decision/types/Path";

export type ScoreComparisonRow = {
  path: Path;
  label: string;
  description: string;
  score: number;
  normalizedScore: number;
  isRecommended: boolean;
  isRunnerUp: boolean;
};

export function getPathDefinition(path: Path) {
  return pathDefinitions.find((definition) => definition.id === path);
}

export function formatPathLabel(path: Path) {
  const definition = getPathDefinition(path);

  if (definition) {
    return definition.label;
  }

  return path
    .split('_')
    .join(' ')
    .replace(/\b\w/g, (character: string) => character.toUpperCase());
}

export function formatUserFacingText(text: string) {
  return pathDefinitions.reduce((formattedText, definition) => {
    const pattern = new RegExp(definition.id, 'g');

    return formattedText.replace(pattern, definition.label);
  }, text);
}

export function formatDecisionType(decisionType: "gate" | "score") {
  return decisionType === "gate" ? 'Gate recommendation' : 'Score-based recommendation';
}

export function formatConfidenceLabel(confidence: Confidence) {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1);
}

export function getConfidenceSupportingCopy(confidence: Confidence) {
  switch (confidence) {
    case "low":
      return "This result is close. The runner-up path may also be appropriate depending on how your needs evolve.";
    case "medium":
      return "This recommendation has a meaningful lead, but the runner-up still reflects nearby tradeoffs.";
    case "high":
      return "This recommendation has a clear lead over the alternatives.";
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
      : "This path has a clear lead with no meaningful runner-up.";
  }

  const runnerUpLabel = formatPathLabel(result.explanation.runnerUp.path);

  if (leadDelta === 0) {
    return `It ties ${runnerUpLabel}.`;
  }

  return `It leads ${runnerUpLabel} by ${formatPointDelta(leadDelta)}.`;
}

function getRecommendedPathContribution(
  rule: AppliedRule,
  recommendation: Path
) {
  return rule.scores?.[recommendation];
}

function canSortFactorsByContribution(
  appliedRules: AppliedRule[],
  recommendation: Path
) {
  if (appliedRules.length === 0) {
    return false;
  }

  return appliedRules.every((rule) => {
    if (!rule.scores) {
      return false;
    }

    const contribution = getRecommendedPathContribution(rule, recommendation);

    return typeof contribution === "number";
  });
}

export function sortAppliedRulesForDisplay(
  appliedRules: AppliedRule[],
  recommendation: Path
) {
  if (!canSortFactorsByContribution(appliedRules, recommendation)) {
    return appliedRules;
  }

  return [...appliedRules].sort((left, right) => {
    const leftContribution = Math.abs(
      getRecommendedPathContribution(left, recommendation) ?? 0
    );
    const rightContribution = Math.abs(
      getRecommendedPathContribution(right, recommendation) ?? 0
    );

    return rightContribution - leftContribution;
  });
}

export function getVisibleFactors(
  appliedRules: AppliedRule[],
  recommendation: Path
) {
  return sortAppliedRulesForDisplay(appliedRules, recommendation).slice(0, 3);
}

export function getHiddenFactors(
  appliedRules: AppliedRule[],
  recommendation: Path
) {
  return sortAppliedRulesForDisplay(appliedRules, recommendation).slice(3);
}

export function getViewAllFactorsLabel(factorCount: number, expanded = false) {
  if (expanded) {
    return 'Hide additional factors';
  }

  if (factorCount <= 1) {
    return 'Show 1 more factor';
  }

  return `Show ${factorCount} more factors`;
}

export function getRankedScoreComparisonRows(
  result: DecisionResult
): ScoreComparisonRow[] {
  const rankedPaths =
    result.rankedPaths.length > 0
      ? [...result.rankedPaths]
      : Object.entries(result.scores)
          .sort((left, right) => right[1] - left[1])
          .map(([path]) => path as Path);
  const positiveScores = rankedPaths.map((path) => Math.max(0, result.scores[path]));
  const maxPositiveScore = Math.max(...positiveScores, 1);

  return rankedPaths.map((path, index) => {
    const definition = getPathDefinition(path);
    const score = result.scores[path];

    return {
      path,
      label: definition?.label ?? formatPathLabel(path),
      description: definition?.summary ?? formatPathLabel(path),
      score,
      normalizedScore: (Math.max(0, score) / maxPositiveScore) * 100,
      isRecommended: path === result.recommendation,
      isRunnerUp: index === 1
    };
  });
}

export function shouldShowLowScoreComparisonCopy(
  rows: ScoreComparisonRow[]
) {
  return rows.every((row) => row.score <= 0);
}
