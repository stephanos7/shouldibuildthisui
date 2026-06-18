export const decisionFactOptions = {
  frontendDeveloperCount: ["1_9", "10_19", "20_49", "50_plus"],
  teamCount: ["1", "2_3", "4_7", "8_plus"],
  reactAppCount: ["1", "2_4", "5_10", "11_plus"],
  designSystemMaturity: ["none", "early", "established", "centralized"],
  uiKnowledgeDistribution: [
    "distributed",
    "some_specialists",
    "few_specialists",
    "single_point"
  ],
  designEngineeringFriction: ["low", "medium", "high", "severe"],
  standardizationIntent: [
    "none",
    "local_consistency",
    "cross_app_consistency",
    "org_wide_platform"
  ],
  dataGridComplexity: [
    "none",
    "simple_tables",
    "advanced_grids",
    "mission_critical_grids"
  ],
  performanceCriticality: ["low", "medium", "high", "critical"],
  accessibilityCriticality: ["low", "medium", "high", "regulated_or_mandatory"],
  changeLeadTime: ["same_day", "days", "weeks", "months"],
  uiRegressionFrequency: ["rare", "occasional", "frequent", "constant"],
  deliveryUrgency: ["low", "medium", "high", "fixed_deadline"],
  applicationCriticality: [
    "internal_tool",
    "customer_facing",
    "revenue_critical",
    "regulated_or_critical"
  ],
  supportExpectation: [
    "self_serve",
    "standard_support",
    "priority_support",
    "enterprise_support"
  ],
  ownershipHorizon: [
    "prototype",
    "short_term",
    "long_term",
    "platform_investment"
  ]
} as const;

export type FrontendDeveloperCount =
  (typeof decisionFactOptions.frontendDeveloperCount)[number];

export type TeamCount = (typeof decisionFactOptions.teamCount)[number];

export type ReactAppCount = (typeof decisionFactOptions.reactAppCount)[number];

export type DesignSystemMaturity =
  (typeof decisionFactOptions.designSystemMaturity)[number];

export type UiKnowledgeDistribution =
  (typeof decisionFactOptions.uiKnowledgeDistribution)[number];

export type DesignEngineeringFriction =
  (typeof decisionFactOptions.designEngineeringFriction)[number];

export type StandardizationIntent =
  (typeof decisionFactOptions.standardizationIntent)[number];

export type DataGridComplexity =
  (typeof decisionFactOptions.dataGridComplexity)[number];

export type PerformanceCriticality =
  (typeof decisionFactOptions.performanceCriticality)[number];

export type AccessibilityCriticality =
  (typeof decisionFactOptions.accessibilityCriticality)[number];

export type ChangeLeadTime =
  (typeof decisionFactOptions.changeLeadTime)[number];

export type UiRegressionFrequency =
  (typeof decisionFactOptions.uiRegressionFrequency)[number];

export type DeliveryUrgency =
  (typeof decisionFactOptions.deliveryUrgency)[number];

export type ApplicationCriticality =
  (typeof decisionFactOptions.applicationCriticality)[number];

export type SupportExpectation =
  (typeof decisionFactOptions.supportExpectation)[number];

export type OwnershipHorizon =
  (typeof decisionFactOptions.ownershipHorizon)[number];

export type DecisionFacts = {
  frontendDeveloperCount: FrontendDeveloperCount;
  teamCount: TeamCount;
  reactAppCount: ReactAppCount;
  designSystemMaturity: DesignSystemMaturity;
  uiKnowledgeDistribution: UiKnowledgeDistribution;
  designEngineeringFriction: DesignEngineeringFriction;
  standardizationIntent: StandardizationIntent;
  dataGridComplexity: DataGridComplexity;
  performanceCriticality: PerformanceCriticality;
  accessibilityCriticality: AccessibilityCriticality;
  changeLeadTime: ChangeLeadTime;
  uiRegressionFrequency: UiRegressionFrequency;
  deliveryUrgency: DeliveryUrgency;
  applicationCriticality: ApplicationCriticality;
  supportExpectation: SupportExpectation;
  ownershipHorizon: OwnershipHorizon;
};
