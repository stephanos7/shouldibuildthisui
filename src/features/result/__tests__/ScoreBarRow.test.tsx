import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import ScoreBarRow from '../ScoreBarRow';
import type { ScoreComparisonRow } from '../resultContent';

function renderScoreBarRow(row: ScoreComparisonRow) {
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScoreBarRow row={row} />
    </ThemeProvider>
  );
}

describe('ScoreBarRow', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders labels, chips, description, and numeric score', () => {
    renderScoreBarRow({
      path: 'mui_x_premium',
      label: 'MUI X Premium',
      description: 'Advanced UI support across growing teams.',
      score: 3,
      normalizedScore: 100,
      isRecommended: true,
      isRunnerUp: false
    });

    expect(screen.getByText(/mui x premium/i)).toBeInTheDocument();
    expect(screen.getByText(/recommended/i)).toBeInTheDocument();
    expect(screen.getByText(/^3$/)).toBeInTheDocument();
    expect(
      screen.getByText(/advanced ui support across growing teams\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /mui x premium score 3/i })).toBeInTheDocument();
  });

  it('renders negative scores without crashing and keeps the runner-up chip', () => {
    renderScoreBarRow({
      path: 'mui_core',
      label: 'MUI Core',
      description: 'Shared UI foundations.',
      score: -2,
      normalizedScore: 0,
      isRecommended: false,
      isRunnerUp: true
    });

    expect(screen.getByText(/runner-up/i)).toBeInTheDocument();
    expect(screen.getByText(/^-2$/)).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /mui core score -2/i })).toBeInTheDocument();
  });
});
