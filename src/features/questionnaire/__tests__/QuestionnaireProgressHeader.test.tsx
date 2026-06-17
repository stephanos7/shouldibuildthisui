import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import QuestionnaireProgressHeader from '../QuestionnaireProgressHeader';

afterEach(() => {
  cleanup();
});

describe('QuestionnaireProgressHeader', () => {
  it('renders section metadata, title, and accessible progress', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QuestionnaireProgressHeader
          sectionIndex={1}
          sectionCount={4}
          sectionTitle="Design System and Workflow"
          answeredCount={6}
          totalQuestionCount={16}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/section 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /design system and workflow/i })).toBeInTheDocument();
    expect(screen.getByText(/6 of 16 answered/i)).toBeInTheDocument();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /assessment completion progress/i })).toBeInTheDocument();
  });

  it('calculates completion from the answered count', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QuestionnaireProgressHeader
          sectionIndex={0}
          sectionCount={4}
          sectionTitle="Team and Scale"
          answeredCount={5}
          totalQuestionCount={16}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('progressbar', { name: /assessment completion progress/i })).toHaveAttribute(
      'aria-valuenow',
      '31'
    );
  });
});
