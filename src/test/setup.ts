import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const originalWarn = console.warn;

vi.spyOn(console, 'warn').mockImplementation((...args) => {
  const [message] = args;

  if (typeof message === 'string' && message.includes('React Router Future Flag Warning')) {
    return;
  }

  originalWarn(...args);
});
