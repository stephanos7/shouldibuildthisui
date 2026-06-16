import { afterEach, describe, expect, it } from 'vitest';
import { decide } from '../../../decision/engine/decide';
import { recommendationPolicy } from '../../../decision/policy/recommendationPolicy';
import { STORAGE_KEYS } from '../localStorageKeys';
import {
  clearDecisionResult,
  clearRecommendationSession,
  clearQuestionnaireDraft,
  loadDecisionResult,
  loadQuestionnaireDraft,
  saveDecisionResult,
  saveQuestionnaireDraft
} from '../recommendationStorage';
import type { QuestionnaireValues } from '../../../features/questionnaire/questionnaireSchema';

const questionnaireFixture: QuestionnaireValues = {
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
};

const resultFixture = decide(questionnaireFixture, recommendationPolicy);

afterEach(() => {
  window.localStorage.clear();
});

describe('recommendationStorage', () => {
  it('saves and loads questionnaire drafts', () => {
    saveQuestionnaireDraft(questionnaireFixture);

    expect(loadQuestionnaireDraft()).toEqual(questionnaireFixture);
  });

  it('saves and loads decision results', () => {
    saveDecisionResult(questionnaireFixture, resultFixture);

    const storedResult = loadDecisionResult();

    expect(storedResult?.input).toEqual(questionnaireFixture);
    expect(storedResult?.result).toEqual(resultFixture);
    expect(storedResult?.version).toBe(1);
    expect(storedResult?.savedAt).toEqual(expect.any(String));
  });

  it('returns null for unsupported payload versions', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.questionnaireDraft,
      JSON.stringify({
        version: 2,
        savedAt: '2026-01-01T00:00:00.000Z',
        values: questionnaireFixture
      })
    );
    window.localStorage.setItem(
      STORAGE_KEYS.decisionResult,
      JSON.stringify({
        version: 2,
        savedAt: '2026-01-01T00:00:00.000Z',
        input: questionnaireFixture,
        result: resultFixture
      })
    );

    expect(loadQuestionnaireDraft()).toBeNull();
    expect(loadDecisionResult()).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEYS.questionnaireDraft)).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEYS.decisionResult)).toBeNull();
  });

  it('clears stored session data', () => {
    saveQuestionnaireDraft(questionnaireFixture);
    saveDecisionResult(questionnaireFixture, resultFixture);

    clearRecommendationSession();

    expect(window.localStorage.getItem(STORAGE_KEYS.questionnaireDraft)).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEYS.decisionResult)).toBeNull();
  });

  it('clears individual stored entries', () => {
    saveQuestionnaireDraft(questionnaireFixture);
    saveDecisionResult(questionnaireFixture, resultFixture);

    clearQuestionnaireDraft();
    expect(window.localStorage.getItem(STORAGE_KEYS.questionnaireDraft)).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEYS.decisionResult)).not.toBeNull();

    clearDecisionResult();
    expect(window.localStorage.getItem(STORAGE_KEYS.decisionResult)).toBeNull();
  });
});
