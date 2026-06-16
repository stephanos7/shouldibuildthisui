import { describe, expect, it } from 'vitest';
import { decide } from '../decide';
import type { DecisionFacts } from '../../types/DecisionFacts';
import type { Policy } from '../../types/Policy';

const fixturePolicy: Policy = {
  version: 'test-policy-v1',
  gates: [
    {
      id: 'gate-simple-prototype',
      label: 'Simple prototype',
      intent: 'Short-circuit a low-risk internal prototype.',
      reason: 'The input represents a narrow internal prototype with low support needs.',
      editable: false,
      recommendation: 'build_it_yourself',
      conditions: [
        { field: 'ownershipHorizon', operator: 'equals', value: 'prototype' },
        { field: 'applicationCriticality', operator: 'equals', value: 'internal_tool' }
      ]
    }
  ],
  baseRules: [
    {
      id: 'base-advanced-grid',
      label: 'Advanced grid needs',
      intent: 'Recognize advanced grid requirements.',
      reason: 'Advanced grid requirements make premium data grid capabilities more valuable.',
      enabled: true,
      editable: true,
      conditions: [{ field: 'dataGridComplexity', operator: 'equals', value: 'advanced_grids' }],
      scores: {
        mui_x_premium: 2
      }
    },
    {
      id: 'base-standardization',
      label: 'Cross-app standardization',
      intent: 'Reward shared standards across apps.',
      reason: 'Cross-app consistency increases the value of a shared component foundation.',
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
        mui_core: 1,
        mui_x_premium: 1
      }
    },
    {
      id: 'base-enterprise-support',
      label: 'Enterprise support demand',
      intent: 'Capture higher support requirements.',
      reason: 'Enterprise support requirements increase the value of enterprise packaging.',
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
    }
  ],
  interactionRules: [
    {
      id: 'interaction-grid-scale',
      label: 'Advanced grids at scale',
      intent: 'Combine advanced data grid needs with broader adoption.',
      reason: 'Advanced grids used across several teams push the recommendation toward premium.',
      enabled: true,
      editable: true,
      conditions: [
        { field: 'dataGridComplexity', operator: 'equals', value: 'advanced_grids' },
        { field: 'teamCount', operator: 'in', value: ['4_7', '8_plus'] }
      ],
      scores: {
        mui_x_premium: 3
      }
    },
    {
      id: 'interaction-scale-governance',
      label: 'Scaled governance needs',
      intent: 'Capture broader organizational governance pressure.',
      reason: 'Multiple teams and enterprise support needs increase the value of stronger governance.',
      enabled: true,
      editable: true,
      conditions: [
        { field: 'teamCount', operator: 'in', value: ['4_7', '8_plus'] },
        {
          field: 'supportExpectation',
          operator: 'equals',
          value: 'enterprise_support'
        }
      ],
      scores: {
        mui_x_enterprise: 3
      }
    }
  ]
};

const scoredFacts: DecisionFacts = {
  frontendDeveloperCount: '20_49',
  teamCount: '4_7',
  reactAppCount: '5_10',
  designSystemMaturity: 'established',
  uiKnowledgeDistribution: 'some_specialists',
  designEngineeringFriction: 'high',
  standardizationIntent: 'cross_app_consistency',
  dataGridComplexity: 'advanced_grids',
  performanceCriticality: 'high',
  accessibilityCriticality: 'high',
  changeLeadTime: 'weeks',
  uiRegressionFrequency: 'frequent',
  deliveryUrgency: 'high',
  applicationCriticality: 'customer_facing',
  supportExpectation: 'standard_support',
  ownershipHorizon: 'long_term'
};

const gateFacts: DecisionFacts = {
  frontendDeveloperCount: '1_9',
  teamCount: '1',
  reactAppCount: '1',
  designSystemMaturity: 'none',
  uiKnowledgeDistribution: 'distributed',
  designEngineeringFriction: 'low',
  standardizationIntent: 'none',
  dataGridComplexity: 'none',
  performanceCriticality: 'low',
  accessibilityCriticality: 'low',
  changeLeadTime: 'same_day',
  uiRegressionFrequency: 'rare',
  deliveryUrgency: 'low',
  applicationCriticality: 'internal_tool',
  supportExpectation: 'self_serve',
  ownershipHorizon: 'prototype'
};

describe('decide', () => {
  it('returns a complete scored decision result', () => {
    const result = decide(scoredFacts, fixturePolicy);

    expect(result.decisionType).toBe('score');
    expect(result.policyVersion).toBe('test-policy-v1');
    expect(result.facts).toEqual(scoredFacts);
    expect(result.recommendation).toBe('mui_x_premium');
    expect(result.rankedPaths).toEqual([
      'mui_x_premium',
      'mui_core',
      'build_it_yourself',
      'mui_x_enterprise'
    ]);
    expect(result.scores).toEqual({
      build_it_yourself: 0,
      mui_core: 1,
      mui_x_premium: 6,
      mui_x_enterprise: 0
    });
    expect(result.confidence).toBe('high');
    expect(result.appliedRules.map((rule) => rule.ruleId)).toEqual([
      'base-advanced-grid',
      'base-standardization',
      'interaction-grid-scale'
    ]);
    expect(result.explanation.recommendationReasons).toContain(
      'Advanced grid requirements make premium data grid capabilities more valuable.'
    );
    expect(result.explanation.runnerUp).toBeUndefined();
  });

  it('short-circuits to a gate result when a gate matches', () => {
    const result = decide(gateFacts, fixturePolicy);

    expect(result.decisionType).toBe('gate');
    expect(result.recommendation).toBe('build_it_yourself');
    expect(result.scores).toEqual({
      build_it_yourself: 0,
      mui_core: 0,
      mui_x_premium: 0,
      mui_x_enterprise: 0
    });
    expect(result.appliedRules).toHaveLength(1);
    expect(result.appliedRules[0]).toMatchObject({
      ruleId: 'gate-simple-prototype',
      ruleType: 'gate'
    });
    expect(result.explanation.summary).toContain('gate');
  });

  it('uses deterministic tie-breaking and low confidence for a one-point margin', () => {
    const lowMarginFacts: DecisionFacts = {
      ...scoredFacts,
      teamCount: '2_3',
      supportExpectation: 'enterprise_support'
    };
    const result = decide(lowMarginFacts, fixturePolicy);

    expect(result.rankedPaths).toEqual([
      'mui_x_premium',
      'mui_x_enterprise',
      'mui_core',
      'build_it_yourself'
    ]);
    expect(result.scores.mui_x_premium).toBe(3);
    expect(result.scores.mui_x_enterprise).toBe(2);
    expect(result.confidence).toBe('low');
    expect(result.explanation.runnerUp).toEqual({
      path: 'mui_x_enterprise',
      scoreDelta: 1,
      reasons: ['Enterprise support requirements increase the value of enterprise packaging.']
    });
  });
});
