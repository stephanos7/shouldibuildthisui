import type { Path } from './Path';

export type RuleRecalibrationOverride = {
  ruleId: string;
  enabled?: boolean;
  scores?: Partial<Record<Path, number>>;
  reason?: string;
  internalNote?: string;
  updatedAt: string;
};

export type RecalibrationOverrides = {
  version: 1;
  policyVersion: string;
  updatedAt: string;
  overrides: Record<string, RuleRecalibrationOverride>;
};
