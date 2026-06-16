import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { routes } from '../../../app/routes';
import { theme } from '../../../app/theme';
import { STORAGE_KEYS } from '../../../shared/storage/localStorageKeys';
import { validateDraft } from '../RecalibrationPage';

function renderRecalibrationRoute() {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/internal/recalibration']
  });

  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

function readStoredOverrides() {
  const stored = window.localStorage.getItem(STORAGE_KEYS.recalibrationOverrides);
  return stored ? JSON.parse(stored) : null;
}

describe('RecalibrationPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the page and explanatory copy', () => {
    renderRecalibrationRoute();

    expect(screen.getByRole('heading', { name: /internal recalibration/i })).toBeInTheDocument();
    expect(
      screen.getByText(/recalibration lets you adjust how strongly existing rules influence recommendations/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/these changes are stored locally in this browser\. they are not shared with other users/i)
    ).toBeInTheDocument();
  });

  it('lists editable rules and shows gates as fixed', () => {
    renderRecalibrationRoute();

    expect(screen.getByRole('button', { name: /prototype horizon/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /multiple teams and multiple apps/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prototype internal tool shortcut/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /prototype internal tool shortcut/i }));

    expect(
      screen.getByText(/this gate recommends build it yourself/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument();
  });

  it('allows score and reason edits and saves an override', () => {
    renderRecalibrationRoute();

    fireEvent.change(screen.getByLabelText(/build it yourself score/i), {
      target: { value: '-3' }
    });
    fireEvent.change(screen.getByLabelText(/^reason$/i), {
      target: { value: 'Updated explanation for prototype work.' }
    });
    fireEvent.change(screen.getByLabelText(/internal note/i), {
      target: { value: 'Reviewed during calibration session.' }
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/recalibration changes saved/i)).toBeInTheDocument();

    const stored = readStoredOverrides();

    expect(stored?.policyVersion).toBe('initial-production-policy-v1');
    expect(stored?.overrides['horizon-prototype-low-investment']).toMatchObject({
      ruleId: 'horizon-prototype-low-investment',
      enabled: true,
      scores: {
        build_it_yourself: -3,
        mui_core: 0,
        mui_x_premium: 0,
        mui_x_enterprise: 0
      },
      reason: 'Updated explanation for prototype work.',
      internalNote: 'Reviewed during calibration session.'
    });
  });

  it('rejects invalid score values during save validation', () => {
    expect(
      validateDraft({
        enabled: true,
        scores: {
          build_it_yourself: '7',
          mui_core: '0',
          mui_x_premium: '0',
          mui_x_enterprise: '0'
        },
        reason: 'Reason stays present.',
        internalNote: ''
      })
    ).toMatchObject({
      build_it_yourself: 'Choose a score between -5 and 5.'
    });
  });

  it('resets a saved rule override', () => {
    renderRecalibrationRoute();

    fireEvent.change(screen.getByLabelText(/^reason$/i), {
      target: { value: 'Temporary recalibration reason.' }
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(readStoredOverrides()?.overrides['horizon-prototype-low-investment']).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /reset rule override/i }));

    expect(screen.getByDisplayValue(/prototype work usually does not justify adopting a broader ui platform/i)).toBeInTheDocument();
    expect(readStoredOverrides()).toBeNull();
  });

  it('clears all overrides', () => {
    renderRecalibrationRoute();

    fireEvent.change(screen.getByLabelText(/^reason$/i), {
      target: { value: 'Saved before full reset.' }
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(readStoredOverrides()).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /reset all overrides/i }));

    expect(screen.getByText(/all recalibration overrides cleared/i)).toBeInTheDocument();
    expect(readStoredOverrides()).toBeNull();
  });
});
