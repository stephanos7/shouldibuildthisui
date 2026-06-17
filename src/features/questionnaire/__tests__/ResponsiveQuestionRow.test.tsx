import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import ResponsiveQuestionRow from '../ResponsiveQuestionRow';

function renderRow(error?: string) {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResponsiveQuestionRow id="frontendDeveloperCount" label="How many frontend developers?" error={error}>
        <div>Answer options</div>
      </ResponsiveQuestionRow>
    </ThemeProvider>
  );
}

afterEach(() => {
  cleanup();
});

describe('ResponsiveQuestionRow', () => {
  it('renders as a section labelled by the question heading', () => {
    renderRow();

    const heading = screen.getByRole('heading', {
      level: 3,
      name: /how many frontend developers\?/i
    });
    const section = screen.getByRole('region', { name: /how many frontend developers\?/i });

    expect(heading).toHaveAttribute('id', 'frontendDeveloperCount-question');
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('aria-labelledby', 'frontendDeveloperCount-question');
  });

  it('renders children inside the row', () => {
    renderRow();

    expect(screen.getByText(/answer options/i)).toBeInTheDocument();
  });

  it('renders error text when supplied', () => {
    renderRow('Choose an answer.');

    expect(screen.getByText(/choose an answer\./i)).toBeInTheDocument();
    expect(screen.getByText(/choose an answer\./i)).toHaveAttribute(
      'id',
      'frontendDeveloperCount-error'
    );
  });
});
