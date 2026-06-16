import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { routes } from '../../../app/routes';
import { theme } from '../../../app/theme';
import { decide } from '../../../decision/engine/decide';
import { recommendationPolicy } from '../../../decision/policy/recommendationPolicy';
import { getPathDefinition } from '../resultContent';
import type { DecisionResult } from '../../../decision/types/DecisionResult';
import type { QuestionnaireResultState } from '../../questionnaire/questionnaireResultState';
import { STORAGE_KEYS } from '../../../shared/storage/localStorageKeys';
import { loadDecisionResult, saveDecisionResult } from '../../../shared/storage/recommendationStorage';

const questionnaireFixture = {
  frontendDeveloperCount: '20_49',
  teamCount: '4_7',
  reactAppCount: '5_10',
  designSystemMaturity: 'established',
  uiKnowledgeDistribution: 'some_specialists',
  designEngineeringFriction: 'high',
  standardizationIntent: 'cross_app_consistency',
  dataGridComplexity: 'advanced_grids',
  performanceCriticality: 'high',
  accessibilityCriticality: 'high',
  changeLeadTime: 'weeks',
  uiRegressionFrequency: 'frequent',
  deliveryUrgency: 'high',
  applicationCriticality: 'customer_facing',
  supportExpectation: 'enterprise_support',
  ownershipHorizon: 'long_term'
} as const;

const routeStateResult: DecisionResult = {
  decisionType: 'score',
  policyVersion: 'test-policy-v1',
  facts: questionnaireFixture,
  recommendation: 'mui_x_premium',
  rankedPaths: ['mui_x_premium', 'mui_x_enterprise', 'mui_core', 'build_it_yourself'],
  scores: {
    build_it_yourself: 0,
    mui_core: 1,
    mui_x_premium: 3,
    mui_x_enterprise: 2
  },
  confidence: 'low',
  appliedRules: [
    {
      ruleId: 'base-advanced-grid',
      label: 'Advanced grid needs',
      intent: 'Recognize advanced grid requirements.',
      reason: 'Advanced grid requirements make premium data grid capabilities more valuable.',
      ruleType: 'base',
      scores: {
        mui_x_premium: 2
      }
    },
    {
      ruleId: 'base-enterprise-support',
      label: 'Enterprise support demand',
      intent: 'Capture higher support requirements.',
      reason: 'Enterprise support requirements increase the value of enterprise packaging.',
      ruleType: 'base',
      scores: {
        mui_x_enterprise: 2
      }
    },
    {
      ruleId: 'base-standardization',
      label: 'Cross-app standardization',
      intent: 'Reward shared standards across apps.',
      reason: 'Cross-app consistency increases the value of a shared component foundation.',
      ruleType: 'base',
      scores: {
        mui_core: 1,
        mui_x_premium: 1
      }
    }
  ],
  explanation: {
    summary: 'Recommended mui_x_premium with a 1-point lead over mui_x_enterprise.',
    recommendationReasons: [
      'Advanced grid requirements make premium data grid capabilities more valuable.',
      'Cross-app consistency increases the value of a shared component foundation.'
    ],
    counterSignals: [],
    runnerUp: {
      path: 'mui_x_enterprise',
      scoreDelta: 1,
      reasons: ['Enterprise support requirements increase the value of enterprise packaging.']
    }
  }
};

const currentPolicyResult = decide(questionnaireFixture, recommendationPolicy);

function renderResultRoute(state?: QuestionnaireResultState) {
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

describe('ResultPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders a decision result from route state', () => {
    renderResultRoute({
      input: questionnaireFixture as QuestionnaireResultState['input'],
      result: routeStateResult
    });

    expect(screen.getByRole('heading', { name: /recommendation result/i })).toBeInTheDocument();
    expect(screen.getAllByText(/mui x premium/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/gate recommendation|scored recommendation/i)).toBeInTheDocument();
    expect(screen.getByText(/policy test-policy-v1/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /runner-up/i })).toBeInTheDocument();
    expect(
      screen.getByText(/this result is close\. the runner-up path may also be appropriate/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /score breakdown/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /applied rule explanations/i })).toBeInTheDocument();
    expect(screen.getByText(/advanced grid needs/i)).toBeInTheDocument();
    expect(screen.getByText(/enterprise support demand/i)).toBeInTheDocument();
    expect(screen.getByText(/^0$/)).toBeInTheDocument();
    expect(screen.getByText(/^1$/)).toBeInTheDocument();
    expect(screen.getByText(/^2$/)).toBeInTheDocument();
    expect(screen.getByText(/^3$/)).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('restores stored result when route state is missing', () => {
    saveDecisionResult(questionnaireFixture as QuestionnaireResultState['input'], currentPolicyResult);

    renderResultRoute();

    const recommendationLabel = getPathDefinition(currentPolicyResult.recommendation)?.label;

    expect(screen.getByRole('heading', { name: /recommendation result/i })).toBeInTheDocument();
    expect(screen.getByText(/current policy version: initial-production-policy-v1/i)).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(recommendationLabel ?? currentPolicyResult.recommendation, 'i'))[0]).toBeInTheDocument();
    expect(screen.getByText(new RegExp(currentPolicyResult.explanation.summary, 'i'))).toBeInTheDocument();
  });

  it('recomputes result when stored policy version differs', async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.decisionResult,
      JSON.stringify({
        version: 1,
        savedAt: '2026-01-01T00:00:00.000Z',
        input: questionnaireFixture,
        result: routeStateResult
      })
    );

    renderResultRoute();

    const expectedLabel = getPathDefinition(currentPolicyResult.recommendation)?.label;

    expect(screen.getAllByText(new RegExp(expectedLabel ?? currentPolicyResult.recommendation, 'i'))[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(loadDecisionResult()?.result.policyVersion).toBe(recommendationPolicy.version);
    });
  });

  it('renders a fallback when no stored result exists', () => {
    renderResultRoute();

    expect(screen.getByRole('heading', { name: /recommendation result/i })).toBeInTheDocument();
    expect(
      screen.getByText(/no questionnaire submission was found\. start from the questionnaire/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to questionnaire/i })).toHaveAttribute('href', '/');
  });

  it('clears the session when the user starts over', async () => {
    const { router } = renderResultRoute({
      input: questionnaireFixture as QuestionnaireResultState['input'],
      result: routeStateResult
    });

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.decisionResult)).not.toBeNull();
    });

    screen.getByRole('button', { name: /start over/i }).click();

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });

    expect(window.localStorage.getItem(STORAGE_KEYS.decisionResult)).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEYS.questionnaireDraft)).toBeNull();
  });
});
