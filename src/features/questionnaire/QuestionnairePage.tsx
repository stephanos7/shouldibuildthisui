import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Box, Container, Paper, Snackbar, Stack } from '@mui/material';
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
import { questionsBySection } from './questions';
import { questionnaireSchema, type QuestionnaireValues } from './questionnaireSchema';
import type { QuestionnaireResultState } from './questionnaireResultState';
import QuestionnaireProgressHeader from './QuestionnaireProgressHeader';
import StepNavigation from './StepNavigation';

const emptyQuestionnaireValues = {} as QuestionnaireValues;

function isAnswered(value: unknown) {
  return value !== undefined && value !== null && value !== '';
}

function getCompletedSectionIndexes(values: Partial<QuestionnaireValues> | undefined) {
  return questionsBySection.flatMap(({ questionIds }, sectionIndex) =>
    questionIds.every((questionId) => isAnswered(values?.[questionId])) ? [sectionIndex] : []
  );
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
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const methods = useForm<QuestionnaireValues>({
    resolver: zodResolver(questionnaireSchema),
    mode: 'onBlur',
    defaultValues: savedDraft ?? emptyQuestionnaireValues
  });
  const persistenceReadyRef = useRef(false);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    trigger
  } = methods;
  const watchedValues = useWatch({ control });
  const currentSection = questionsBySection[activeStep];
  const isFinalStep = activeStep === questionsBySection.length - 1;
  const completedSectionIndexes = getCompletedSectionIndexes(watchedValues);

  useEffect(() => {
    if (!persistenceReadyRef.current) {
      persistenceReadyRef.current = true;
      return;
    }

    saveQuestionnaireDraft(watchedValues as QuestionnaireValues);
  }, [watchedValues]);

  const handleBack = () => {
    setValidationMessage(null);
    setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  const handleContinue = async () => {
    const isStepValid = await trigger(currentSection.questionIds);

    if (!isStepValid) {
      setValidationMessage('Answer the required questions in this section to continue.');
      return;
    }

    setValidationMessage(null);
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
      <>
        <Stack
          component="form"
          spacing={3}
          noValidate
          onSubmit={handleSubmit(onSubmit, () => {
            setValidationMessage('Review the highlighted questions before submitting.');
          })}
          aria-label="Recommendation questionnaire"
          sx={{ width: '100%' }}
        >
          <QuestionnaireProgressHeader
            sectionIndex={activeStep}
            sectionCount={questionsBySection.length}
            completedSectionIndexes={completedSectionIndexes}
          />

          <QuestionSection
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
          </Stack>
        </Stack>
        <Snackbar
          open={validationMessage !== null}
          autoHideDuration={4000}
          onClose={() => setValidationMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setValidationMessage(null)}
            sx={{ width: '100%' }}
          >
            {validationMessage}
          </Alert>
        </Snackbar>
      </>
    </FormProvider>
  );
}

export default function QuestionnairePage() {
  const [formSeed, setFormSeed] = useState(0);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearConfirmationVisible, setIsClearConfirmationVisible] = useState(false);
  const [savedDraft, setSavedDraft] = useState(() => loadQuestionnaireDraft());
  const [hasStarted, setHasStarted] = useState(false);

  const handleConfirmClear = () => {
    clearRecommendationSession();
    setSavedDraft(null);
    setIsClearDialogOpen(false);
    setFormSeed((currentSeed) => currentSeed + 1);
    setIsClearConfirmationVisible(true);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ py: hasStarted ? { xs: 2.5, md: 5 } : 0 }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: hasStarted ? 1320 : 'none',
          mx: 'auto',
          px: hasStarted ? { xs: 2, sm: 3, md: 5 } : 0
        }}
      >
        {hasStarted ? (
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 5 },
              borderRadius: '32px',
              bgcolor: 'rgba(255, 255, 255, 0.84)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 24px 80px rgba(17, 17, 17, 0.06)'
            }}
          >
            <QuestionnaireForm
              key={formSeed}
              savedDraft={savedDraft}
              onRequestClear={() => setIsClearDialogOpen(true)}
            />
          </Paper>
        ) : (
          <AssessmentHero
            hasSavedDraft={savedDraft !== null}
            onStart={() => setHasStarted(true)}
          />
        )}
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
