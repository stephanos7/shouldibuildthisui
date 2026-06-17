import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { routes } from '../../../app/routes';
import { theme } from '../../../app/theme';
import { decide } from '../../../decision/engine/decide';
import { recommendationPolicy } from '../../../decision/policy/recommendationPolicy';
import { getActivePolicyMetadata } from '../../../decision/recalibration/getActivePolicyMetadata';
import { STORAGE_KEYS } from '../../../shared/storage/localStorageKeys';
import { saveRecalibrationOverrides } from '../../../shared/storage/recalibrationStorage';
import {
  loadDecisionResult,
  loadQuestionnaireDraft,
  saveDecisionResult
} from '../../../shared/storage/recommendationStorage';
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

const nonGateQuestionnaireFixture: QuestionnaireValues = {
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
  applicationCriticality: 'customer_facing',
  supportExpectation: 'standard_support',
  ownershipHorizon: 'long_term'
};

const sectionAnswerLabels = [
  [/1-9 developers/i, /1 team/i, /1 application/i],
  [/no real design system/i, /low friction/i, /no explicit reuse goal/i],
  [
    /knowledge is well distributed/i,
    /usually the same day/i,
    /rarely/i,
    /prototype or disposable exploration/i
  ],
  [/no meaningful grid requirements/i, /low criticality/i],
  [/low priority/i, /internal tool/i, /self-serve documentation and community/i, /low urgency/i]
] as const;

const nonGateSectionAnswerLabels = [
  [/1-9 developers/i, /1 team/i, /1 application/i],
  [/no real design system/i, /low friction/i, /no explicit reuse goal/i],
  [/knowledge is well distributed/i, /usually the same day/i, /rarely/i, /long-term product/i],
  [/no meaningful grid requirements/i, /low criticality/i],
  [/low priority/i, /customer-facing product/i, /standard support/i, /low urgency/i]
] as const;

const sectionTitles = [
  /team and scale/i,
  /design system and workflow/i,
  /maintainability risk/i,
  /advanced ui needs/i,
  /quality, support, and delivery/i
] as const;

function renderQuestionnaire(initialPath = '/') {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath]
  });

  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

function fillCurrentStep(labels: readonly RegExp[]) {
  for (const label of labels) {
    fireEvent.click(screen.getByRole('radio', { name: label }));
  }
}

async function completeQuestionnaire(labelsByStep: readonly (readonly RegExp[])[]) {
  for (const [index, labels] of labelsByStep.entries()) {
    fillCurrentStep(labels);

    if (index < labelsByStep.length - 1) {
      fireEvent.click(screen.getByRole('button', { name: /continue/i }));
      await screen.findByRole('heading', { name: sectionTitles[index + 1] });
    }
  }
}

async function fillQuestionnaire() {
  await completeQuestionnaire(sectionAnswerLabels);
}

async function fillNonGateQuestionnaire() {
  await completeQuestionnaire(nonGateSectionAnswerLabels);
}

describe('QuestionnairePage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders only the first section initially', () => {
    renderQuestionnaire();

    expect(screen.getByRole('heading', { name: /team and scale/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /design system and workflow/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /get recommendation/i })).not.toBeInTheDocument();
  });

  it('continue validates only the current section and prevents navigation when invalid', async () => {
    renderQuestionnaire();

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      await screen.findByText(/answer the required questions in this section to continue/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /team and scale/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /design system and workflow/i })).not.toBeInTheDocument();
  });

  it('moves to the next step after the current section is valid', async () => {
    renderQuestionnaire();

    fillCurrentStep(sectionAnswerLabels[0]);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      await screen.findByRole('heading', { name: /design system and workflow/i })
    ).toBeInTheDocument();
  });

  it('returns to the previous step when back is clicked', async () => {
    renderQuestionnaire();

    fillCurrentStep(sectionAnswerLabels[0]);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await screen.findByRole('heading', { name: /design system and workflow/i });

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(await screen.findByRole('heading', { name: /team and scale/i })).toBeInTheDocument();
  });

  it('shows get recommendation on the final step as answers are selected', async () => {
    renderQuestionnaire();

    fillCurrentStep(sectionAnswerLabels[0]);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await screen.findByRole('heading', { name: /design system and workflow/i });

    fillCurrentStep(sectionAnswerLabels[1]);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await screen.findByRole('heading', { name: /maintainability risk/i });

    fillCurrentStep(sectionAnswerLabels[2]);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await screen.findByRole('heading', { name: /advanced ui needs/i });

    fillCurrentStep(sectionAnswerLabels[3]);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      await screen.findByRole('heading', { name: /quality, support, and delivery/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get recommendation/i })).toBeInTheDocument();
  });

  it('restores saved draft and opens on the first incomplete section', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.questionnaireDraft,
      JSON.stringify({
        version: 1,
        savedAt: '2026-01-01T00:00:00.000Z',
        values: {
          frontendDeveloperCount: '1_9',
          teamCount: '1',
          reactAppCount: '1',
          designSystemMaturity: 'none'
        }
      })
    );

    renderQuestionnaire();

    expect(screen.getByRole('heading', { name: /design system and workflow/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /no real design system/i, checked: true })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /team and scale/i })).not.toBeInTheDocument();
  });

  it('persists form values after change and saves the result on submit', async () => {
    renderQuestionnaire();

    fireEvent.click(screen.getByRole('radio', { name: /10-19 developers/i }));

    await waitFor(() => {
      expect(loadQuestionnaireDraft()?.frontendDeveloperCount).toBe('10_19');
    });

    await fillQuestionnaire();
    fireEvent.click(screen.getByRole('button', { name: /get recommendation/i }));

    expect(await screen.findByRole('heading', { name: /recommendation report/i })).toBeInTheDocument();

    const storedDraft = loadQuestionnaireDraft();
    const storedResult = loadDecisionResult();

    expect(storedDraft).toEqual(questionnaireFixture);
    expect(storedResult?.input).toEqual(questionnaireFixture);
    expect(storedResult?.result.policyVersion).toBe(recommendationPolicy.version);
    expect(storedResult?.metadata).toEqual(getActivePolicyMetadata(null));
  });

  it('opens a confirmation dialog before clearing saved answers and cancel keeps storage intact', async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.questionnaireDraft,
      JSON.stringify({
        version: 1,
        savedAt: '2026-01-01T00:00:00.000Z',
        values: questionnaireFixture
      })
    );

    renderQuestionnaire();

    fireEvent.click(screen.getByRole('button', { name: /^clear saved answers$/i }));

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByText(/this will remove your saved questionnaire answers/i)
    ).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(loadQuestionnaireDraft()).toEqual(questionnaireFixture);
  });

  it('clears saved draft and result after confirmation and resets the first step', async () => {
    saveDecisionResult(
      questionnaireFixture,
      decide(questionnaireFixture, recommendationPolicy),
      getActivePolicyMetadata()
    );
    window.localStorage.setItem(
      STORAGE_KEYS.questionnaireDraft,
      JSON.stringify({
        version: 1,
        savedAt: '2026-01-01T00:00:00.000Z',
        values: questionnaireFixture
      })
    );

    renderQuestionnaire();

    fireEvent.click(screen.getByRole('button', { name: /^clear saved answers$/i }));
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: /^clear saved answers$/i })
    );

    await waitFor(() => {
      expect(loadQuestionnaireDraft()).toBeNull();
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(loadDecisionResult()).toBeNull();
    expect(screen.getByText(/saved answers cleared/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /team and scale/i })).toBeInTheDocument();
  });

  it('uses the active recalibrated policy on submit', async () => {
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

    renderQuestionnaire();
    await fillNonGateQuestionnaire();
    fireEvent.click(screen.getByRole('button', { name: /get recommendation/i }));

    expect(await screen.findByRole('heading', { name: /recommendation report/i })).toBeInTheDocument();

    const storedResult = loadDecisionResult();

    expect(storedResult?.input).toEqual(nonGateQuestionnaireFixture);
    expect(storedResult?.result.recommendation).toBe('mui_core');
    expect(storedResult?.metadata).toEqual({
      policyVersion: recommendationPolicy.version,
      recalibrationUpdatedAt: '2026-01-01T00:00:00.000Z',
      hasLocalOverrides: true
    });
    expect(storedResult?.result.explanation.recommendationReasons).toContain(
      'Single-team scope now prefers a reusable shared foundation.'
    );
  });
});
