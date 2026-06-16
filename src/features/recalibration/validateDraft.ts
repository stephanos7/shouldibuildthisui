import { isValidOverrideScore } from '../../decision/recalibration/validateRecalibrationOverride';
import type { Path } from '../../decision/types/Path';
import type { RuleDraft } from './recalibrationTypes';

export type ValidationErrors = Partial<Record<Path | 'reason', string>>;

export function validateDraft(draft: RuleDraft): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [path, value] of Object.entries(draft.scores) as Array<[Path, string]>) {
    const numericValue = Number(value);

    if (!isValidOverrideScore(numericValue)) {
      errors[path] = 'Choose a score between -5 and 5.';
    }
  }

  if (!draft.reason.trim()) {
    errors.reason = 'Reason is required.';
  }

  return errors;
}
