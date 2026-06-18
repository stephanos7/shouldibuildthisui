import { Box, Button } from '@mui/material';
import type { ReactNode } from 'react';

type StepNavigationProps = {
  isFirstStep: boolean;
  isFinalStep: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onContinue: () => void;
  secondaryAction: ReactNode;
};

export default function StepNavigation({
  isFirstStep,
  isFinalStep,
  isSubmitting,
  onBack,
  onContinue,
  secondaryAction
}: StepNavigationProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        pt: { xs: 3, md: 3.5 },
        mt: { xs: 1, md: 1.5 },
        borderTop: 1,
        borderColor: 'divider',
        alignItems: 'center',
        gridTemplateColumns: {
          xs: '1fr',
          md: isFirstStep ? '1fr auto auto' : 'auto 1fr auto'
        }
      }}
    >
      {isFirstStep ? <Box sx={{ display: { xs: 'none', md: 'block' } }} /> : (
        <Button
          type="button"
          variant="outlined"
          onClick={onBack}
          disabled={isSubmitting}
          size="large"
          sx={{ width: { xs: '100%', md: 'auto' }, justifySelf: 'start' }}
        >
          Back
        </Button>
      )}
      <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
        {secondaryAction}
      </Box>
      <Button
        type={isFinalStep ? 'submit' : 'button'}
        variant="contained"
        onClick={isFinalStep ? undefined : onContinue}
        disabled={isSubmitting}
        size="large"
        sx={{ width: { xs: '100%', md: 'auto' }, justifySelf: 'end' }}
      >
        {isFinalStep ? 'Get recommendation' : 'Continue'}
      </Button>
    </Box>
  );
}
