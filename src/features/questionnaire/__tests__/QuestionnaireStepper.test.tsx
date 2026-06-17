import { ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import QuestionnaireStepper from '../QuestionnaireStepper';
import { questionnaireSections } from '../questions';

describe('QuestionnaireStepper', () => {
  it('renders the section titles for the guided flow', () => {
    render(
      <ThemeProvider theme={theme}>
        <QuestionnaireStepper activeStep={1} sections={questionnaireSections} />
      </ThemeProvider>
    );

    expect(screen.getByText(/team and scale/i)).toBeInTheDocument();
    expect(screen.getByText(/design system and workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/maintainability risk/i)).toBeInTheDocument();
    expect(screen.getByText(/advanced ui needs/i)).toBeInTheDocument();
    expect(screen.getByText(/quality, support, and delivery/i)).toBeInTheDocument();
  });
});
