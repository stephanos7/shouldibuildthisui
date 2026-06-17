import { LinearProgress, Stack, Typography } from '@mui/material';

type QuestionnaireProgressProps = {
  activeStep: number;
  answeredCount: number;
  totalQuestionCount: number;
  totalSteps: number;
};

export default function QuestionnaireProgress({
  activeStep,
  answeredCount,
  totalQuestionCount,
  totalSteps
}: QuestionnaireProgressProps) {
  const completionPercent = totalQuestionCount === 0 ? 0 : (answeredCount / totalQuestionCount) * 100;

  return (
    <Stack spacing={1.25}>
      <Typography variant="body2" color="text.secondary">
        Step {activeStep + 1} of {totalSteps}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={completionPercent}
        aria-label="Questionnaire completion"
      />
      <Typography variant="body2" color="text.secondary">
        {answeredCount} of {totalQuestionCount} answered
      </Typography>
    </Stack>
  );
}
