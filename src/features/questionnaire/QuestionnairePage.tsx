import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Box, Container, FormHelperText, Snackbar, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { decide } from '../../decision/engine/decide';
import { getActiveRecommendationPolicy } from '../../decision/policy/recommendationPolicy';
import { getActivePolicyMetadata } from '../../decision/recalibration/getActivePolicyMetadata';
import {
  clearRecommendationSession,
  loadQuestionnaireDraft,
  saveDecisionResult,
  saveQuestionnaireDraft
} from '../../shared/storage/recommendationStorage';
import AssessmentHero from './AssessmentHero';
import ClearSavedAnswersDialog from './ClearSavedAnswersDialog';
import QuestionSection from './QuestionSection';
import { questionsBySection, totalQuestionCount } from './questions';
import { questionnaireSchema, type QuestionnaireValues } from './questionnaireSchema';
import type { QuestionnaireResultState } from './questionnaireResultState';
import QuestionnaireProgressHeader from './QuestionnaireProgressHeader';
import StepNavigation from './StepNavigation';

const emptyQuestionnaireValues = {} as QuestionnaireValues;

function isAnswered(value: unknown) {
  return value !== undefined && value !== null && value !== '';
}

function getAnsweredCount(values: Partial<QuestionnaireValues> | undefined) {
  return Object.values(values ?? {}).filter(isAnswered).length;
}

function getFirstIncompleteSectionIndex(values: Partial<QuestionnaireValues> | null) {
  const firstIncompleteIndex = questionsBySection.findIndex(({ questionIds: currentQuestionIds }) =>
    currentQuestionIds.some((questionId) => !isAnswered(values?.[questionId]))
  );

  return firstIncompleteIndex === -1 ? questionsBySection.length - 1 : firstIncompleteIndex;
}

type QuestionnaireFormProps = {
  savedDraft: QuestionnaireValues | null;
  onRequestClear: () => void;
};

function QuestionnaireForm({ savedDraft, onRequestClear }: QuestionnaireFormProps) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(() => getFirstIncompleteSectionIndex(savedDraft));
  const [stepError, setStepError] = useState(false);
  const methods = useForm<QuestionnaireValues>({
    resolver: zodResolver(questionnaireSchema),
    mode: 'onBlur',
    defaultValues: savedDraft ?? emptyQuestionnaireValues
  });
  const persistenceReadyRef = useRef(false);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    trigger
  } = methods;
  const watchedValues = useWatch({ control });
  const currentSection = questionsBySection[activeStep];
  const isFinalStep = activeStep === questionsBySection.length - 1;
  const answeredCount = getAnsweredCount(watchedValues);

  useEffect(() => {
    if (!persistenceReadyRef.current) {
      persistenceReadyRef.current = true;
      return;
    }

    saveQuestionnaireDraft(watchedValues as QuestionnaireValues);
  }, [watchedValues]);

  const handleBack = () => {
    setStepError(false);
    setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  const handleContinue = async () => {
    const isStepValid = await trigger(currentSection.questionIds);

    if (!isStepValid) {
      setStepError(true);
      return;
    }

    setStepError(false);
    setActiveStep((currentStep) => Math.min(currentStep + 1, questionsBySection.length - 1));
  };

  const onSubmit = (values: QuestionnaireValues) => {
    const activePolicy = getActiveRecommendationPolicy();
    const activePolicyMetadata = getActivePolicyMetadata();
    const result = decide(values, activePolicy);
    saveQuestionnaireDraft(values);
    saveDecisionResult(values, result, activePolicyMetadata);
    const routeState: QuestionnaireResultState = {
      input: values,
      result
    };

    navigate('/result', {
      state: routeState
    });
  };

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        spacing={3}
        noValidate
        onSubmit={handleSubmit(onSubmit, () => setStepError(false))}
        aria-label="Recommendation questionnaire"
        sx={{ px: { xs: 2, sm: 3, md: 4, lg: 4 } }}
      >
        {stepError ? (
          <Alert severity="error">Answer the required questions in this section to continue.</Alert>
        ) : null}

        {isFinalStep && Object.keys(errors).length > 0 ? (
          <Alert severity="error">Review the highlighted questions before submitting.</Alert>
        ) : null}

        <QuestionnaireProgressHeader
          sectionIndex={activeStep}
          sectionCount={questionsBySection.length}
          sectionTitle={currentSection.title}
          answeredCount={answeredCount}
          totalQuestionCount={totalQuestionCount}
        />

        <QuestionSection
          sectionIndex={activeStep}
          questions={currentSection.questions}
        />

        <Stack spacing={1.5}>
          <StepNavigation
            isFirstStep={activeStep === 0}
            isFinalStep={isFinalStep}
            isSubmitting={isSubmitting}
            onBack={handleBack}
            onContinue={handleContinue}
            secondaryAction={
              <Button
                type="button"
                variant="text"
                color="inherit"
                onClick={onRequestClear}
                sx={{ px: 0, minWidth: 0, textTransform: 'none' }}
              >
                Clear saved answers
              </Button>
            }
          />
          {isFinalStep && Object.keys(errors).length > 0 ? (
            <FormHelperText error>All questions are required.</FormHelperText>
          ) : null}
        </Stack>
      </Stack>
    </FormProvider>
  );
}

export default function QuestionnairePage() {
  const [formSeed, setFormSeed] = useState(0);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearConfirmationVisible, setIsClearConfirmationVisible] = useState(false);
  const [savedDraft, setSavedDraft] = useState(() => loadQuestionnaireDraft());

  const handleConfirmClear = () => {
    clearRecommendationSession();
    setSavedDraft(null);
    setIsClearDialogOpen(false);
    setFormSeed((currentSeed) => currentSeed + 1);
    setIsClearConfirmationVisible(true);
  };

  return (
    <Container maxWidth="lg" disableGutters sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ width: '100%', maxWidth: 1180, mx: 'auto' }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <AssessmentHero />
          <QuestionnaireForm
            key={formSeed}
            savedDraft={savedDraft}
            onRequestClear={() => setIsClearDialogOpen(true)}
          />
        </Stack>
      </Box>
      <ClearSavedAnswersDialog
        open={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleConfirmClear}
      />
      <Snackbar
        open={isClearConfirmationVisible}
        autoHideDuration={4000}
        onClose={() => setIsClearConfirmationVisible(false)}
        message="Saved answers cleared."
      />
    </Container>
  );
}
