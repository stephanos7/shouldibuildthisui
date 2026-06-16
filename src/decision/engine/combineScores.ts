import type { AppliedRule } from '../types/DecisionResult';
import type { Path } from '../types/Path';

const PATHS: Path[] = ['build_it_yourself', 'mui_core', 'mui_x_premium', 'mui_x_enterprise'];

export function combineScores(appliedRules: AppliedRule[]): Record<Path, number> {
  const totals: Record<Path, number> = {
    build_it_yourself: 0,
    mui_core: 0,
    mui_x_premium: 0,
    mui_x_enterprise: 0
  };

  for (const rule of appliedRules) {
    if (!rule.scores) {
      continue;
    }

    for (const path of PATHS) {
      totals[path] += rule.scores[path] ?? 0;
    }
  }

  return totals;
}
