import type { DecisionFacts } from '../types/DecisionFacts';
import type { Path } from '../types/Path';

export type CalibrationScenario = {
  id: string;
  label: string;
  input: DecisionFacts;
  expectedRecommendation: Path;
  notes: string;
};

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

function createFacts(overrides: Partial<DecisionFacts>): DecisionFacts {
  return {
    ...baselineFacts,
    ...overrides
  };
}

export const calibrationScenarios: CalibrationScenario[] = [
  {
    id: 'prototype-simple-internal-tool',
    label: 'Simple internal prototype',
    input: createFacts({
      frontendDeveloperCount: '1_9',
      teamCount: '1',
      reactAppCount: '1',
      dataGridComplexity: 'none',
      accessibilityCriticality: 'low',
      applicationCriticality: 'internal_tool',
      supportExpectation: 'self_serve',
      ownershipHorizon: 'prototype'
    }),
    expectedRecommendation: 'build_it_yourself',
    notes: 'Matches the single shipped gate for a narrow internal prototype.'
  },
  {
    id: 'small-team-no-advanced-ui',
    label: 'Small team with no advanced UI needs',
    input: createFacts({
      teamCount: '1',
      reactAppCount: '1',
      dataGridComplexity: 'none',
      standardizationIntent: 'none'
    }),
    expectedRecommendation: 'build_it_yourself',
    notes: 'A single team with simple UI needs should stay on the lightest path.'
  },
  {
    id: 'small-team-advanced-grids',
    label: 'Small team with advanced grids',
    input: createFacts({
      teamCount: '1',
      reactAppCount: '1',
      dataGridComplexity: 'advanced_grids'
    }),
    expectedRecommendation: 'mui_x_premium',
    notes: 'Advanced grid capability should outweigh small-team scale.'
  },
  {
    id: 'moderate-team-narrow-scope',
    label: 'Moderate team with narrow scope',
    input: createFacts({
      teamCount: '2_3',
      reactAppCount: '2_4',
      standardizationIntent: 'local_consistency'
    }),
    expectedRecommendation: 'mui_core',
    notes: 'A moderate team with a narrow React footprint should lean toward Core.'
  },
  {
    id: 'moderate-team-multiple-apps',
    label: 'Moderate team with multiple apps',
    input: createFacts({
      teamCount: '2_3',
      reactAppCount: '5_10',
      standardizationIntent: 'cross_app_consistency'
    }),
    expectedRecommendation: 'mui_core',
    notes: 'Cross-app reuse without enterprise pressure should still land on Core.'
  },
  {
    id: 'large-org-low-complexity',
    label: 'Large organization with low complexity',
    input: createFacts({
      frontendDeveloperCount: '50_plus',
      teamCount: '8_plus',
      reactAppCount: '11_plus',
      standardizationIntent: 'local_consistency',
      dataGridComplexity: 'simple_tables',
      supportExpectation: 'self_serve'
    }),
    expectedRecommendation: 'mui_x_premium',
    notes: 'Broad rollout still pushes the current policy toward Premium even when UI complexity stays low.'
  },
  {
    id: 'large-frontend-narrow-scope',
    label: 'Large frontend population with narrow scope',
    input: createFacts({
      frontendDeveloperCount: '50_plus',
      teamCount: '1',
      reactAppCount: '1',
      dataGridComplexity: 'simple_tables',
      standardizationIntent: 'none'
    }),
    expectedRecommendation: 'build_it_yourself',
    notes: 'A large frontend population alone should not outweigh a single-team, single-app scope.'
  },
  {
    id: 'large-frontend-broad-rollout',
    label: 'Large frontend population with broad rollout',
    input: createFacts({
      frontendDeveloperCount: '50_plus',
      teamCount: '8_plus',
      reactAppCount: '11_plus',
      standardizationIntent: 'cross_app_consistency',
      supportExpectation: 'standard_support'
    }),
    expectedRecommendation: 'mui_x_premium',
    notes: 'Broad rollout with a large frontend population should strengthen shared-platform recommendations without requiring enterprise support.'
  },
  {
    id: 'multi-team-multi-app-enterprise',
    label: 'Multi-team multi-app enterprise pattern',
    input: createFacts({
      frontendDeveloperCount: '50_plus',
      teamCount: '8_plus',
      reactAppCount: '11_plus',
      standardizationIntent: 'org_wide_platform',
      supportExpectation: 'enterprise_support',
      applicationCriticality: 'customer_facing'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Broad rollout plus enterprise support should clearly favor Enterprise.'
  },
  {
    id: 'centralized-design-system',
    label: 'Centralized design system',
    input: createFacts({
      designSystemMaturity: 'centralized',
      standardizationIntent: 'org_wide_platform',
      teamCount: '4_7',
      reactAppCount: '5_10'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Centralized design ownership and org-wide governance should favor Enterprise.'
  },
  {
    id: 'early-design-system-local-consistency',
    label: 'Early design system with local consistency',
    input: createFacts({
      designSystemMaturity: 'early',
      standardizationIntent: 'local_consistency',
      teamCount: '2_3',
      reactAppCount: '2_4'
    }),
    expectedRecommendation: 'mui_core',
    notes: 'Early standardization work should stay on the lighter shared foundation.'
  },
  {
    id: 'knowledge-single-point',
    label: 'Knowledge concentrated in one person',
    input: createFacts({
      uiKnowledgeDistribution: 'single_point',
      ownershipHorizon: 'long_term'
    }),
    expectedRecommendation: 'mui_core',
    notes: 'Long-lived products with a single UI owner should favor standardization.'
  },
  {
    id: 'distributed-knowledge-simple-ui',
    label: 'Distributed knowledge with simple UI',
    input: createFacts({
      teamCount: '1',
      reactAppCount: '1',
      uiKnowledgeDistribution: 'distributed',
      dataGridComplexity: 'none',
      standardizationIntent: 'none'
    }),
    expectedRecommendation: 'build_it_yourself',
    notes: 'Simple UI with distributed knowledge should not introduce unnecessary platform weight.'
  },
  {
    id: 'frequent-regressions',
    label: 'Frequent regressions',
    input: createFacts({
      uiRegressionFrequency: 'frequent',
      changeLeadTime: 'weeks'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Sustained regression risk and slower change cycles should increase support-oriented options.'
  },
  {
    id: 'constant-regressions-long-lead-time',
    label: 'Constant regressions and long lead time',
    input: createFacts({
      uiRegressionFrequency: 'constant',
      changeLeadTime: 'months'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'The strongest maintainability risk pattern should recommend Enterprise.'
  },
  {
    id: 'fixed-deadline-pressure',
    label: 'Fixed deadline pressure',
    input: createFacts({
      teamCount: '2_3',
      reactAppCount: '2_4',
      standardizationIntent: 'local_consistency',
      deliveryUrgency: 'fixed_deadline',
      uiRegressionFrequency: 'frequent'
    }),
    expectedRecommendation: 'mui_core',
    notes: 'Deadline pressure with regression risk should push toward safer reusable components.'
  },
  {
    id: 'regulated-operationally-critical-app',
    label: 'Regulated or operationally critical app',
    input: createFacts({
      applicationCriticality: 'regulated_or_operationally_critical',
      accessibilityCriticality: 'regulated_or_mandatory'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Critical regulated workflows should strongly favor Enterprise.'
  },
  {
    id: 'revenue-critical-customer-facing',
    label: 'Revenue-critical customer-facing app',
    input: createFacts({
      applicationCriticality: 'revenue_critical',
      supportExpectation: 'enterprise_support',
      teamCount: '4_7',
      reactAppCount: '5_10'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Revenue impact plus enterprise support expectations should favor Enterprise.'
  },
  {
    id: 'high-accessibility-criticality',
    label: 'High accessibility criticality',
    input: createFacts({
      accessibilityCriticality: 'high',
      teamCount: '2_3',
      reactAppCount: '2_4',
      standardizationIntent: 'cross_app_consistency'
    }),
    expectedRecommendation: 'mui_core',
    notes: 'High accessibility importance alone should still keep a moderate org on Core.'
  },
  {
    id: 'enterprise-support-expectation',
    label: 'Enterprise support expectation',
    input: createFacts({
      supportExpectation: 'enterprise_support',
      applicationCriticality: 'customer_facing',
      teamCount: '4_7',
      reactAppCount: '5_10'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Enterprise support demand plus broader rollout should land on Enterprise.'
  },
  {
    id: 'self-serve-low-complexity',
    label: 'Self-serve support and low complexity',
    input: createFacts({
      teamCount: '1',
      reactAppCount: '1',
      dataGridComplexity: 'none',
      supportExpectation: 'self_serve',
      standardizationIntent: 'none'
    }),
    expectedRecommendation: 'build_it_yourself',
    notes: 'Low-complexity teams with self-serve expectations should not pay platform overhead.'
  },
  {
    id: 'platform-investment-horizon',
    label: 'Platform investment horizon',
    input: createFacts({
      ownershipHorizon: 'platform_investment',
      standardizationIntent: 'org_wide_platform',
      designSystemMaturity: 'centralized'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'A platform-investment horizon plus centralized governance should favor Enterprise.'
  },
  {
    id: 'mission-critical-grids',
    label: 'Mission-critical grids',
    input: createFacts({
      dataGridComplexity: 'mission_critical_grids'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Mission-critical grid needs should favor the most capable supported path.'
  },
  {
    id: 'mission-critical-grids-enterprise-support',
    label: 'Mission-critical grids with enterprise support',
    input: createFacts({
      dataGridComplexity: 'mission_critical_grids',
      supportExpectation: 'enterprise_support'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Mission-critical grids plus enterprise support should strongly reinforce Enterprise.'
  },
  {
    id: 'advanced-grids-limited-scale',
    label: 'Advanced grids but limited org scale',
    input: createFacts({
      teamCount: '2_3',
      reactAppCount: '2_4',
      dataGridComplexity: 'advanced_grids'
    }),
    expectedRecommendation: 'mui_x_premium',
    notes: 'Advanced grid requirements should still justify Premium for smaller orgs.'
  },
  {
    id: 'org-wide-standardization',
    label: 'Org-wide standardization intent',
    input: createFacts({
      standardizationIntent: 'org_wide_platform',
      teamCount: '2_3',
      reactAppCount: '2_4'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Explicit org-wide standardization should lean toward Enterprise even without advanced UI.'
  },
  {
    id: 'design-engineering-friction',
    label: 'High design-engineering friction',
    input: createFacts({
      designEngineeringFriction: 'severe',
      standardizationIntent: 'cross_app_consistency',
      teamCount: '2_3',
      reactAppCount: '2_4'
    }),
    expectedRecommendation: 'mui_core',
    notes: 'Cross-app consistency with severe workflow friction should still recommend Core for moderate-scale shared foundations.'
  },
  {
    id: 'design-engineering-friction-org-wide-platform',
    label: 'Severe design-engineering friction with org-wide platform intent',
    input: createFacts({
      designEngineeringFriction: 'severe',
      standardizationIntent: 'org_wide_platform',
      designSystemMaturity: 'centralized',
      teamCount: '4_7',
      reactAppCount: '5_10'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Severe workflow friction should reinforce enterprise coordination when the organization is aiming for an org-wide platform.'
  },
  {
    id: 'advanced-grids-high-performance',
    label: 'Advanced grids with high performance criticality',
    input: createFacts({
      teamCount: '2_3',
      reactAppCount: '2_4',
      dataGridComplexity: 'advanced_grids',
      performanceCriticality: 'high'
    }),
    expectedRecommendation: 'mui_x_premium',
    notes: 'Higher performance needs should reinforce Premium when advanced grids are already in scope.'
  },
  {
    id: 'mission-critical-grids-critical-performance',
    label: 'Mission-critical grids with critical performance',
    input: createFacts({
      dataGridComplexity: 'mission_critical_grids',
      performanceCriticality: 'critical',
      supportExpectation: 'enterprise_support'
    }),
    expectedRecommendation: 'mui_x_enterprise',
    notes: 'Mission-critical grids plus critical performance and enterprise support should clearly favor Enterprise.'
  }
];
