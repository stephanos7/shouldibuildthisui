import { describe, expect, it } from 'vitest';
import { evaluateCondition } from '../evaluateCondition';
import type { DecisionFacts } from '../../types/DecisionFacts';

const facts: DecisionFacts = {
  frontendDeveloperCount: '10_19',
  teamCount: '2_3',
  reactAppCount: '2_4',
  designSystemMaturity: 'early',
  uiKnowledgeDistribution: 'few_specialists',
  designEngineeringFriction: 'high',
  standardizationIntent: 'cross_app_consistency',
  dataGridComplexity: 'advanced_grids',
  performanceCriticality: 'high',
  accessibilityCriticality: 'medium',
  changeLeadTime: 'weeks',
  uiRegressionFrequency: 'frequent',
  deliveryUrgency: 'high',
  applicationCriticality: 'customer_facing',
  supportExpectation: 'standard_support',
  ownershipHorizon: 'long_term'
};

describe('evaluateCondition', () => {
  it('supports equals', () => {
    expect(
      evaluateCondition(facts, {
        field: 'teamCount',
        operator: 'equals',
        value: '2_3'
      })
    ).toBe(true);
  });

  it('supports notEquals', () => {
    expect(
      evaluateCondition(facts, {
        field: 'applicationCriticality',
        operator: 'notEquals',
        value: 'internal_tool'
      })
    ).toBe(true);
  });

  it('supports in', () => {
    expect(
      evaluateCondition(facts, {
        field: 'dataGridComplexity',
        operator: 'in',
        value: ['advanced_grids', 'mission_critical_grids']
      })
    ).toBe(true);
  });

  it('supports notIn', () => {
    expect(
      evaluateCondition(facts, {
        field: 'supportExpectation',
        operator: 'notIn',
        value: ['priority_support', 'enterprise_support']
      })
    ).toBe(true);
  });
});
