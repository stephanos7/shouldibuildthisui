import { z } from 'zod';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { safeGetItem, safeReadJson, safeRemoveItem, safeSetItem, safeWriteJson } from '../localStorageSafe';

const key = 'mui-recommender:test:key';

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('localStorageSafe', () => {
  it('writes and reads json values', () => {
    const schema = z.object({ value: z.string() });

    expect(safeWriteJson(key, { value: 'stored' })).toBe(true);
    expect(safeReadJson(key, schema)).toEqual({ value: 'stored' });
  });

  it('returns null when a key is missing', () => {
    expect(safeGetItem(key)).toBeNull();
    expect(safeReadJson(key, z.string())).toBeNull();
  });

  it('returns null for malformed json and clears the key', () => {
    window.localStorage.setItem(key, '{invalid-json');

    expect(safeReadJson(key, z.any())).toBeNull();
    expect(window.localStorage.getItem(key)).toBeNull();
  });

  it('returns null for schema mismatches and clears the key', () => {
    window.localStorage.setItem(key, JSON.stringify({ value: 123 }));

    expect(safeReadJson(key, z.object({ value: z.string() }))).toBeNull();
    expect(window.localStorage.getItem(key)).toBeNull();
  });

  it('handles storage write failures without throwing', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(safeSetItem(key, 'value')).toBe(false);
    expect(safeWriteJson(key, { value: 'stored' })).toBe(false);
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('ignores remove failures', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('remove failed');
    });

    expect(() => safeRemoveItem(key)).not.toThrow();
    expect(removeItemSpy).toHaveBeenCalled();
  });
});
