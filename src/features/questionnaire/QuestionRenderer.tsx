import { Controller, useFormContext } from 'react-hook-form';
import type { QuestionnaireValues } from './questionnaireSchema';
import type { QuestionDefinition } from './questionnaireTypes';
import RadioCardGroup from './components/RadioCardGroup';
import SelectQuestion from './components/SelectQuestion';

type QuestionRendererProps = {
  question: QuestionDefinition;
};

export default function QuestionRenderer({ question }: QuestionRendererProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext<QuestionnaireValues>();

  const fieldError = errors[question.id];

  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => {
        if (question.component === 'select') {
          return (
            <SelectQuestion
              label={question.label}
              helperText={question.helperText}
              error={fieldError?.message}
              options={question.options}
              value={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          );
        }

        return (
          <RadioCardGroup
            name={field.name}
            label={question.label}
            helperText={question.helperText}
            error={fieldError?.message}
            options={question.options}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
          />
        );
      }}
    />
  );
}
