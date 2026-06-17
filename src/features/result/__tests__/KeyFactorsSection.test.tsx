import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import type { AppliedRule } from '../../../decision/types/DecisionResult';
import KeyFactorsSection from '../KeyFactorsSection';

function buildRule(index: number, premiumScore?: number): AppliedRule {
  return {
    ruleId: `rule-${index}`,
    label: `Factor ${index}`,
    intent: `Intent ${index}`,
    reason: `Reason ${index}`,
    ruleType: 'interaction',
    scores: premiumScore === undefined ? undefined : { mui_x_premium: premiumScore }
  };
}

function renderKeyFactorsSection(appliedRules: AppliedRule[]) {
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <KeyFactorsSection appliedRules={appliedRules} recommendation="mui_x_premium" />
    </ThemeProvider>
  );
}

describe('KeyFactorsSection', () => {
  afterEach(() => {
    cleanup();
  });

  it('uses key factors wording instead of applied rules wording', () => {
    renderKeyFactorsSection([buildRule(1, 1)]);

    expect(
      screen.getByRole('heading', { name: /key factors behind this recommendation/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /applied rule explanations/i })
    ).not.toBeInTheDocument();
  });

  it('renders one factor without an accordion', () => {
    renderKeyFactorsSection([buildRule(1, 2)]);

    expect(screen.getByText(/factor 1/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /show/i })).not.toBeInTheDocument();
  });

  it('renders three factors without an accordion', () => {
    renderKeyFactorsSection([buildRule(1, 3), buildRule(2, 2), buildRule(3, 1)]);

    expect(screen.getByText(/factor 1/i)).toBeInTheDocument();
    expect(screen.getByText(/factor 2/i)).toBeInTheDocument();
    expect(screen.getByText(/factor 3/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /show/i })).not.toBeInTheDocument();
  });

  it('renders the top three factors inline and a disclosure for four factors', () => {
    renderKeyFactorsSection([
      buildRule(1, 1),
      buildRule(2, 4),
      buildRule(3, 3),
      buildRule(4, 2)
    ]);

    const topList = screen.getByRole('list', { name: /top scoring factors/i });

    expect(within(topList).getByText(/factor 2/i)).toBeInTheDocument();
    expect(within(topList).getByText(/factor 3/i)).toBeInTheDocument();
    expect(within(topList).getByText(/factor 4/i)).toBeInTheDocument();
    expect(within(topList).queryByText(/factor 1/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show 1 more factor/i })).toBeInTheDocument();
  });

  it('renders the top three factors inline and a disclosure for ten factors', () => {
    renderKeyFactorsSection([
      buildRule(1, 1),
      buildRule(2, 2),
      buildRule(3, 3),
      buildRule(4, 4),
      buildRule(5, 5),
      buildRule(6, 6),
      buildRule(7, 7),
      buildRule(8, 8),
      buildRule(9, 9),
      buildRule(10, 10)
    ]);

    const topList = screen.getByRole('list', { name: /top scoring factors/i });

    expect(within(topList).getByText(/factor 10/i)).toBeInTheDocument();
    expect(within(topList).getByText(/factor 9/i)).toBeInTheDocument();
    expect(within(topList).getByText(/factor 8/i)).toBeInTheDocument();
    expect(within(topList).queryByText(/factor 7/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show 7 more factors/i })).toBeInTheDocument();
  });

  it('shows only the hidden factors after expanding the disclosure', () => {
    renderKeyFactorsSection([
      buildRule(1, 1),
      buildRule(2, 4),
      buildRule(3, 3),
      buildRule(4, 2)
    ]);

    const button = screen.getByRole('button', { name: /show 1 more factor/i });
    fireEvent.click(button);

    expect(
      screen.getByRole('button', { name: /hide additional factors/i })
    ).toBeInTheDocument();
    const additionalList = screen.getByRole('list', { name: /additional scoring factors/i });
    expect(within(additionalList).getByText(/factor 1/i)).toBeInTheDocument();
    expect(within(additionalList).queryByText(/factor 2/i)).not.toBeInTheDocument();
    expect(within(additionalList).queryByText(/factor 3/i)).not.toBeInTheDocument();
    expect(within(additionalList).queryByText(/factor 4/i)).not.toBeInTheDocument();
  });

  it('renders the empty state when no applied rules exist', () => {
    renderKeyFactorsSection([]);

    expect(
      screen.getByText(/no scoring factors were returned for this recommendation\./i)
    ).toBeInTheDocument();
  });

  it('falls back to engine order when score metadata is not available', () => {
    renderKeyFactorsSection([buildRule(1), buildRule(2), buildRule(3), buildRule(4)]);

    const topList = screen.getByRole('list', { name: /top scoring factors/i });

    expect(within(topList).getByText(/factor 1/i)).toBeInTheDocument();
    expect(within(topList).getByText(/factor 2/i)).toBeInTheDocument();
    expect(within(topList).getByText(/factor 3/i)).toBeInTheDocument();
    expect(within(topList).queryByText(/factor 4/i)).not.toBeInTheDocument();
  });
});
