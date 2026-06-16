import type { ScoredRule } from '../../types/Policy';

export const maintainabilityInteractionRules = [
  {
    id: 'maintainability-knowledge-concentration-long-horizon',
    label: 'Concentrated UI knowledge with long ownership horizon',
    intent: 'Push toward stronger standardization when narrow ownership must last.',
    reason: 'Long-lived products with concentrated UI knowledge benefit from reducing person-dependent implementation risk.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'uiKnowledgeDistribution',
        operator: 'in',
        value: ['few_specialists', 'single_point']
      },
      {
        field: 'ownershipHorizon',
        operator: 'in',
        value: ['long_term', 'platform_investment']
      }
    ],
    scores: {
      mui_core: 2,
      mui_x_premium: 2
    }
  },
  {
    id: 'maintainability-frequent-regressions-long-lead-time',
    label: 'Frequent regressions and long lead time',
    intent: 'Recognize a maintainability signal that favors stronger supported foundations.',
    reason: 'Frequent regressions combined with slow UI change cycles increase the value of mature reusable components.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'uiRegressionFrequency',
        operator: 'in',
        value: ['frequent', 'constant']
      },
      { field: 'changeLeadTime', operator: 'in', value: ['weeks', 'months'] }
    ],
    scores: {
      mui_x_premium: 2,
      mui_x_enterprise: 3
    }
  }
] satisfies ScoredRule[];
