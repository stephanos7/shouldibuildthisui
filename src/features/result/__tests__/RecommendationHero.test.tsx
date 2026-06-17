import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import RecommendationHero from '../RecommendationHero';
import type { DecisionResult } from '../../../decision/types/DecisionResult';

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
  appliedRules: [],
  explanation: {
    summary: 'Recommended mui_x_premium with a 1-point lead over mui_x_enterprise.',
    recommendationReasons: [],
    counterSignals: [],
    runnerUp: {
      path: 'mui_x_enterprise',
      scoreDelta: 1,
      reasons: []
    }
  }
};

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
    renderHero(resultFixture);

    expect(screen.getByText(/recommended path/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /mui x premium/i })).toBeInTheDocument();
    expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/executive summary/i)).toBeInTheDocument();
    expect(screen.getByText(/it leads mui x enterprise by 1-point lead\./i)).toBeInTheDocument();
    expect(screen.getByText(/runner-up: mui x enterprise\./i)).toBeInTheDocument();
  });

  it('omits the runner-up copy when no runner-up is present', () => {
    renderHero({
      ...resultFixture,
      recommendation: 'build_it_yourself',
      rankedPaths: ['build_it_yourself', 'mui_core', 'mui_x_premium', 'mui_x_enterprise'],
      scores: {
        build_it_yourself: 5,
        mui_core: 0,
        mui_x_premium: 0,
        mui_x_enterprise: 0
      },
      explanation: {
        summary: 'Recommended build_it_yourself with a clear lead and no competing positive scores.',
        recommendationReasons: [],
        counterSignals: []
      }
    });

    expect(screen.queryByText(/runner-up:/i)).not.toBeInTheDocument();
  });
});
