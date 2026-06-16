import type { DecisionFacts } from '../../decision/types/DecisionFacts';

export type QuestionnaireFieldId = keyof DecisionFacts;

export type QuestionnaireSection =
  | 'team_and_scale'
  | 'design_system_and_workflow'
  | 'maintainability_risk'
  | 'advanced_ui_needs'
  | 'quality_support_and_delivery';

export type QuestionComponent = 'radio' | 'select';

export type QuestionOption<TValue extends string> = {
  value: TValue;
  label: string;
  helperText?: string;
};

export type QuestionDefinition<TValue extends string = string> = {
  id: QuestionnaireFieldId;
  section: QuestionnaireSection;
  label: string;
  helperText: string;
  component: QuestionComponent;
  options: QuestionOption<TValue>[];
};
