import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import ScoreComparison from '../ScoreComparison';
import {
  allZeroScoreResult,
  negativeScoreResult,
  scoreResult
} from '../__fixtures__/resultFixtures';
import type { DecisionResult } from '../../../decision/types/DecisionResult';

function renderScoreComparison(result: DecisionResult) {
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScoreComparison result={result} />
    </ThemeProvider>
  );
}

describe('ScoreComparison', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders all four paths with descriptions and numeric scores', () => {
    renderScoreComparison(scoreResult);

    expect(screen.getByRole('heading', { name: /path comparison/i })).toBeInTheDocument();
    expect(screen.getByText(/build it yourself/i)).toBeInTheDocument();
    expect(screen.getByText(/mui core/i)).toBeInTheDocument();
    expect(screen.getAllByText(/mui x premium/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/mui x enterprise/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        /best for narrow, low-risk work where long-term platform overhead is unnecessary\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/^0$/)).toBeInTheDocument();
    expect(screen.getByText(/^1$/)).toBeInTheDocument();
    expect(screen.getByText(/^2$/)).toBeInTheDocument();
    expect(screen.getByText(/^3$/)).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('renders paths in ranked order with recommended and runner-up markers', () => {
    renderScoreComparison(scoreResult);

    const progressbars = screen.getAllByRole('progressbar');

    expect(progressbars).toHaveLength(4);
    expect(progressbars[0]).toHaveAccessibleName(/mui x premium score 3/i);
    expect(progressbars[1]).toHaveAccessibleName(/mui x enterprise score 2/i);
    expect(progressbars[2]).toHaveAccessibleName(/mui core score 1/i);
    expect(progressbars[3]).toHaveAccessibleName(/build it yourself score 0/i);

    const recommendedChip = screen.getByText(/^recommended$/i);
    const runnerUpChip = screen.getByText(/runner-up/i);

    expect(
      within(recommendedChip.closest('[class*="MuiStack-root"]') as HTMLElement).getByText(
        /mui x premium/i
      )
    ).toBeInTheDocument();
    expect(
      within(runnerUpChip.closest('[class*="MuiStack-root"]') as HTMLElement).getByText(
        /mui x enterprise/i
      )
    ).toBeInTheDocument();
  });

  it('renders gate and negative score states without crashing', () => {
    renderScoreComparison(negativeScoreResult);

    expect(screen.getByText(/scores are close or low across all paths\./i)).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(4);
    expect(screen.getAllByText(/^0$/)).toHaveLength(2);
    expect(screen.getByText(/^-1$/)).toBeInTheDocument();
    expect(screen.getByText(/^-2$/)).toBeInTheDocument();
  });

  it('renders the all-zero score state without crashing', () => {
    renderScoreComparison(allZeroScoreResult);

    expect(screen.getByText(/scores are close or low across all paths\./i)).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(4);
    expect(screen.getAllByText(/^0$/)).toHaveLength(4);
  });
});
