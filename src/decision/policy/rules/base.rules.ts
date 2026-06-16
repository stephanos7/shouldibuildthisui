import type { ScoredRule } from '../../types/Policy';

export const baseRules = [
  {
    id: 'horizon-prototype-low-investment',
    label: 'Prototype horizon',
    intent: 'Favor direct implementation when the ownership horizon is very short.',
    reason: 'Prototype work usually does not justify adopting a broader UI platform.',
    enabled: true,
    editable: true,
    conditions: [{ field: 'ownershipHorizon', operator: 'equals', value: 'prototype' }],
    scores: {
      build_it_yourself: 2
    }
  },
  {
    id: 'horizon-short-term-limited-investment',
    label: 'Short-term horizon',
    intent: 'Keep a small signal toward lower-overhead choices for short-lived work.',
    reason: 'Short-term ownership reduces the value of heavier long-term UI investment.',
    enabled: true,
    editable: true,
    conditions: [{ field: 'ownershipHorizon', operator: 'equals', value: 'short_term' }],
    scores: {
      build_it_yourself: 1
    }
  },
  {
    id: 'scope-single-team-local-choice',
    label: 'Single team scope',
    intent: 'Recognize when a solution can stay local to one team.',
    reason: 'A single team can often move effectively without cross-team platform coordination.',
    enabled: true,
    editable: true,
    conditions: [{ field: 'teamCount', operator: 'equals', value: '1' }],
    scores: {
      build_it_yourself: 1
    }
  },
  {
    id: 'scale-many-teams-governance-pressure',
    label: 'Many teams',
    intent: 'Capture weak governance pressure from broader team adoption.',
    reason: 'More teams increase the value of shared standards and supported components.',
    enabled: true,
    editable: true,
    conditions: [{ field: 'teamCount', operator: 'in', value: ['4_7', '8_plus'] }],
    scores: {
      mui_core: 1,
      mui_x_premium: 1,
      mui_x_enterprise: 1
    }
  },
  {
    id: 'scale-multi-app-shared-foundation',
    label: 'Multiple React apps',
    intent: 'Capture weak pressure toward reuse across several applications.',
    reason: 'A broader app portfolio increases the value of reusable UI foundations.',
    enabled: true,
    editable: true,
    conditions: [{ field: 'reactAppCount', operator: 'in', value: ['5_10', '11_plus'] }],
    scores: {
      mui_core: 1,
      mui_x_premium: 1,
      mui_x_enterprise: 1
    }
  },
  {
    id: 'design-standardization-cross-app',
    label: 'Cross-app consistency',
    intent: 'Reward a deliberate move toward shared UI consistency.',
    reason: 'Cross-app consistency increases the value of a reusable component foundation.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'standardizationIntent',
        operator: 'equals',
        value: 'cross_app_consistency'
      }
    ],
    scores: {
      mui_core: 2,
      mui_x_premium: 1
    }
  },
  {
    id: 'design-standardization-org-wide',
    label: 'Org-wide platform intent',
    intent: 'Capture stronger organizational standardization goals.',
    reason: 'Org-wide UI standardization increases the value of supported platform choices.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'standardizationIntent',
        operator: 'equals',
        value: 'org_wide_platform'
      }
    ],
    scores: {
      mui_x_premium: 1,
      mui_x_enterprise: 2
    }
  },
  {
    id: 'design-system-centralized-foundation',
    label: 'Centralized design system',
    intent: 'Recognize an existing centralized UI operating model.',
    reason: 'A centralized design system benefits from a stronger shared UI foundation.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'designSystemMaturity',
        operator: 'equals',
        value: 'centralized'
      }
    ],
    scores: {
      mui_core: 1,
      mui_x_premium: 1,
      mui_x_enterprise: 2
    }
  },
  {
    id: 'maintainability-knowledge-concentration',
    label: 'Concentrated UI knowledge',
    intent: 'Capture weak maintainability risk from narrow UI ownership.',
    reason: 'When UI knowledge is concentrated, standardization becomes more valuable.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'uiKnowledgeDistribution',
        operator: 'in',
        value: ['few_specialists', 'single_point']
      }
    ],
    scores: {
      mui_core: 1,
      mui_x_premium: 1
    }
  },
  {
    id: 'advanced-ui-advanced-grid-needs',
    label: 'Advanced grids',
    intent: 'Recognize advanced grid requirements as a standalone signal.',
    reason: 'Advanced grids increase the value of richer prebuilt data capabilities.',
    enabled: true,
    editable: true,
    conditions: [{ field: 'dataGridComplexity', operator: 'equals', value: 'advanced_grids' }],
    scores: {
      mui_x_premium: 2
    }
  },
  {
    id: 'advanced-ui-mission-critical-grid-needs',
    label: 'Mission-critical grids',
    intent: 'Recognize the strongest standalone grid requirement.',
    reason:
      'Mission-critical grids increase the value of robust advanced data capabilities and support.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'dataGridComplexity',
        operator: 'equals',
        value: 'mission_critical_grids'
      }
    ],
    scores: {
      mui_x_premium: 1,
      mui_x_enterprise: 2
    }
  },
  {
    id: 'quality-regulated-accessibility',
    label: 'Regulated accessibility requirements',
    intent: 'Capture stronger quality and compliance expectations.',
    reason: 'Regulated accessibility raises the value of mature, supported UI infrastructure.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'accessibilityCriticality',
        operator: 'equals',
        value: 'regulated_or_mandatory'
      }
    ],
    scores: {
      mui_x_enterprise: 2
    }
  },
  {
    id: 'quality-operational-criticality',
    label: 'Operational criticality',
    intent: 'Recognize a standalone signal for high-risk application contexts.',
    reason: 'Operationally critical applications increase the value of support and standardization.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'applicationCriticality',
        operator: 'equals',
        value: 'regulated_or_operationally_critical'
      }
    ],
    scores: {
      mui_x_premium: 1,
      mui_x_enterprise: 2
    }
  },
  {
    id: 'support-priority-needs',
    label: 'Priority support',
    intent: 'Capture moderate support expectations.',
    reason: 'Priority support needs make premium or enterprise packages more attractive.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'supportExpectation',
        operator: 'equals',
        value: 'priority_support'
      }
    ],
    scores: {
      mui_x_premium: 1,
      mui_x_enterprise: 1
    }
  },
  {
    id: 'support-enterprise-needs',
    label: 'Enterprise support demand',
    intent: 'Recognize the strongest standalone support expectation.',
    reason: 'Enterprise support expectations increase the value of enterprise packaging.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'supportExpectation',
        operator: 'equals',
        value: 'enterprise_support'
      }
    ],
    scores: {
      mui_x_enterprise: 2
    }
  },
  {
    id: 'delivery-fixed-deadline-pressure',
    label: 'Fixed deadline',
    intent: 'Capture weak pressure toward lower implementation risk.',
    reason: 'Fixed deadlines increase the value of proven UI building blocks.',
    enabled: true,
    editable: true,
    conditions: [{ field: 'deliveryUrgency', operator: 'equals', value: 'fixed_deadline' }],
    scores: {
      mui_core: 1,
      mui_x_premium: 1
    }
  }
] satisfies ScoredRule[];
