import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { routes } from '../../../app/routes';
import { theme } from '../../../app/theme';
import { recommendationPolicy } from '../../../decision/policy/recommendationPolicy';
import { calibrationScenarios } from '../../../decision/tests/calibrationScenarios';
import { saveRecalibrationOverrides } from '../../../shared/storage/recalibrationStorage';

function renderCalibrationRoute() {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/internal/calibration']
  });

  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

describe('CalibrationPage', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('lists all calibration scenarios with expected and actual outcomes', () => {
    renderCalibrationRoute();

    expect(screen.getByRole('heading', { name: /internal calibration/i })).toBeInTheDocument();
    expect(screen.getByText(/all scenarios currently pass calibration/i)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /expected/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /actual/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /view details/i })).toHaveLength(
      calibrationScenarios.length
    );
    expect(screen.getByText(/simple internal prototype/i)).toBeInTheDocument();
    expect(screen.getByText(/multi-team multi-app enterprise pattern/i)).toBeInTheDocument();
  });

  it('shows scenario details in a read-only drawer', () => {
    renderCalibrationRoute();

    fireEvent.click(screen.getAllByRole('button', { name: /view details/i })[0]);

    expect(screen.getByRole('heading', { name: /simple internal prototype/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /recommendation outcome/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /input facts/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /applied rules/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /explanation/i })).toBeInTheDocument();
    expect(screen.getByText(/matches the single shipped gate/i)).toBeInTheDocument();
    expect(screen.getByText(/expected: build it yourself/i)).toBeInTheDocument();
    expect(screen.getByText(/actual: build it yourself/i)).toBeInTheDocument();
    expect(screen.getByText(/recommends build it yourself/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close details/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('evaluates scenarios against the active recalibrated policy', () => {
    saveRecalibrationOverrides({
      version: 1,
      policyVersion: recommendationPolicy.version,
      updatedAt: '2026-01-01T00:00:00.000Z',
      overrides: {
        'scope-single-team-local-choice': {
          ruleId: 'scope-single-team-local-choice',
          scores: {
            build_it_yourself: 0,
            mui_core: 4
          },
          reason: 'Single-team scope now prefers a reusable shared foundation.',
          updatedAt: '2026-01-01T00:00:00.000Z'
        }
      }
    });

    renderCalibrationRoute();

    expect(screen.getByText(/scenarios currently fail calibration/i)).toBeInTheDocument();
  });
});
