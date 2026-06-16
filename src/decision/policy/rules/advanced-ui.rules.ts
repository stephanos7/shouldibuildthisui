import type { ScoredRule } from '../../types/Policy';

export const advancedUiInteractionRules = [
  {
    id: 'advanced-ui-small-team-advanced-grids',
    label: 'Small or moderate team with advanced grids',
    intent: 'Recognize when advanced data needs outweigh smaller organizational scale.',
    reason: 'Even smaller teams can justify premium tooling when they rely on advanced grids.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'teamCount',
        operator: 'in',
        value: ['1', '2_3', '4_7']
      },
      {
        field: 'dataGridComplexity',
        operator: 'equals',
        value: 'advanced_grids'
      }
    ],
    scores: {
      mui_x_premium: 4
    }
  },
  {
    id: 'advanced-ui-mission-critical-grid-enterprise-support',
    label: 'Mission-critical grids with enterprise support',
    intent: 'Escalate to enterprise when the hardest data workflows also require top-tier support.',
    reason: 'Mission-critical grids paired with enterprise support needs strongly favor an enterprise package.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'dataGridComplexity',
        operator: 'equals',
        value: 'mission_critical_grids'
      },
      {
        field: 'supportExpectation',
        operator: 'equals',
        value: 'enterprise_support'
      }
    ],
    scores: {
      mui_x_premium: 1,
      mui_x_enterprise: 5
    }
  }
] satisfies ScoredRule[];
