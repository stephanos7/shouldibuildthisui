import { describe, expect, it } from 'vitest';
import type { DecisionFacts } from '../../../decision/types/DecisionFacts';
import { questions } from '../questions';

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
      expect(question).toHaveProperty('helperText');
      expect(question).toHaveProperty('component');
      expect(question).toHaveProperty('options');
      expect(question).not.toHaveProperty('score');
      expect(question).not.toHaveProperty('path');
      expect(question).not.toHaveProperty('recommendation');
      expect(question).not.toHaveProperty('rule');
    }
  });
});
