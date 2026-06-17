import { zodResolver } from '@hookform/resolvers/zod';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { cleanup, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';
import { theme } from '../../../app/theme';
import QuestionSection from '../QuestionSection';
import { questionnaireSchema, type QuestionnaireValues } from '../questionnaireSchema';
import { questionsBySection } from '../questions';

type HarnessProps = {
  defaultValues?: Partial<QuestionnaireValues>;
  validateOnMount?: boolean;
};

function QuestionSectionHarness({ defaultValues, validateOnMount = false }: HarnessProps) {
  const methods = useForm<QuestionnaireValues>({
    resolver: zodResolver(questionnaireSchema),
    mode: 'onBlur',
    defaultValues: defaultValues as QuestionnaireValues
  });

  useEffect(() => {
    if (!validateOnMount) {
      return;
    }

    void methods.trigger('frontendDeveloperCount');
  }, [methods, validateOnMount]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FormProvider {...methods}>
        <QuestionSection
          sectionIndex={0}
          questions={[questionsBySection[0].questions[0]]}
        />
      </FormProvider>
    </ThemeProvider>
  );
}

afterEach(() => {
  cleanup();
});

describe('QuestionSection', () => {
  it('does not duplicate the question label', () => {
    render(<QuestionSectionHarness />);

    const labels = screen.getAllByText(/how many frontend developers work on these react applications\?/i);

    expect(labels).toHaveLength(1);
  });

  it('labels the radio group from the question heading', () => {
    render(<QuestionSectionHarness />);

    const heading = screen.getByRole('heading', {
      level: 3,
      name: /how many frontend developers work on these react applications\?/i
    });
    const radioGroup = screen.getByRole('radiogroup');

    expect(heading).toHaveAttribute('id', 'frontendDeveloperCount-question');
    expect(radioGroup).toHaveAttribute('aria-labelledby', 'frontendDeveloperCount-question');
    expect(radioGroup).toHaveAccessibleName(
      /how many frontend developers work on these react applications\?/i
    );
  });

  it('does not render helper text or why-we-ask copy', () => {
    render(<QuestionSectionHarness />);

    expect(screen.queryByText(/why we ask/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
  });

  it('does not render a section title heading inside the question section', () => {
    render(<QuestionSectionHarness />);

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByText(/^section 1$/i)).not.toBeInTheDocument();
  });

  it('renders the validation error once and connects it to the radio group', async () => {
    render(<QuestionSectionHarness defaultValues={{}} validateOnMount />);

    const errorText = await screen.findByText(/^required$/i);
    const radioGroup = screen.getByRole('radiogroup');

    expect(errorText).toHaveAttribute('id', 'frontendDeveloperCount-error');
    expect(radioGroup).toHaveAttribute('aria-describedby', 'frontendDeveloperCount-error');
    expect(screen.getByText(/^required$/i)).toBeInTheDocument();
  });
});
