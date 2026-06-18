import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import QuestionnaireProgressHeader from '../QuestionnaireProgressHeader';

afterEach(() => {
  cleanup();
});

describe('QuestionnaireProgressHeader', () => {
  it('renders section metadata, progress segments, and one divider', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QuestionnaireProgressHeader
          sectionIndex={1}
          sectionCount={4}
          completedSectionIndexes={[0]}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/section 2 of 4/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: /assessment section progress/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /section 1 of 4, completed/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /section 2 of 4, current section/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /section 3 of 4/i })).toBeInTheDocument();
    expect(container.querySelectorAll('hr')).toHaveLength(1);
  });
});
