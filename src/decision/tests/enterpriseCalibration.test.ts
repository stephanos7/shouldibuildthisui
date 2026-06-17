import { describe, expect, it } from 'vitest';
import { decide } from '../engine/decide';
import { recommendationPolicy } from '../policy/recommendationPolicy';
import type { DecisionFacts } from '../types/DecisionFacts';

const baselineFacts: DecisionFacts = {
  frontendDeveloperCount: '10_19',
  teamCount: '2_3',
  reactAppCount: '2_4',
  designSystemMaturity: 'early',
  uiKnowledgeDistribution: 'distributed',
  designEngineeringFriction: 'medium',
  standardizationIntent: 'none',
  dataGridComplexity: 'simple_tables',
  performanceCriticality: 'medium',
  accessibilityCriticality: 'medium',
  changeLeadTime: 'days',
  uiRegressionFrequency: 'occasional',
  deliveryUrgency: 'medium',
  applicationCriticality: 'customer_facing',
  supportExpectation: 'standard_support',
  ownershipHorizon: 'long_term'
};

function withOverrides(overrides: Partial<DecisionFacts>): DecisionFacts {
  return {
    ...baselineFacts,
    ...overrides
  };
}

describe('enterprise calibration', () => {
  it('keeps obvious enterprise stacks strongly on Enterprise', () => {
    const result = decide(
      withOverrides({
        frontendDeveloperCount: '50_plus',
        teamCount: '8_plus',
        reactAppCount: '11_plus',
        standardizationIntent: 'org_wide_platform',
        supportExpectation: 'enterprise_support',
        applicationCriticality: 'customer_facing'
      }),
      recommendationPolicy
    );

    expect(result.recommendation).toBe('mui_x_enterprise');
    expect(result.scores.mui_x_enterprise).toBeGreaterThan(result.scores.mui_x_premium);
    expect(result.scores.mui_x_enterprise - result.scores.mui_x_premium).toBeGreaterThanOrEqual(2);
  });

  it('keeps enterprise-support-only moderate-scale cases off Enterprise', () => {
    const customerFacingResult = decide(
      withOverrides({
        supportExpectation: 'enterprise_support',
        applicationCriticality: 'customer_facing'
      }),
      recommendationPolicy
    );
    const internalResult = decide(
      withOverrides({
        supportExpectation: 'enterprise_support',
        applicationCriticality: 'internal_tool'
      }),
      recommendationPolicy
    );

    expect(customerFacingResult.recommendation).toBe('mui_x_premium');
    expect(customerFacingResult.scores.mui_x_premium).toBeGreaterThan(
      customerFacingResult.scores.mui_x_enterprise
    );
    expect(internalResult.recommendation).toBe('mui_x_premium');
    expect(internalResult.scores.mui_x_premium).toBeGreaterThan(internalResult.scores.mui_x_enterprise);
  });

  it('keeps org-wide intent alone on Premium', () => {
    const result = decide(
      withOverrides({
        standardizationIntent: 'org_wide_platform'
      }),
      recommendationPolicy
    );

    expect(result.recommendation).toBe('mui_x_premium');
    expect(result.scores.mui_x_premium).toBeGreaterThan(result.scores.mui_x_enterprise);
  });

  it('keeps mission-critical grids as a clean standalone Enterprise trigger', () => {
    const result = decide(
      withOverrides({
        dataGridComplexity: 'mission_critical_grids'
      }),
      recommendationPolicy
    );

    expect(result.recommendation).toBe('mui_x_enterprise');
    expect(result.scores.mui_x_enterprise).toBeGreaterThan(result.scores.mui_x_premium);
  });

  it('keeps regressions alone on Premium but still escalates high-risk regressions to Enterprise', () => {
    const premiumResult = decide(
      withOverrides({
        uiRegressionFrequency: 'frequent',
        changeLeadTime: 'weeks'
      }),
      recommendationPolicy
    );
    const enterpriseResult = decide(
      withOverrides({
        uiRegressionFrequency: 'frequent',
        changeLeadTime: 'weeks',
        applicationCriticality: 'regulated_or_operationally_critical',
        accessibilityCriticality: 'regulated_or_mandatory'
      }),
      recommendationPolicy
    );

    expect(premiumResult.recommendation).toBe('mui_x_premium');
    expect(enterpriseResult.recommendation).toBe('mui_x_enterprise');
    expect(enterpriseResult.scores.mui_x_enterprise).toBeGreaterThan(
      enterpriseResult.scores.mui_x_premium
    );
  });

  it('keeps large low-complexity scale cases on Premium with a clearer margin', () => {
    const result = decide(
      withOverrides({
        frontendDeveloperCount: '50_plus',
        teamCount: '8_plus',
        reactAppCount: '11_plus',
        standardizationIntent: 'local_consistency',
        dataGridComplexity: 'simple_tables',
        supportExpectation: 'self_serve'
      }),
      recommendationPolicy
    );

    expect(result.recommendation).toBe('mui_x_premium');
    expect(result.scores.mui_x_premium).toBeGreaterThan(result.scores.mui_x_enterprise);
    expect(result.scores.mui_x_premium - result.scores.mui_x_enterprise).toBeGreaterThanOrEqual(2);
  });
});
