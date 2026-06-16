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
    id: 'advanced-ui-performance-sensitive-grids',
    label: 'Performance-sensitive advanced grids',
    intent: 'Strengthen premium recommendations when advanced data experiences also carry higher performance demands.',
    reason: 'Advanced grids with higher performance requirements increase the value of richer prebuilt UI capabilities.',
    enabled: true,
    editable: true,
    conditions: [
      { field: 'dataGridComplexity', operator: 'equals', value: 'advanced_grids' },
      { field: 'performanceCriticality', operator: 'in', value: ['high', 'critical'] }
    ],
    scores: {
      mui_x_premium: 2
    }
  },
  {
    id: 'advanced-ui-critical-performance-mission-critical-grids',
    label: 'Mission-critical grids with critical performance demands',
    intent: 'Escalate to stronger enterprise support when the hardest grid workflows must also meet the strictest performance bar.',
    reason: 'Mission-critical grid workflows with critical performance demands increase the value of enterprise-grade capabilities and support.',
    enabled: true,
    editable: true,
    conditions: [
      { field: 'dataGridComplexity', operator: 'equals', value: 'mission_critical_grids' },
      { field: 'performanceCriticality', operator: 'equals', value: 'critical' }
    ],
    scores: {
      mui_x_premium: 1,
      mui_x_enterprise: 3
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
