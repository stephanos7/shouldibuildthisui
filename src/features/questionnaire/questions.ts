import type {
  QuestionDefinition,
  QuestionnaireFieldId,
  QuestionnaireSectionDefinition
} from './questionnaireTypes';

export const questionnaireSections: QuestionnaireSectionDefinition[] = [
  {
    id: 'team_and_scale',
    eyebrow: 'Section 1',
    title: 'Team and Scale',
    description: 'Capture the breadth of people, teams, and apps that would share the UI approach.'
  },
  {
    id: 'design_system_and_workflow',
    eyebrow: 'Section 2',
    title: 'Design System and Workflow',
    description:
      'Describe the current system maturity and the level of standardization the organization wants.'
  },
  {
    id: 'maintainability_risk',
    eyebrow: 'Section 3',
    title: 'Maintainability Risk',
    description:
      'Assess resilience, delivery friction, and how long this UI will need to evolve.'
  },
  {
    id: 'advanced_ui_needs',
    eyebrow: 'Section 4',
    title: 'Advanced UI Needs',
    description:
      'Focus on the most demanding interaction and data-heavy requirements in scope.'
  },
  {
    id: 'quality_support_and_delivery',
    eyebrow: 'Section 5',
    title: 'Quality, Support, and Delivery',
    description:
      'Account for accessibility expectations, operational risk, support needs, and urgency.'
  }
];

export const questions = [
  {
    id: 'frontendDeveloperCount',
    section: 'team_and_scale',
    label: 'How many frontend developers work on these React applications?',
    helperText: 'Choose the size of the frontend developer population involved in this UI estate.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: '1_9', label: '1-9 developers' },
      { value: '10_19', label: '10-19 developers' },
      { value: '20_49', label: '20-49 developers' },
      { value: '50_plus', label: '50 or more developers' }
    ]
  },
  {
    id: 'teamCount',
    section: 'team_and_scale',
    label: 'How many teams contribute to these React applications?',
    helperText: 'Focus on teams that regularly ship or maintain UI work.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: '1', label: '1 team' },
      { value: '2_3', label: '2-3 teams' },
      { value: '4_7', label: '4-7 teams' },
      { value: '8_plus', label: '8 or more teams' }
    ]
  },
  {
    id: 'reactAppCount',
    section: 'team_and_scale',
    label: 'How many React applications are in scope?',
    helperText: 'Count distinct applications that would share this UI approach.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: '1', label: '1 application' },
      { value: '2_4', label: '2-4 applications' },
      { value: '5_10', label: '5-10 applications' },
      { value: '11_plus', label: '11 or more applications' }
    ]
  },
  {
    id: 'designSystemMaturity',
    section: 'design_system_and_workflow',
    label: 'How mature is the current design system?',
    helperText: 'Choose the state that best matches the organization today.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'none', label: 'No real design system' },
      { value: 'early', label: 'Early and still forming' },
      { value: 'established', label: 'Established with regular use' },
      { value: 'centralized', label: 'Centralized platform with governance' }
    ]
  },
  {
    id: 'designEngineeringFriction',
    section: 'design_system_and_workflow',
    label: 'How much friction exists between design and engineering?',
    helperText: 'Consider handoff clarity, iteration cycles, and alignment on reusable patterns.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'low', label: 'Low friction' },
      { value: 'medium', label: 'Moderate friction' },
      { value: 'high', label: 'High friction' },
      { value: 'severe', label: 'Severe friction' }
    ]
  },
  {
    id: 'standardizationIntent',
    section: 'design_system_and_workflow',
    label: 'What level of UI standardization is the organization aiming for?',
    helperText: 'Answer based on the target operating model, not just today’s local needs.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'none', label: 'No explicit standardization goal' },
      { value: 'local_consistency', label: 'Consistency within one app or team' },
      { value: 'cross_app_consistency', label: 'Consistency across multiple apps' },
      { value: 'org_wide_platform', label: 'Organization-wide UI platform' }
    ]
  },
  {
    id: 'uiKnowledgeDistribution',
    section: 'maintainability_risk',
    label: 'How widely is critical UI implementation knowledge distributed?',
    helperText: 'Estimate how resilient the team would be if key UI contributors changed roles.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'distributed', label: 'Well distributed across contributors' },
      { value: 'some_specialists', label: 'A few specialists, but coverage exists' },
      { value: 'few_specialists', label: 'Only a small number of specialists' },
      { value: 'single_point', label: 'Mostly concentrated in one person' }
    ]
  },
  {
    id: 'changeLeadTime',
    section: 'maintainability_risk',
    label: 'How long do UI changes usually take from request to release?',
    helperText: 'Think about the normal path for non-trivial UI changes.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'same_day', label: 'Usually the same day' },
      { value: 'days', label: 'Usually a few days' },
      { value: 'weeks', label: 'Usually a few weeks' },
      { value: 'months', label: 'Usually months' }
    ]
  },
  {
    id: 'uiRegressionFrequency',
    section: 'maintainability_risk',
    label: 'How often do UI regressions appear during delivery?',
    helperText: 'Include visual issues, broken interactions, and accessibility regressions.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'rare', label: 'Rarely' },
      { value: 'occasional', label: 'Occasionally' },
      { value: 'frequent', label: 'Frequently' },
      { value: 'constant', label: 'Constantly' }
    ]
  },
  {
    id: 'ownershipHorizon',
    section: 'maintainability_risk',
    label: 'How long is this UI expected to be owned and evolved?',
    helperText: 'Choose the expected lifecycle of the product or platform investment.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'prototype', label: 'Prototype or disposable exploration' },
      { value: 'short_term', label: 'Short-term product' },
      { value: 'long_term', label: 'Long-term product' },
      { value: 'platform_investment', label: 'Platform-level investment' }
    ]
  },
  {
    id: 'dataGridComplexity',
    section: 'advanced_ui_needs',
    label: 'What level of data grid or tabular UI complexity is required?',
    helperText: 'Think about the hardest table, grid, or spreadsheet-like experience in scope.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'none', label: 'No meaningful grid requirements' },
      { value: 'simple_tables', label: 'Simple tables and lists' },
      { value: 'advanced_grids', label: 'Advanced grids with richer behavior' },
      { value: 'mission_critical_grids', label: 'Mission-critical grid workflows' }
    ]
  },
  {
    id: 'performanceCriticality',
    section: 'advanced_ui_needs',
    label: 'How performance-critical are the UI interactions?',
    helperText: 'Consider responsiveness expectations under real-world scale and workload.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'low', label: 'Low criticality' },
      { value: 'medium', label: 'Moderate criticality' },
      { value: 'high', label: 'High criticality' },
      { value: 'critical', label: 'Critical to success' }
    ]
  },
  {
    id: 'accessibilityCriticality',
    section: 'quality_support_and_delivery',
    label: 'How critical are accessibility requirements?',
    helperText: 'Choose the strongest accessibility expectation that applies to the work.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'low', label: 'Low priority' },
      { value: 'medium', label: 'Important but flexible' },
      { value: 'high', label: 'High priority' },
      { value: 'regulated_or_mandatory', label: 'Regulated or mandatory compliance' }
    ]
  },
  {
    id: 'applicationCriticality',
    section: 'quality_support_and_delivery',
    label: 'How critical is the application to the business or operation?',
    helperText: 'Answer based on business impact if the UI performs poorly or becomes hard to maintain.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'internal_tool', label: 'Internal tool' },
      { value: 'customer_facing', label: 'Customer-facing product' },
      { value: 'revenue_critical', label: 'Revenue-critical product' },
      {
        value: 'regulated_or_operationally_critical',
        label: 'Regulated or operationally critical system'
      }
    ]
  },
  {
    id: 'supportExpectation',
    section: 'quality_support_and_delivery',
    label: 'What level of vendor support is expected?',
    helperText: 'Choose the support model the organization expects to rely on.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'self_serve', label: 'Self-serve documentation and community' },
      { value: 'standard_support', label: 'Standard support' },
      { value: 'priority_support', label: 'Priority support' },
      { value: 'enterprise_support', label: 'Enterprise support expectations' }
    ]
  },
  {
    id: 'deliveryUrgency',
    section: 'quality_support_and_delivery',
    label: 'How urgent is delivery for this UI work?',
    helperText: 'Answer based on the current delivery pressure and schedule commitment.',
    component: 'radio',
    layout: 'two-column',
    options: [
      { value: 'low', label: 'Low urgency' },
      { value: 'medium', label: 'Moderate urgency' },
      { value: 'high', label: 'High urgency' },
      { value: 'fixed_deadline', label: 'Fixed deadline with limited flexibility' }
    ]
  }
] satisfies QuestionDefinition[];

export const questionIds = questions.map((question) => question.id);

export const totalQuestionCount = questionIds.length;

export const questionsBySection = questionnaireSections.map((section) => ({
  ...section,
  questionIds: questions
    .filter((question) => question.section === section.id)
    .map((question) => question.id) satisfies QuestionnaireFieldId[],
  questions: questions.filter((question) => question.section === section.id)
}));
