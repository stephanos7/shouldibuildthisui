import { CssBaseline, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { routes } from '../../../app/routes';
import { theme } from '../../../app/theme';
import { recommendationPolicy } from '../../../decision/policy/recommendationPolicy';
import { STORAGE_KEYS } from '../../../shared/storage/localStorageKeys';
import { loadDecisionResult, loadQuestionnaireDraft } from '../../../shared/storage/recommendationStorage';
import type { QuestionnaireValues } from '../questionnaireSchema';

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

const answerLabels = [
  /1-9 developers/i,
  /1 team/i,
  /1 application/i,
  /no real design system/i,
  /low friction/i,
  /no explicit standardization goal/i,
  /well distributed across contributors/i,
  /usually the same day/i,
  /rarely/i,
  /prototype or disposable exploration/i,
  /no meaningful grid requirements/i,
  /low criticality/i,
  /low priority/i,
  /internal tool/i,
  /self-serve documentation and community/i,
  /low urgency/i
];

function renderQuestionnaire(initialPath = '/') {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath]
  });

  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );

  return { router };
}

function fillQuestionnaire() {
  for (const label of answerLabels) {
    fireEvent.click(screen.getAllByRole('radio', { name: label })[0]);
  }
}

describe('QuestionnairePage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('restores saved draft into form defaults', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.questionnaireDraft,
      JSON.stringify({
        version: 1,
        savedAt: '2026-01-01T00:00:00.000Z',
        values: questionnaireFixture
      })
    );

    renderQuestionnaire();

    expect(screen.getByRole('radio', { name: /1-9 developers/i, checked: true })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /1 team/i, checked: true })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /no real design system/i, checked: true })).toBeInTheDocument();
  });

  it('persists form values after change and saves the result on submit', async () => {
    renderQuestionnaire();

    fireEvent.click(screen.getAllByRole('radio', { name: /10-19 developers/i })[0]);

    await waitFor(() => {
      expect(loadQuestionnaireDraft()?.frontendDeveloperCount).toBe('10_19');
    });

    fillQuestionnaire();

    fireEvent.click(screen.getAllByRole('button', { name: /get recommendation/i })[0]);

    expect(await screen.findByRole('heading', { name: /recommendation result/i })).toBeInTheDocument();

    const storedDraft = loadQuestionnaireDraft();
    const storedResult = loadDecisionResult();

    expect(storedDraft).toEqual(questionnaireFixture);
    expect(storedResult?.input).toEqual(questionnaireFixture);
    expect(storedResult?.result.policyVersion).toBe(recommendationPolicy.version);
    expect(screen.getByRole('heading', { name: /recommendation result/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEYS.decisionResult)).not.toBeNull();
  });

  it('clears saved answers from storage and the current form, with actions at the top and bottom', async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.questionnaireDraft,
      JSON.stringify({
        version: 1,
        savedAt: '2026-01-01T00:00:00.000Z',
        values: questionnaireFixture
      })
    );

    renderQuestionnaire();

    const clearButtons = screen.getAllByRole('button', { name: /clear saved answers/i });
    const form = clearButtons[0].closest('form');

    expect(clearButtons.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('radio', { name: /1-9 developers/i, checked: true })).toBeInTheDocument();
    expect(form).not.toBeNull();

    fireEvent.click(clearButtons[0]);

    await waitFor(() => {
      expect(loadQuestionnaireDraft()).toBeNull();
    });

    expect(
      within(form as HTMLFormElement).queryByRole('radio', { name: /1-9 developers/i, checked: true })
    ).not.toBeInTheDocument();
    expect(
      within(form as HTMLFormElement).queryByRole('radio', { name: /1 team/i, checked: true })
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEYS.questionnaireDraft)).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEYS.decisionResult)).toBeNull();
  });
});
