import type { Policy } from '../types/Policy';
import { advancedUiInteractionRules } from './rules/advanced-ui.rules';
import { baseRules } from './rules/base.rules';
import { deliveryInteractionRules } from './rules/delivery.rules';
import { designSystemInteractionRules } from './rules/design-system.rules';
import { gateRules } from './rules/gate.rules';
import { maintainabilityInteractionRules } from './rules/maintainability.rules';
import { qualityRiskInteractionRules } from './rules/quality-risk.rules';
import { scaleInteractionRules } from './rules/scale.rules';

export { pathDefinitions } from './pathDefinitions';

export const recommendationPolicy: Policy = {
  version: 'initial-production-policy-v1',
  gates: gateRules,
  baseRules,
  interactionRules: [
    ...scaleInteractionRules,
    ...designSystemInteractionRules,
    ...maintainabilityInteractionRules,
    ...advancedUiInteractionRules,
    ...qualityRiskInteractionRules,
    ...deliveryInteractionRules
  ]
};
