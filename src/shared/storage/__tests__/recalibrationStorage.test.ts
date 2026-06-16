import { afterEach, describe, expect, it } from 'vitest';
import type { RecalibrationOverrides } from '../../../decision/types/Recalibration';
import {
  clearRecalibrationOverrides,
  loadRecalibrationOverrides,
  saveRecalibrationOverrides
} from '../recalibrationStorage';
import { STORAGE_KEYS } from '../localStorageKeys';

const overridesFixture: RecalibrationOverrides = {
  version: 1,
  policyVersion: 'initial-production-policy-v1',
  updatedAt: '2026-06-16T00:00:00.000Z',
  overrides: {
    'scale-multi-team-multi-app': {
      ruleId: 'scale-multi-team-multi-app',
      enabled: false,
      updatedAt: '2026-06-16T00:00:00.000Z'
    }
  }
};

afterEach(() => {
  window.localStorage.clear();
});

describe('recalibrationStorage', () => {
  it('writes and reads recalibration overrides', () => {
    expect(saveRecalibrationOverrides(overridesFixture)).toBe(true);
    expect(loadRecalibrationOverrides()).toEqual(overridesFixture);
  });

  it('ignores malformed localStorage data', () => {
    window.localStorage.setItem(STORAGE_KEYS.recalibrationOverrides, '{bad-json');

    expect(loadRecalibrationOverrides()).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEYS.recalibrationOverrides)).toBeNull();
  });

  it('clears recalibration overrides', () => {
    saveRecalibrationOverrides(overridesFixture);

    clearRecalibrationOverrides();

    expect(loadRecalibrationOverrides()).toBeNull();
  });
});
