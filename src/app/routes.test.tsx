import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { decide } from '../decision/engine/decide';
import { recommendationPolicy } from '../decision/policy/recommendationPolicy';
import { getActivePolicyMetadata } from '../decision/recalibration/getActivePolicyMetadata';
import { saveDecisionResult } from '../shared/storage/recommendationStorage';
import type { QuestionnaireValues } from '../features/questionnaire/questionnaireSchema';
import { routes } from './routes';

const questionnaireFixture: QuestionnaireValues = {
  frontendDeveloperCount: '1_9',
  teamCount: '1',
  reactAppCount: '1',
  designSystemMaturity: 'none',
  uiKnowledgeDistribution: 'distributed',
  designEngineeringFriction: 'low',
  standardizationIntent: 'none',
  dataGridComplexity: 'none',
  performanceCriticality: 'low',
  accessibilityCriticality: 'low',
  changeLeadTime: 'same_day',
  uiRegressionFrequency: 'rare',
  deliveryUrgency: 'low',
  applicationCriticality: 'internal_tool',
  supportExpectation: 'self_serve',
  ownershipHorizon: 'prototype'
};

function renderRoute(initialPath: string) {
  const memoryRouter = createMemoryRouter(routes, {
    initialEntries: [initialPath]
  });

  return render(<RouterProvider router={memoryRouter} />);
}

describe('app routes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders the home route', () => {
    renderRoute('/');

    expect(
      screen.getByRole('heading', {
        name: /find the best path for your react ui/i
      })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('banner')[0]).toHaveStyle({ position: 'static' });
    expect(screen.queryByRole('button', { name: /calibration/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /recalibration/i })).not.toBeInTheDocument();
  });

  it('renders the result route', () => {
    saveDecisionResult(
      questionnaireFixture,
      decide(questionnaireFixture, recommendationPolicy),
      getActivePolicyMetadata()
    );
    renderRoute('/result');

    expect(screen.getByRole('heading', { level: 2, name: /build it yourself/i })).toBeInTheDocument();
  });

  it('renders the calibration route', () => {
    renderRoute('/internal/calibration');

    expect(screen.getByRole('heading', { name: /internal calibration/i })).toBeInTheDocument();
  });

  it('renders the recalibration route', () => {
    renderRoute('/internal/recalibration');

    expect(screen.getByRole('heading', { name: /internal recalibration/i })).toBeInTheDocument();
  });
});
