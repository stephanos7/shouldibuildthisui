import { z } from 'zod';

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function safeGetItem(key: string): string | null {
  const storage = getLocalStorage();

  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  const storage = getLocalStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage failures when clearing bad data.
  }
}

export function safeReadJson<T>(key: string, schema: z.ZodType<T>): T | null {
  const raw = safeGetItem(key);

  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const result = schema.safeParse(parsed);

    if (!result.success) {
      safeRemoveItem(key);
      return null;
    }

    return result.data;
  } catch {
    safeRemoveItem(key);
    return null;
  }
}

export function safeWriteJson(key: string, value: unknown): boolean {
  try {
    const serialized = JSON.stringify(value);

    if (typeof serialized !== 'string') {
      return false;
    }

    return safeSetItem(key, serialized);
  } catch {
    return false;
  }
}
