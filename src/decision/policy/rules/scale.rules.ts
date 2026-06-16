import type { ScoredRule } from '../../types/Policy';

export const scaleInteractionRules = [
  {
    id: 'scale-large-frontend-narrow-scope',
    label: 'Large frontend population with narrow scope',
    intent: 'Prevent frontend developer count alone from escalating recommendations when scope stays local.',
    reason: 'A large frontend population does not justify a heavier platform when the work remains narrowly scoped.',
    enabled: true,
    editable: true,
    conditions: [
      { field: 'frontendDeveloperCount', operator: 'in', value: ['10_19', '20_49', '50_plus'] },
      { field: 'teamCount', operator: 'equals', value: '1' },
      { field: 'reactAppCount', operator: 'equals', value: '1' },
      { field: 'dataGridComplexity', operator: 'in', value: ['none', 'simple_tables'] }
    ],
    scores: {
      build_it_yourself: 2,
      mui_core: 1
    }
  },
  {
    id: 'scale-moderate-team-narrow-scope',
    label: 'Moderate team and narrow scope',
    intent: 'Favor a lighter shared foundation when the team is growing but scope is still narrow.',
    reason: 'A moderate team with a narrow React footprint often benefits from MUI Core over heavier options.',
    enabled: true,
    editable: true,
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
    id: 'scale-large-frontend-broad-rollout',
    label: 'Large frontend population with broad rollout',
    intent: 'Recognize when a large frontend population amplifies broader rollout pressure.',
    reason: 'A large frontend population across many teams and apps increases the value of stronger shared foundations.',
    enabled: true,
    editable: true,
    conditions: [
      { field: 'frontendDeveloperCount', operator: 'in', value: ['20_49', '50_plus'] },
      { field: 'teamCount', operator: 'in', value: ['4_7', '8_plus'] },
      { field: 'reactAppCount', operator: 'in', value: ['5_10', '11_plus'] }
    ],
    scores: {
      mui_x_premium: 1,
      mui_x_enterprise: 1
    }
  },
  {
    id: 'scale-multi-team-multi-app',
    label: 'Multiple teams and multiple apps',
    intent: 'Identify organizational scale where broader governance becomes valuable.',
    reason: 'Multiple teams and apps increase the value of shared standards, advanced capabilities, and support.',
    enabled: true,
    editable: true,
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
    enabled: true,
    editable: true,
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
