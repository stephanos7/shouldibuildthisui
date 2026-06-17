import { Box, Stack, Typography } from '@mui/material';
import QuestionRenderer from './QuestionRenderer';
import type { QuestionDefinition, QuestionnaireSectionDefinition } from './questionnaireTypes';

type QuestionSectionProps = {
  section: QuestionnaireSectionDefinition;
  questions: QuestionDefinition[];
};

export default function QuestionSection({ section, questions }: QuestionSectionProps) {
  return (
    <Stack spacing={3} sx={{ py: { xs: 0.5, md: 1 } }}>
      <Box sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {section.eyebrow}
          </Typography>
          <Typography variant="h4" component="h2">
            {section.title}
          </Typography>
          <Typography color="text.secondary">{section.description}</Typography>
        </Stack>
      </Box>
      <Stack spacing={3}>
        {questions.map((question) => (
          <QuestionRenderer key={question.id} question={question} />
        ))}
      </Stack>
    </Stack>
  );
}
