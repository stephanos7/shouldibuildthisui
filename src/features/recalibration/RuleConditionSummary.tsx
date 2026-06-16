import { Chip, Stack, Typography } from '@mui/material';
import type { Condition } from '../../decision/types/Policy';

const fieldLabels: Record<Condition['field'], string> = {
  frontendDeveloperCount: 'Frontend developer count',
  teamCount: 'Team count',
  reactAppCount: 'React app count',
  designSystemMaturity: 'Design system maturity',
  uiKnowledgeDistribution: 'UI knowledge distribution',
  designEngineeringFriction: 'Design and engineering friction',
  standardizationIntent: 'Standardization intent',
  dataGridComplexity: 'Data grid complexity',
  performanceCriticality: 'Performance criticality',
  accessibilityCriticality: 'Accessibility criticality',
  changeLeadTime: 'Change lead time',
  uiRegressionFrequency: 'UI regression frequency',
  deliveryUrgency: 'Delivery urgency',
  applicationCriticality: 'Application criticality',
  supportExpectation: 'Support expectation',
  ownershipHorizon: 'Ownership horizon'
};

function formatValue(value: string) {
  return value.replace(/_/g, ' ');
}

function formatCondition(condition: Condition) {
  const field = fieldLabels[condition.field];
  const operator =
    condition.operator === 'equals'
      ? 'is'
      : condition.operator === 'notEquals'
        ? 'is not'
        : condition.operator === 'in'
          ? 'is one of'
          : 'is not one of';
  const value = Array.isArray(condition.value)
    ? condition.value.map(formatValue).join(', ')
    : formatValue(condition.value);

  return `${field} ${operator} ${value}`;
}

export default function RuleConditionSummary({ conditions }: { conditions: Condition[] }) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Conditions</Typography>
      <Typography variant="body2" color="text.secondary">
        These conditions determine when the rule applies. They are read-only to keep the decision
        model maintainable.
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {conditions.map((condition, index) => (
          <Chip key={`${condition.field}-${condition.operator}-${index}`} label={formatCondition(condition)} />
        ))}
      </Stack>
    </Stack>
  );
}
