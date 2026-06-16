import { CssBaseline, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from '../../../app/routes';
import { theme } from '../../../app/theme';

function renderQuestionnaire(initialPath = '/') {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath]
  });

  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );

  return { router };
}

describe('QuestionnairePage', () => {
  it('renders all questions, validates required fields, and navigates to the result route on submit', async () => {
    const { router } = renderQuestionnaire();

    expect(screen.getAllByRole('radiogroup')).toHaveLength(16);

    fireEvent.click(screen.getByRole('button', { name: /get recommendation/i }));

    expect(
      await screen.findByText(/review the highlighted questions before submitting/i)
    ).toBeInTheDocument();

    const radioOptions = [
      /1-9 developers/i,
      /1 team/i,
      /1 application/i,
      /no real design system/i,
      /low friction/i,
      /no explicit standardization goal/i,
      /well distributed across contributors/i,
      /usually the same day/i,
      /rarely/i,
      /prototype or disposable exploration/i,
      /no meaningful grid requirements/i,
      /low criticality/i,
      /low priority/i,
      /internal tool/i,
      /self-serve documentation and community/i,
      /low urgency/i
    ];

    for (const option of radioOptions) {
      fireEvent.click(screen.getByRole('radio', { name: option }));
    }

    fireEvent.click(screen.getByRole('button', { name: /get recommendation/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/result');
    });

    expect(screen.getByText(/recommendation calculated/i)).toBeInTheDocument();
    expect(screen.getByText(/recommendation:/i)).toBeInTheDocument();
  });
});
