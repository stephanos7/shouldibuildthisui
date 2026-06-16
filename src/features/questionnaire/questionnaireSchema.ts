import { z } from 'zod';
import type { DecisionFacts } from '../../decision/types/DecisionFacts';

export const questionnaireSchema: z.ZodType<DecisionFacts> = z.object({
  frontendDeveloperCount: z.enum(['1_9', '10_19', '20_49', '50_plus']),
  teamCount: z.enum(['1', '2_3', '4_7', '8_plus']),
  reactAppCount: z.enum(['1', '2_4', '5_10', '11_plus']),
  designSystemMaturity: z.enum(['none', 'early', 'established', 'centralized']),
  uiKnowledgeDistribution: z.enum([
    'distributed',
    'some_specialists',
    'few_specialists',
    'single_point'
  ]),
  designEngineeringFriction: z.enum(['low', 'medium', 'high', 'severe']),
  standardizationIntent: z.enum([
    'none',
    'local_consistency',
    'cross_app_consistency',
    'org_wide_platform'
  ]),
  dataGridComplexity: z.enum([
    'none',
    'simple_tables',
    'advanced_grids',
    'mission_critical_grids'
  ]),
  performanceCriticality: z.enum(['low', 'medium', 'high', 'critical']),
  accessibilityCriticality: z.enum([
    'low',
    'medium',
    'high',
    'regulated_or_mandatory'
  ]),
  changeLeadTime: z.enum(['same_day', 'days', 'weeks', 'months']),
  uiRegressionFrequency: z.enum(['rare', 'occasional', 'frequent', 'constant']),
  deliveryUrgency: z.enum(['low', 'medium', 'high', 'fixed_deadline']),
  applicationCriticality: z.enum([
    'internal_tool',
    'customer_facing',
    'revenue_critical',
    'regulated_or_operationally_critical'
  ]),
  supportExpectation: z.enum([
    'self_serve',
    'standard_support',
    'priority_support',
    'enterprise_support'
  ]),
  ownershipHorizon: z.enum([
    'prototype',
    'short_term',
    'long_term',
    'platform_investment'
  ])
});

export type QuestionnaireValues = z.infer<typeof questionnaireSchema>;
