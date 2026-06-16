import { Paper, Stack, Typography } from '@mui/material';
import QuestionRenderer from './QuestionRenderer';
import type { QuestionDefinition, QuestionnaireSection } from './questionnaireTypes';

const sectionCopy: Record<QuestionnaireSection, { eyebrow: string; title: string; description: string }> =
  {
    team_and_scale: {
      eyebrow: 'Section 1',
      title: 'Team and Scale',
      description: 'Capture the breadth of people, teams, and apps that would share the UI approach.'
    },
    design_system_and_workflow: {
      eyebrow: 'Section 2',
      title: 'Design System and Workflow',
      description: 'Describe the current system maturity and the level of standardization the organization wants.'
    },
    maintainability_risk: {
      eyebrow: 'Section 3',
      title: 'Maintainability Risk',
      description: 'Assess resilience, delivery friction, and how long this UI will need to evolve.'
    },
    advanced_ui_needs: {
      eyebrow: 'Section 4',
      title: 'Advanced UI Needs',
      description: 'Focus on the most demanding interaction and data-heavy requirements in scope.'
    },
    quality_support_and_delivery: {
      eyebrow: 'Section 5',
      title: 'Quality, Support, and Delivery',
      description: 'Account for accessibility expectations, operational risk, support needs, and urgency.'
    }
  };

type QuestionSectionProps = {
  section: QuestionnaireSection;
  questions: QuestionDefinition[];
};

export default function QuestionSection({ section, questions }: QuestionSectionProps) {
  const copy = sectionCopy[section];

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {copy.eyebrow}
          </Typography>
          <Typography variant="h4" component="h2">
            {copy.title}
          </Typography>
          <Typography color="text.secondary">{copy.description}</Typography>
        </Stack>
        <Stack spacing={3}>
          {questions.map((question) => (
            <QuestionRenderer key={question.id} question={question} />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
