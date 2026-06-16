import { describe, expect, it } from 'vitest';
import { questionnaireSchema } from '../questionnaireSchema';

describe('questionnaireSchema', () => {
  it('accepts a complete valid input', () => {
    const result = questionnaireSchema.safeParse({
      frontendDeveloperCount: '20_49',
      teamCount: '4_7',
      reactAppCount: '5_10',
      designSystemMaturity: 'established',
      uiKnowledgeDistribution: 'some_specialists',
      designEngineeringFriction: 'medium',
      standardizationIntent: 'cross_app_consistency',
      dataGridComplexity: 'advanced_grids',
      performanceCriticality: 'high',
      accessibilityCriticality: 'high',
      changeLeadTime: 'weeks',
      uiRegressionFrequency: 'occasional',
      deliveryUrgency: 'high',
      applicationCriticality: 'customer_facing',
      supportExpectation: 'priority_support',
      ownershipHorizon: 'long_term'
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid values', () => {
    const result = questionnaireSchema.safeParse({
      frontendDeveloperCount: '200',
      teamCount: '4_7',
      reactAppCount: '5_10',
      designSystemMaturity: 'established',
      uiKnowledgeDistribution: 'some_specialists',
      designEngineeringFriction: 'medium',
      standardizationIntent: 'cross_app_consistency',
      dataGridComplexity: 'advanced_grids',
      performanceCriticality: 'high',
      accessibilityCriticality: 'high',
      changeLeadTime: 'weeks',
      uiRegressionFrequency: 'occasional',
      deliveryUrgency: 'high',
      applicationCriticality: 'customer_facing',
      supportExpectation: 'priority_support',
      ownershipHorizon: 'long_term'
    });

    expect(result.success).toBe(false);
  });
});
