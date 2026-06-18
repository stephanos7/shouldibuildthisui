import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import SectionProgressSegments from '../SectionProgressSegments';

afterEach(() => {
  cleanup();
});

describe('SectionProgressSegments', () => {
  it('renders one segment per section with accessible state labels', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SectionProgressSegments
          sectionIndex={2}
          sectionCount={4}
          completedSectionIndexes={[0, 1]}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('list', { name: /assessment section progress/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('listitem', { name: /section 1 of 4, completed/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /section 2 of 4, completed/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /section 3 of 4, current section/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /section 4 of 4/i })).toBeInTheDocument();
  });

  it('does not render interactive controls', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SectionProgressSegments sectionIndex={0} sectionCount={3} completedSectionIndexes={[]} />
      </ThemeProvider>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
