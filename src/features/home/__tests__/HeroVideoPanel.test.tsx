import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { theme } from '../../../app/theme';
import HeroVideoPanel from '../HeroVideoPanel';

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

function renderPanel() {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HeroVideoPanel src="/hero/assessment-loop.mp4" />
    </ThemeProvider>
  );
}

describe('HeroVideoPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a looping, inline, metadata-preloaded video element', () => {
    mockMatchMedia(false);
    const { container } = renderPanel();

    const video = container.querySelector('video');

    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('preload', 'metadata');
    expect(video).toHaveAttribute('aria-hidden', 'true');
    expect(video).not.toHaveAttribute('controls');
    expect(video).toHaveProperty('muted', true);
  });

  it('falls back to a poster image when reduced motion is enabled', () => {
    mockMatchMedia(true);
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HeroVideoPanel
          src="/hero/assessment-loop.mp4"
          posterSrc="/hero/assessment-poster.jpg"
        />
      </ThemeProvider>
    );

    expect(
      screen.getByRole('img', { name: /preview of the assessment experience/i })
    ).toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });
});
