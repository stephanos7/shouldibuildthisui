import type { Confidence } from '../types/DecisionResult';
import type { Path } from '../types/Path';

export function calculateConfidence(
  rankedPaths: Path[],
  scores: Record<Path, number>
): Confidence {
  const topPath = rankedPaths[0];
  const runnerUpPath = rankedPaths[1];
  const margin = scores[topPath] - scores[runnerUpPath];

  if (margin >= 5) {
    return 'high';
  }

  if (margin >= 2) {
    return 'medium';
  }

  return 'low';
}
