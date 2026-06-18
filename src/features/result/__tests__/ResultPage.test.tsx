import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { routes } from '../../../app/routes';
import { theme } from '../../../app/theme';
import { decide } from '../../../decision/engine/decide';
import { recommendationPolicy } from '../../../decision/policy/recommendationPolicy';
import { getActivePolicyMetadata } from '../../../decision/recalibration/getActivePolicyMetadata';
import type { QuestionnaireResultState } from '../../questionnaire/questionnaireResultState';
import { saveRecalibrationOverrides } from '../../../shared/storage/recalibrationStorage';
import {
  loadDecisionResult,
  saveDecisionResult
} from '../../../shared/storage/recommendationStorage';
import {
  localRecalibrationMetadata,
  missingResult,
  noGateQuestionnaireFacts,
  scoreResult,
  tenAppliedRulesResult,
  questionnaireFacts
} from '../__fixtures__/resultFixtures';

const currentPolicyResult = decide(questionnaireFacts, recommendationPolicy);
const currentPolicyMetadata = getActivePolicyMetadata(null);

function renderResultRoute(state?: QuestionnaireResultState | null) {
  const router = createMemoryRouter(routes, {
    initialEntries: [
      {
        pathname: '/result',
        state
      }
    ]
  });

  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );

  return { router };
}

function expectDocumentOrder(elements: HTMLElement[]) {
  for (let index = 0; index < elements.length - 1; index += 1) {
    expect(
      elements[index]?.compareDocumentPosition(elements[index + 1] as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  }
}

describe('ResultPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders the report with one h1 and no removed sections', () => {
    renderResultRoute({
      input: questionnaireFacts as QuestionnaireResultState['input'],
      result: scoreResult
    });

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    expect(screen.getByRole('heading', { level: 2, name: /mui x premium/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /key factors behind this recommendation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /path comparison/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/^mui_x_premium$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^mui_x_enterprise$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^build_it_yourself$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^mui_core$/i)).not.toBeInTheDocument();
  });

  it('keeps the major sections in document order', () => {
    renderResultRoute({
      input: questionnaireFacts as QuestionnaireResultState['input'],
      result: scoreResult
    });

    expectDocumentOrder([
      screen.getByRole('heading', { level: 2, name: /mui x premium/i }),
      screen.getByRole('heading', { name: /key factors behind this recommendation/i }),
      screen.getByRole('heading', { name: /path comparison/i })
    ]);
  });

  it('expands the ten-rule factor list and hides the rest behind disclosure', () => {
    renderResultRoute({
      input: questionnaireFacts as QuestionnaireResultState['input'],
      result: tenAppliedRulesResult
    });

    const topList = screen.getByRole('list', { name: /top scoring factors/i });

    expect(within(topList).getByText(/factor 10/i)).toBeInTheDocument();
    expect(within(topList).getByText(/factor 9/i)).toBeInTheDocument();
    expect(within(topList).getByText(/factor 8/i)).toBeInTheDocument();
    expect(within(topList).queryByText(/factor 7/i)).not.toBeInTheDocument();

    const disclosureButton = screen.getByRole('button', { name: /show 7 more factors/i });
    fireEvent.click(disclosureButton);

    expect(
      screen.getByRole('button', { name: /hide additional factors/i })
    ).toBeInTheDocument();
    const additionalList = screen.getByRole('list', { name: /additional scoring factors/i });
    expect(within(additionalList).getByText(/^factor 1$/i)).toBeInTheDocument();
    expect(within(additionalList).queryByText(/^factor 8$/i)).not.toBeInTheDocument();
    expect(within(additionalList).queryByText(/^factor 10$/i)).not.toBeInTheDocument();
  });

  it('renders the missing-result fallback with a clear primary action', () => {
    renderResultRoute(missingResult);

    expect(screen.getByRole('heading', { name: /no recommendation found/i })).toBeInTheDocument();
    expect(
      screen.getByText(/complete the assessment to generate a recommendation report\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start assessment/i })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('restores stored results and recomputes against the active policy when needed', async () => {
    saveDecisionResult(
      questionnaireFacts as QuestionnaireResultState['input'],
      currentPolicyResult,
      currentPolicyMetadata
    );

    renderResultRoute();

    expect(screen.getAllByText(/mui x premium/i).length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(loadDecisionResult()?.result.policyVersion).toBe(recommendationPolicy.version);
    });
  });

  it('recomputes a stored result against the active recalibrated policy', async () => {
    saveRecalibrationOverrides({
      version: 1,
      policyVersion: recommendationPolicy.version,
      updatedAt: '2026-01-01T00:00:00.000Z',
      overrides: {
        'scope-single-team-local-choice': {
          ruleId: 'scope-single-team-local-choice',
          scores: {
            build_it_yourself: 0,
            mui_core: 4
          },
          reason: 'Single-team scope now prefers a reusable shared foundation.',
          updatedAt: '2026-01-01T00:00:00.000Z'
        }
      }
    });

    saveDecisionResult(
      noGateQuestionnaireFacts as QuestionnaireResultState['input'],
      decide(noGateQuestionnaireFacts, recommendationPolicy),
      localRecalibrationMetadata
    );

    renderResultRoute();

    expect((await screen.findAllByText(/mui core/i)).length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(loadDecisionResult()?.metadata).toEqual({
        policyVersion: recommendationPolicy.version,
        recalibrationUpdatedAt: '2026-01-01T00:00:00.000Z',
        hasLocalOverrides: true
      });
    });
  });
});
