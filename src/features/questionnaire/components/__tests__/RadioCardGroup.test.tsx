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
  layout?: 'single-column' | 'two-column';
};

function RadioCardGroupHarness({
  error,
  layout = 'two-column'
}: HarnessProps) {
  const [value, setValue] = useState('small');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RadioCardGroup
        name="team-size"
        label="How large is the team?"
        error={error}
        layout={layout}
        options={[...options]}
        value={value}
        onBlur={vi.fn()}
        onChange={setValue}
      />
    </ThemeProvider>
  );
}

afterEach(() => {
  cleanup();
});

describe('RadioCardGroup', () => {
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
    render(<RadioCardGroupHarness error="Select one option." />);

    expect(screen.getByText(/select one option/i)).toBeInTheDocument();
  });

  it('applies the stable two-column layout marker when requested', () => {
    render(<RadioCardGroupHarness layout="two-column" />);

    expect(screen.getByTestId('team-size-options-grid')).toHaveAttribute('data-layout', 'two-column');
  });
});
