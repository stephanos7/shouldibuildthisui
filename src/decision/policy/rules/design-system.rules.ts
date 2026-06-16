import type { ScoredRule } from '../../types/Policy';

export const designSystemInteractionRules = [
  {
    id: 'design-system-centralized-org-wide-standardization',
    label: 'Centralized design system and org-wide standardization',
    intent: 'Identify cases where platform governance is an explicit organizational goal.',
    reason: 'A centralized design system with org-wide standardization needs increases the value of enterprise coordination.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'designSystemMaturity',
        operator: 'equals',
        value: 'centralized'
      },
      {
        field: 'standardizationIntent',
        operator: 'equals',
        value: 'org_wide_platform'
      }
    ],
    scores: {
      mui_x_enterprise: 4
    }
  }
] satisfies ScoredRule[];
