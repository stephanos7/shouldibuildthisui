import { Box, Button, Stack } from '@mui/material';

type StepNavigationProps = {
  isFirstStep: boolean;
  isFinalStep: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onContinue: () => void;
};

export default function StepNavigation({
  isFirstStep,
  isFinalStep,
  isSubmitting,
  onBack,
  onContinue
}: StepNavigationProps) {
  return (
    <Box
      sx={{
        position: { xs: 'sticky', md: 'static' },
        bottom: 0,
        bgcolor: 'background.paper',
        py: 2,
        borderTop: { xs: 1, md: 0 },
        borderColor: 'divider'
      }}
    >
      <Stack direction="row" spacing={1.5} justifyContent="space-between">
        <Button
          type="button"
          variant="outlined"
          onClick={onBack}
          disabled={isFirstStep || isSubmitting}
          sx={{ visibility: isFirstStep ? 'hidden' : 'visible' }}
        >
          Back
        </Button>
        <Button
          type={isFinalStep ? 'submit' : 'button'}
          variant="contained"
          onClick={isFinalStep ? undefined : onContinue}
          disabled={isSubmitting}
        >
          {isFinalStep ? 'Get recommendation' : 'Continue'}
        </Button>
      </Stack>
    </Box>
  );
}
