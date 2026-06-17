import { z } from 'zod';
import type { ActivePolicyMetadata } from '../../decision/recalibration/getActivePolicyMetadata';
import type { DecisionResult } from '../../decision/types/DecisionResult';
import { questionnaireSchema, type QuestionnaireValues } from '../../features/questionnaire/questionnaireSchema';
import { STORAGE_KEYS } from './localStorageKeys';
import { safeReadJson, safeRemoveItem, safeWriteJson } from './localStorageSafe';

const storageVersion = 1 as const;
export const RECOMMENDATION_STORAGE_EVENT = 'recommendation-storage-changed';

const pathSchema = z.enum(['build_it_yourself', 'mui_core', 'mui_x_premium', 'mui_x_enterprise']);
const confidenceSchema = z.enum(['low', 'medium', 'high']);
const decisionTypeSchema = z.enum(['gate', 'score']);

const appliedRuleSchema = z.object({
  ruleId: z.string(),
  label: z.string(),
  intent: z.string(),
  reason: z.string(),
  ruleType: z.enum(['gate', 'base', 'interaction']),
  recommendation: pathSchema.optional(),
  scores: z.record(z.string(), z.number()).optional()
});

const decisionResultSchema: z.ZodType<DecisionResult> = z.object({
  decisionType: decisionTypeSchema,
  policyVersion: z.string(),
  facts: questionnaireSchema,
  recommendation: pathSchema,
  rankedPaths: z.array(pathSchema),
  scores: z.object({
    build_it_yourself: z.number(),
    mui_core: z.number(),
    mui_x_premium: z.number(),
    mui_x_enterprise: z.number()
  }),
  confidence: confidenceSchema,
  appliedRules: z.array(appliedRuleSchema),
  explanation: z.object({
    summary: z.string(),
    recommendationReasons: z.array(z.string()),
    counterSignals: z.array(z.string()),
    runnerUp: z
      .object({
        path: pathSchema,
        scoreDelta: z.number(),
        reasons: z.array(z.string())
      })
      .optional()
  })
});

const activePolicyMetadataSchema: z.ZodType<ActivePolicyMetadata> = z.object({
  policyVersion: z.string(),
  recalibrationUpdatedAt: z.string().nullable(),
  hasLocalOverrides: z.boolean()
});

const questionnaireDraftSchema = z.object({
  version: z.literal(storageVersion),
  savedAt: z.string(),
  values: questionnaireSchema.partial()
});

const storedDecisionResultSchema = z.object({
  version: z.literal(storageVersion),
  savedAt: z.string(),
  input: questionnaireSchema,
  result: decisionResultSchema,
  metadata: activePolicyMetadataSchema
});

export type StoredQuestionnaireDraft = {
  version: 1;
  savedAt: string;
  values: QuestionnaireValues;
};

export type StoredDecisionResult = {
  version: 1;
  savedAt: string;
  input: QuestionnaireValues;
  result: DecisionResult;
  metadata: ActivePolicyMetadata;
};

export function saveQuestionnaireDraft(values: QuestionnaireValues): void {
  safeWriteJson(STORAGE_KEYS.questionnaireDraft, {
    version: storageVersion,
    savedAt: new Date().toISOString(),
    values
  } satisfies StoredQuestionnaireDraft);
  window.dispatchEvent(new Event(RECOMMENDATION_STORAGE_EVENT));
}

export function loadQuestionnaireDraft(): QuestionnaireValues | null {
  const storedDraft = safeReadJson(STORAGE_KEYS.questionnaireDraft, questionnaireDraftSchema);

  if (!storedDraft) {
    return null;
  }

  return storedDraft.values as QuestionnaireValues;
}

export function clearQuestionnaireDraft(): void {
  safeRemoveItem(STORAGE_KEYS.questionnaireDraft);
  window.dispatchEvent(new Event(RECOMMENDATION_STORAGE_EVENT));
}

export function saveDecisionResult(
  input: QuestionnaireValues,
  result: DecisionResult,
  metadata: ActivePolicyMetadata
): void {
  safeWriteJson(STORAGE_KEYS.decisionResult, {
    version: storageVersion,
    savedAt: new Date().toISOString(),
    input,
    result,
    metadata
  } satisfies StoredDecisionResult);
  window.dispatchEvent(new Event(RECOMMENDATION_STORAGE_EVENT));
}

export function loadDecisionResult(): StoredDecisionResult | null {
  return safeReadJson(STORAGE_KEYS.decisionResult, storedDecisionResultSchema);
}

export function clearDecisionResult(): void {
  safeRemoveItem(STORAGE_KEYS.decisionResult);
  window.dispatchEvent(new Event(RECOMMENDATION_STORAGE_EVENT));
}

export function clearRecommendationSession(): void {
  clearQuestionnaireDraft();
  clearDecisionResult();
}
