import { pathDefinitions } from '../../decision/policy/pathDefinitions';
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
