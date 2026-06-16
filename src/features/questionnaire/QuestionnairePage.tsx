import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Container, FormHelperText, Stack, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { decide } from '../../decision/engine/decide';
import { recommendationPolicy } from '../../decision/policy/recommendationPolicy';
import { questionnaireSchema, type QuestionnaireValues } from './questionnaireSchema';
import { questionnaireSections, questions } from './questions';
import QuestionSection from './QuestionSection';
import type { QuestionnaireResultState } from './questionnaireResultState';

const questionsBySection = questionnaireSections.map((section) => ({
  section,
  questions: questions.filter((question) => question.section === section)
}));

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const methods = useForm<QuestionnaireValues>({
    resolver: zodResolver(questionnaireSchema),
    mode: 'onBlur'
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods;

  const onSubmit = (values: QuestionnaireValues) => {
    const result = decide(values, recommendationPolicy);
    const routeState: QuestionnaireResultState = {
      input: values,
      result
    };

    navigate('/result', {
      state: routeState
    });
  };

  return (
    <Container maxWidth="md" disableGutters>
      <FormProvider {...methods}>
        <Stack
          component="form"
          spacing={4}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          aria-label="Recommendation questionnaire"
        >
          <Stack spacing={1.5}>
            <Typography variant="overline" color="text.secondary">
              Questionnaire
            </Typography>
            <Typography variant="h2" component="h1">
              Assess your React UI delivery needs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Answer all 16 questions to generate a recommendation from the decision engine.
            </Typography>
          </Stack>

          {Object.keys(errors).length > 0 ? (
            <Alert severity="error">Review the highlighted questions before submitting.</Alert>
          ) : null}

          <Stack spacing={3.5}>
            {questionsBySection.map(({ section, questions: sectionQuestions }) => (
              <QuestionSection key={section} section={section} questions={sectionQuestions} />
            ))}
          </Stack>

          <Stack spacing={1.5} alignItems="flex-start">
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              Get recommendation
            </Button>
            {Object.keys(errors).length > 0 ? (
              <FormHelperText error>All questions are required.</FormHelperText>
            ) : null}
          </Stack>
        </Stack>
      </FormProvider>
    </Container>
  );
}
