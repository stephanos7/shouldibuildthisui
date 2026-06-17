import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { theme } from '../../../../app/theme';
import RadioCardGroup from '../RadioCardGroup';

const options = [
  {
    value: 'small',
    label: 'Small team'
  },
  {
    value: 'large',
    label: 'Large team'
  }
] as const;

type HarnessProps = {
  error?: string;
  columns?: {
    xs?: 1 | 2;
    sm?: 1 | 2;
    md?: 1 | 2;
  };
};

function RadioCardGroupHarness({
  error,
  columns = { xs: 1, sm: 1, md: 2 }
}: HarnessProps) {
  const [value, setValue] = useState('small');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RadioCardGroup
        id="team-size"
        value={value}
        options={[...options]}
        onChange={setValue}
        error={error}
        labelledById="team-size-question"
        describedById={error ? 'team-size-error' : undefined}
        columns={columns}
        onBlur={vi.fn()}
      />
    </ThemeProvider>
  );
}

afterEach(() => {
  cleanup();
});

describe('RadioCardGroup', () => {
  it('uses the provided row heading as the radio group label', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h3 id="team-size-question">How large is the team?</h3>
        <RadioCardGroup
          id="team-size"
          value="small"
          options={[...options]}
          onChange={vi.fn()}
          labelledById="team-size-question"
          columns={{ xs: 1, sm: 1, md: 2 }}
          onBlur={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('radiogroup')).toHaveAccessibleName(/how large is the team\?/i);
  });

  it('renders the selected radio option as checked', () => {
    render(<RadioCardGroupHarness />);

    expect(screen.getByRole('radio', { name: /small team/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /large team/i })).not.toBeChecked();
  });

  it('changes value when a row is clicked', () => {
    render(<RadioCardGroupHarness />);

    fireEvent.click(screen.getByText(/large team/i));

    expect(screen.getByRole('radio', { name: /large team/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /small team/i })).not.toBeChecked();
  });

  it('updates selection from radio input change events', () => {
    render(<RadioCardGroupHarness />);

    fireEvent.click(screen.getByRole('radio', { name: /large team/i }));

    expect(screen.getByRole('radio', { name: /large team/i })).toBeChecked();
  });

  it('renders error text', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RadioCardGroup
          id="team-size"
          value="small"
          options={[...options]}
          onChange={vi.fn()}
          error="Select one option."
          labelledById="team-size-question"
          columns={{ xs: 1, sm: 1, md: 2 }}
          onBlur={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-describedby', 'team-size-error');
    expect(screen.getByText(/select one option/i)).toBeInTheDocument();
  });

  it('renders error text below the group', () => {
    render(<RadioCardGroupHarness error="Select one option." />);

    expect(screen.getByText(/select one option\./i)).toHaveAttribute('id', 'team-size-error');
  });
});
