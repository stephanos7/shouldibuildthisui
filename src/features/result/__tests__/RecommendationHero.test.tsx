import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import RecommendationHero from '../RecommendationHero';
import {
  highConfidenceResult,
  lowConfidenceResult,
  mediumConfidenceResult,
  negativeScoreResult
} from '../__fixtures__/resultFixtures';
import type { DecisionResult } from '../../../decision/types/DecisionResult';

function renderHero(result: DecisionResult) {
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecommendationHero result={result} />
    </ThemeProvider>
  );
}

describe('RecommendationHero', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the dominant recommendation summary and runner-up context', () => {
    renderHero(lowConfidenceResult);

    expect(screen.getByText(/recommended path/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /mui x premium/i })).toBeInTheDocument();
    expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/executive summary/i)).toBeInTheDocument();
    expect(screen.getByText(/it leads mui x enterprise by 1-point lead\./i)).toBeInTheDocument();
    expect(screen.getByText(/runner-up: mui x enterprise\./i)).toBeInTheDocument();
  });

  it('renders the medium and high confidence labels', () => {
    renderHero(mediumConfidenceResult);
    expect(screen.getByText(/medium confidence/i)).toBeInTheDocument();

    cleanup();
    renderHero(highConfidenceResult);
    expect(screen.getByText(/high confidence/i)).toBeInTheDocument();
  });

  it('falls back cleanly for a negative-score recommendation', () => {
    renderHero(negativeScoreResult);

    expect(screen.getByRole('heading', { name: /build it yourself/i })).toBeInTheDocument();
    expect(screen.getByText(/high confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/it ties mui core\./i)).toBeInTheDocument();
  });
});
