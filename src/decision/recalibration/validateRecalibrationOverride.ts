import { z } from 'zod';
import type {
  RecalibrationOverrides,
  RuleRecalibrationOverride
} from '../types/Recalibration';

const overrideScoreSchema = z.number().int().min(-5).max(5);

const overrideScoresSchema = z
  .object({
    build_it_yourself: overrideScoreSchema.optional(),
    mui_core: overrideScoreSchema.optional(),
    mui_x_premium: overrideScoreSchema.optional(),
    mui_x_enterprise: overrideScoreSchema.optional()
  })
  .strict();

const ruleRecalibrationOverrideSchema = z
  .object({
  ruleId: z.string(),
  enabled: z.boolean().optional(),
  scores: overrideScoresSchema.optional(),
  reason: z.string().optional(),
  internalNote: z.string().optional(),
  updatedAt: z.string()
})
  .strict();

const recalibrationOverridesSchema = z
  .object({
    version: z.literal(1),
    policyVersion: z.string(),
    updatedAt: z.string(),
    overrides: z.record(z.string(), ruleRecalibrationOverrideSchema)
  })
  .strict();

export function validateRuleRecalibrationOverride(
  value: unknown
): RuleRecalibrationOverride | null {
  const result = ruleRecalibrationOverrideSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function validateRecalibrationOverrides(value: unknown): RecalibrationOverrides | null {
  const result = recalibrationOverridesSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function isValidOverrideScore(value: unknown): value is number {
  return overrideScoreSchema.safeParse(value).success;
}

export const recalibrationOverridesSchemaForStorage = recalibrationOverridesSchema;
