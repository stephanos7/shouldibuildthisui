import type { ScoredRule } from '../../types/Policy';

export const designSystemInteractionRules = [
  {
    id: 'design-system-friction-cross-app-standardization',
    label: 'Workflow friction with cross-app standardization',
    intent: 'Strengthen shared-platform recommendations when cross-app consistency work is slowed by workflow friction.',
    reason: 'High design and engineering friction increases the value of a shared foundation when teams are aligning across apps.',
    enabled: true,
    editable: true,
    conditions: [
      { field: 'designEngineeringFriction', operator: 'in', value: ['high', 'severe'] },
      { field: 'standardizationIntent', operator: 'equals', value: 'cross_app_consistency' },
      { field: 'reactAppCount', operator: 'in', value: ['2_4', '5_10', '11_plus'] }
    ],
    scores: {
      mui_core: 2,
      mui_x_premium: 1
    }
  },
  {
    id: 'design-system-friction-org-wide-platform',
    label: 'Workflow friction with org-wide platform intent',
    intent: 'Recognize when platform-level standardization is made more valuable by severe workflow friction.',
    reason: 'High friction combined with org-wide platform intent increases the value of stronger shared governance and support.',
    enabled: true,
    editable: true,
    conditions: [
      { field: 'designEngineeringFriction', operator: 'in', value: ['high', 'severe'] },
      { field: 'standardizationIntent', operator: 'equals', value: 'org_wide_platform' },
      { field: 'designSystemMaturity', operator: 'in', value: ['established', 'centralized'] }
    ],
    scores: {
      mui_x_premium: 1,
      mui_x_enterprise: 3
    }
  },
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
