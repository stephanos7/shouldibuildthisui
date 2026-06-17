import { Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import ResponsiveQuestionRow from './ResponsiveQuestionRow';
import QuestionRenderer from './QuestionRenderer';
import type { QuestionnaireValues } from './questionnaireSchema';
import type { QuestionDefinition } from './questionnaireTypes';

type QuestionSectionProps = {
  questions: QuestionDefinition[];
};

export default function QuestionSection({ questions }: QuestionSectionProps) {
  const {
    formState: { errors }
  } = useFormContext<QuestionnaireValues>();

  return (
    <Stack spacing={0} sx={{ py: { xs: 0.5, md: 1 } }}>
      {questions.map((question) => (
        <ResponsiveQuestionRow
          key={question.id}
          id={question.id}
          label={question.label}
        >
          <QuestionRenderer
            question={question}
            labelledById={`${question.id}-question`}
            describedById={errors[question.id]?.message ? `${question.id}-error` : undefined}
          />
        </ResponsiveQuestionRow>
      ))}
    </Stack>
  );
}
