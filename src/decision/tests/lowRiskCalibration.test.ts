import { describe, expect, it } from 'vitest';
import { decide } from '../engine/decide';
import { recommendationPolicy } from '../policy/recommendationPolicy';
import type { DecisionFacts } from '../types/DecisionFacts';

const extractedPdfFacts: DecisionFacts = {
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
  ownershipHorizon: 'long_term'
};

describe('low-risk calibration', () => {
  it('builds a stronger score-based recommendation for the extracted PDF profile', () => {
    const result = decide(extractedPdfFacts, recommendationPolicy);

    expect(result.decisionType).toBe('score');
    expect(result.recommendation).toBe('build_it_yourself');
    expect(result.scores).toEqual({
      build_it_yourself: 5,
      mui_core: 0,
      mui_x_premium: 0,
      mui_x_enterprise: 0
    });
    expect(result.confidence).toBe('high');
    expect(result.appliedRules.map((rule) => rule.ruleId)).toEqual([
      'scope-single-team-local-choice',
      'scale-single-team-single-app-light-scope',
      'maintainability-low-friction-fast-stable',
      'quality-risk-low-criticality-low-burden'
    ]);
    expect(result.explanation.runnerUp).toBeUndefined();
    expect(result.explanation.summary).toBe(
      'Recommended build_it_yourself with a clear lead and no competing positive scores.'
    );
  });

  it('preserves the existing prototype gate for a narrow internal tool', () => {
    const result = decide(
      {
        ...extractedPdfFacts,
        ownershipHorizon: 'prototype'
      },
      recommendationPolicy
    );

    expect(result.decisionType).toBe('gate');
    expect(result.recommendation).toBe('build_it_yourself');
    expect(result.appliedRules).toHaveLength(1);
    expect(result.appliedRules[0].ruleId).toBe('gate-prototype-simple-internal-tool');
  });

  it('keeps long-term narrow shared work on the score-based path', () => {
    const result = decide(extractedPdfFacts, recommendationPolicy);

    expect(result.decisionType).toBe('score');
    expect(result.explanation.recommendationReasons).toHaveLength(4);
  });

  it('does not overpower the existing MUI Core narrow shared-foundation case', () => {
    const result = decide(
      {
        ...extractedPdfFacts,
        teamCount: '2_3',
        reactAppCount: '2_4',
        standardizationIntent: 'local_consistency',
        supportExpectation: 'standard_support',
        applicationCriticality: 'customer_facing'
      },
      recommendationPolicy
    );

    expect(result.recommendation).toBe('mui_core');
    expect(result.scores.mui_core).toBeGreaterThan(result.scores.build_it_yourself);
  });

  it('only exposes a runner-up when another path has a positive competitive score', () => {
    const noRunnerUpResult = decide(extractedPdfFacts, recommendationPolicy);
    const runnerUpResult = decide(
      {
        ...extractedPdfFacts,
        frontendDeveloperCount: '10_19',
        teamCount: '2_3',
        reactAppCount: '2_4',
        designSystemMaturity: 'early',
        designEngineeringFriction: 'medium',
        standardizationIntent: 'org_wide_platform',
        dataGridComplexity: 'simple_tables',
        performanceCriticality: 'medium',
        accessibilityCriticality: 'medium',
        changeLeadTime: 'days',
        uiRegressionFrequency: 'occasional',
        deliveryUrgency: 'medium',
        supportExpectation: 'standard_support',
        applicationCriticality: 'customer_facing'
      },
      recommendationPolicy
    );

    expect(noRunnerUpResult.explanation.runnerUp).toBeUndefined();
    expect(runnerUpResult.explanation.runnerUp).toMatchObject({
      path: 'mui_x_enterprise',
      scoreDelta: 1
    });
  });
});
