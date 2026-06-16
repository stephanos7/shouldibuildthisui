import type { RecalibrationOverrides } from '../../decision/types/Recalibration';
import { recalibrationOverridesSchemaForStorage } from '../../decision/recalibration/validateRecalibrationOverride';
import { STORAGE_KEYS } from './localStorageKeys';
import { safeReadJson, safeRemoveItem, safeWriteJson } from './localStorageSafe';

export function loadRecalibrationOverrides(): RecalibrationOverrides | null {
  return safeReadJson(STORAGE_KEYS.recalibrationOverrides, recalibrationOverridesSchemaForStorage);
}

export function saveRecalibrationOverrides(overrides: RecalibrationOverrides): boolean {
  return safeWriteJson(STORAGE_KEYS.recalibrationOverrides, overrides);
}

export function clearRecalibrationOverrides(): void {
  safeRemoveItem(STORAGE_KEYS.recalibrationOverrides);
}
