import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { routes } from '../../../app/routes';
import { theme } from '../../../app/theme';
import type { DecisionResult } from '../../../decision/types/DecisionResult';
import type { QuestionnaireResultState } from '../../questionnaire/questionnaireResultState';

const resultFixture: DecisionResult = {
  decisionType: 'score',
  policyVersion: 'test-policy-v1',
  facts: {
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
  },
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
}

describe('ResultPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a decision result from route state', () => {
    renderResultRoute({
      input: {} as QuestionnaireResultState['input'],
      result: resultFixture
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

  it('renders a fallback when route state is missing', () => {
    renderResultRoute();

    expect(screen.getByRole('heading', { name: /recommendation result/i })).toBeInTheDocument();
    expect(
      screen.getByText(/no questionnaire submission was found\. start from the questionnaire/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to questionnaire/i })).toHaveAttribute('href', '/');
  });
});
