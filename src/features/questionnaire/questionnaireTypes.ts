import type { DecisionFacts } from '../../decision/types/DecisionFacts';

export type QuestionnaireFieldId = keyof DecisionFacts;

export type QuestionnaireSection =
  | 'team_and_scale'
  | 'design_system_and_workflow'
  | 'maintainability_risk'
  | 'advanced_ui_needs'
  | 'quality_support_and_delivery';

export type QuestionnaireSectionDefinition = {
  id: QuestionnaireSection;
  eyebrow: string;
  title: string;
};

export type QuestionComponent = 'radio' | 'select';

export type QuestionLayout = 'single-column' | 'two-column';

export type QuestionImportance = 'primary' | 'secondary';

export type QuestionOption<TValue extends string> = {
  value: TValue;
  label: string;
};

export type QuestionDefinition<TValue extends string = string> = {
  id: QuestionnaireFieldId;
  section: QuestionnaireSection;
  label: string;
  component: QuestionComponent;
  layout?: QuestionLayout;
  importance?: QuestionImportance;
  options: QuestionOption<TValue>[];
};
