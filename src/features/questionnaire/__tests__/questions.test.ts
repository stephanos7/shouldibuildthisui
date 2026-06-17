import { describe, expect, it } from 'vitest';
import type { DecisionFacts } from '../../../decision/types/DecisionFacts';
import { questions } from '../questions';

const expectedOptionValuesByQuestionId = {
  frontendDeveloperCount: ['1_9', '10_19', '20_49', '50_plus'],
  teamCount: ['1', '2_3', '4_7', '8_plus'],
  reactAppCount: ['1', '2_4', '5_10', '11_plus'],
  designSystemMaturity: ['none', 'early', 'established', 'centralized'],
  designEngineeringFriction: ['low', 'medium', 'high', 'severe'],
  standardizationIntent: ['none', 'local_consistency', 'cross_app_consistency', 'org_wide_platform'],
  uiKnowledgeDistribution: ['distributed', 'some_specialists', 'few_specialists', 'single_point'],
  changeLeadTime: ['same_day', 'days', 'weeks', 'months'],
  uiRegressionFrequency: ['rare', 'occasional', 'frequent', 'constant'],
  ownershipHorizon: ['prototype', 'short_term', 'long_term', 'platform_investment'],
  dataGridComplexity: ['none', 'simple_tables', 'advanced_grids', 'mission_critical_grids'],
  performanceCriticality: ['low', 'medium', 'high', 'critical'],
  accessibilityCriticality: ['low', 'medium', 'high', 'regulated_or_mandatory'],
  applicationCriticality: [
    'internal_tool',
    'customer_facing',
    'revenue_critical',
    'regulated_or_operationally_critical'
  ],
  supportExpectation: ['self_serve', 'standard_support', 'priority_support', 'enterprise_support'],
  deliveryUrgency: ['low', 'medium', 'high', 'fixed_deadline']
} satisfies Record<keyof DecisionFacts, readonly string[]>;

describe('questions', () => {
  it('represents every DecisionFacts field exactly once', () => {
    const decisionFactKeys = Object.keys({
      frontendDeveloperCount: true,
      teamCount: true,
      reactAppCount: true,
      designSystemMaturity: true,
      uiKnowledgeDistribution: true,
      designEngineeringFriction: true,
      standardizationIntent: true,
      dataGridComplexity: true,
      performanceCriticality: true,
      accessibilityCriticality: true,
      changeLeadTime: true,
      uiRegressionFrequency: true,
      deliveryUrgency: true,
      applicationCriticality: true,
      supportExpectation: true,
      ownershipHorizon: true
    } satisfies Record<keyof DecisionFacts, true>);

    const questionIds = questions.map((question) => question.id);
    const uniqueQuestionIds = new Set(questionIds);

    expect(questionIds).toHaveLength(decisionFactKeys.length);
    expect(uniqueQuestionIds.size).toBe(decisionFactKeys.length);
    expect([...uniqueQuestionIds].sort()).toEqual(decisionFactKeys.sort());
  });

  it('contains only UI metadata', () => {
    for (const question of questions) {
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('section');
      expect(question).toHaveProperty('label');
      expect(question).toHaveProperty('component');
      expect(question).toHaveProperty('options');
      expect(question).not.toHaveProperty('score');
      expect(question).not.toHaveProperty('path');
      expect(question).not.toHaveProperty('recommendation');
      expect(question).not.toHaveProperty('rule');
      expect(question.label).toBeTypeOf('string');
      expect(question.options.map((option) => option.value)).toEqual(
        expectedOptionValuesByQuestionId[question.id]
      );
    }
  });
});
