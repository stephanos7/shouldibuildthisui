import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { theme } from '../../../app/theme';
import StepNavigation from '../StepNavigation';

function renderStepNavigation({
  isFirstStep = false,
  isFinalStep = false
} = {}) {
  const onBack = vi.fn();
  const onContinue = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StepNavigation
        isFirstStep={isFirstStep}
        isFinalStep={isFinalStep}
        isSubmitting={false}
        onBack={onBack}
        onContinue={onContinue}
        secondaryAction={<button type="button">Clear saved answers</button>}
      />
    </ThemeProvider>
  );

  return { onBack, onContinue };
}

afterEach(() => {
  cleanup();
});

describe('StepNavigation', () => {
  it('renders continue without a back button on the first step', () => {
    renderStepNavigation({ isFirstStep: true });

    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^back$/i })).not.toBeInTheDocument();
  });

  it('renders back and get recommendation on the final step', () => {
    renderStepNavigation({ isFinalStep: true });

    expect(screen.getByRole('button', { name: /^back$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get recommendation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear saved answers/i })).toBeInTheDocument();
  });
});
