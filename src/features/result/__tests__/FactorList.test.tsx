import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import type { AppliedRule } from '../../../decision/types/DecisionResult';
import FactorList from '../FactorList';

const factors: AppliedRule[] = [
  {
    ruleId: 'advanced-grid',
    label: 'Advanced grid needs',
    intent: 'Recognize advanced grid requirements.',
    reason: 'Advanced grid requirements make premium grid features more valuable.',
    ruleType: 'base',
    scores: { mui_x_premium: 2 }
  },
  {
    ruleId: 'standardization',
    label: 'Cross-app standardization',
    intent: 'Reward shared standards across apps.',
    reason: 'Cross-app consistency increases the value of a shared component foundation.',
    ruleType: 'interaction',
    scores: { mui_core: 1, mui_x_premium: 1 }
  }
];

function renderFactorList() {
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FactorList factors={factors} density="comfortable" />
    </ThemeProvider>
  );
}

describe('FactorList', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders factor labels and reasons as a simple list', () => {
    renderFactorList();

    expect(screen.getByText(/advanced grid needs/i)).toBeInTheDocument();
    expect(
      screen.getByText(/advanced grid requirements make premium grid features more valuable\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/cross-app standardization/i)).toBeInTheDocument();
    expect(
      screen.getByText(/cross-app consistency increases the value of a shared component foundation\./i)
    ).toBeInTheDocument();
  });
});
