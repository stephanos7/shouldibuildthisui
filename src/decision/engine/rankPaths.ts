import type { Path } from '../types/Path';

const PATH_ORDER: Path[] = ['build_it_yourself', 'mui_core', 'mui_x_premium', 'mui_x_enterprise'];

export function rankPaths(scores: Record<Path, number>): Path[] {
  return [...PATH_ORDER].sort((left, right) => {
    const scoreDelta = scores[right] - scores[left];

    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return PATH_ORDER.indexOf(left) - PATH_ORDER.indexOf(right);
  });
}
