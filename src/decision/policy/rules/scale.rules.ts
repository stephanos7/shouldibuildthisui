import type { ScoredRule } from '../../types/Policy';

export const scaleInteractionRules = [
  {
    id: 'scale-moderate-team-narrow-scope',
    label: 'Moderate team and narrow scope',
    intent: 'Favor a lighter shared foundation when the team is growing but scope is still narrow.',
    reason: 'A moderate team with a narrow React footprint often benefits from MUI Core over heavier options.',
    conditions: [
      { field: 'teamCount', operator: 'equals', value: '2_3' },
      { field: 'reactAppCount', operator: 'in', value: ['1', '2_4'] },
      {
        field: 'standardizationIntent',
        operator: 'in',
        value: ['local_consistency', 'cross_app_consistency']
      }
    ],
    scores: {
      mui_core: 3
    }
  },
  {
    id: 'scale-multi-team-multi-app',
    label: 'Multiple teams and multiple apps',
    intent: 'Identify organizational scale where broader governance becomes valuable.',
    reason: 'Multiple teams and apps increase the value of shared standards, advanced capabilities, and support.',
    conditions: [
      { field: 'teamCount', operator: 'in', value: ['4_7', '8_plus'] },
      { field: 'reactAppCount', operator: 'in', value: ['5_10', '11_plus'] }
    ],
    scores: {
      mui_x_premium: 2,
      mui_x_enterprise: 2
    }
  },
  {
    id: 'scale-enterprise-support-broad-rollout',
    label: 'Enterprise support with broad rollout',
    intent: 'Recommend enterprise packaging when support expectations meet wide adoption.',
    reason: 'Broad rollout paired with enterprise support expectations strongly favors enterprise packaging.',
    conditions: [
      {
        field: 'supportExpectation',
        operator: 'equals',
        value: 'enterprise_support'
      },
      { field: 'teamCount', operator: 'in', value: ['4_7', '8_plus'] },
      { field: 'reactAppCount', operator: 'in', value: ['5_10', '11_plus'] }
    ],
    scores: {
      mui_x_enterprise: 5
    }
  }
] satisfies ScoredRule[];
