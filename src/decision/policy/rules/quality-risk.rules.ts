import type { ScoredRule } from '../../types/Policy';

export const qualityRiskInteractionRules = [
  {
    id: 'quality-risk-low-criticality-low-burden',
    label: 'Low criticality and low quality burden',
    intent: 'Capture low-risk contexts where direct implementation remains appropriate.',
    reason:
      'Internal tools with low accessibility pressure and low performance criticality usually do not justify heavier UI platform choices.',
    enabled: true,
    editable: true,
    conditions: [
      { field: 'applicationCriticality', operator: 'equals', value: 'internal_tool' },
      { field: 'accessibilityCriticality', operator: 'equals', value: 'low' },
      { field: 'performanceCriticality', operator: 'equals', value: 'low' }
    ],
    scores: {
      build_it_yourself: 1
    }
  },
  {
    id: 'quality-risk-fixed-deadline-regression-risk',
    label: 'Fixed deadline with regression risk',
    intent: 'Favor safer delivery choices when teams are under deadline pressure and already unstable.',
    reason: 'Regression-prone UI work under a fixed deadline increases the value of proven prebuilt components.',
    enabled: true,
    editable: true,
    conditions: [
      { field: 'deliveryUrgency', operator: 'equals', value: 'fixed_deadline' },
      {
        field: 'uiRegressionFrequency',
        operator: 'in',
        value: ['frequent', 'constant']
      }
    ],
    scores: {
      mui_core: 2,
      mui_x_premium: 2
    }
  },
  {
    id: 'quality-risk-regulated-operationally-critical-app',
    label: 'Regulated or operationally critical app',
    intent: 'Identify high-risk applications where support and governance become materially more valuable.',
    reason: 'Operationally critical or regulated apps justify stronger support, consistency, and enterprise controls.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'applicationCriticality',
        operator: 'equals',
        value: 'regulated_or_operationally_critical'
      },
      {
        field: 'accessibilityCriticality',
        operator: 'in',
        value: ['high', 'regulated_or_mandatory']
      }
    ],
    scores: {
      mui_x_enterprise: 4
    }
  }
] satisfies ScoredRule[];
