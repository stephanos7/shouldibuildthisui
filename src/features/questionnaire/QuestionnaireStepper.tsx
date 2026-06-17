import {
  MobileStepper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import type { QuestionnaireSectionDefinition } from './questionnaireTypes';

type QuestionnaireStepperProps = {
  activeStep: number;
  sections: QuestionnaireSectionDefinition[];
};

export default function QuestionnaireStepper({
  activeStep,
  sections
}: QuestionnaireStepperProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (isSmallScreen) {
    return (
      <MobileStepper
        variant="progress"
        steps={sections.length}
        position="static"
        activeStep={activeStep}
        nextButton={null}
        backButton={null}
        sx={{ px: 0, bgcolor: 'transparent' }}
      />
    );
  }

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {sections.map((section) => (
        <Step key={section.id}>
          <StepLabel>
            <Typography variant="body2">{section.title}</Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
