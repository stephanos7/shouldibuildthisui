import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { theme } from '../../../app/theme';
import HomeHero from '../HomeHero';

function mockMatchMedia(prefersReducedMotion = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersReducedMotion && query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
}

function renderHero(
  props: Partial<Parameters<typeof HomeHero>[0]> = {}
) {
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter>
        <HomeHero
          hasSavedDraft={false}
          hasSavedResult={false}
          onStart={vi.fn()}
          {...props}
        />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('HomeHero', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders the headline, copy, primary CTA, and video panel', () => {
    mockMatchMedia(false);
    const onStart = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter>
          <HomeHero hasSavedDraft={false} hasSavedResult={false} onStart={onStart} />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(
      screen.getByRole('heading', { name: /find the best path for your react ui/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/answer a short assessment about your team, applications/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start assessment/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /view saved result/i })).not.toBeInTheDocument();
    expect(document.querySelector('video')).toBeInTheDocument();
  });

  it('shows the saved-result CTA when a result exists', () => {
    mockMatchMedia(false);
    renderHero({ hasSavedResult: true });

    expect(screen.getByRole('link', { name: /view saved result/i })).toBeInTheDocument();
  });

  it('switches the primary CTA to continue when a saved draft exists', () => {
    mockMatchMedia(false);
    renderHero({ hasSavedDraft: true });

    expect(screen.getByRole('button', { name: /continue assessment/i })).toBeInTheDocument();
  });

  it('renders a poster image instead of autoplaying video when reduced motion is requested', () => {
    mockMatchMedia(true);
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter>
          <HomeHero hasSavedDraft={false} hasSavedResult={false} onStart={vi.fn()} />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(document.querySelector('video')).not.toBeInTheDocument();
  });
});
