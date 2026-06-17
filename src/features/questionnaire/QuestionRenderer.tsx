import { Controller, useFormContext } from 'react-hook-form';
import type { QuestionnaireValues } from './questionnaireSchema';
import type { QuestionDefinition } from './questionnaireTypes';
import RadioCardGroup from './components/RadioCardGroup';
import SelectQuestion from './components/SelectQuestion';

const radioColumnsByLayout = {
  'single-column': {
    xs: 1,
    sm: 1,
    md: 1
  },
  'two-column': {
    xs: 1,
    sm: 1,
    md: 2
  }
} as const;

type QuestionRendererProps = {
  question: QuestionDefinition;
  labelledById?: string;
  describedById?: string;
};

export default function QuestionRenderer({
  question,
  labelledById,
  describedById
}: QuestionRendererProps) {
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
              id={question.id}
              labelledById={labelledById}
              describedById={describedById}
              hasError={Boolean(fieldError)}
              options={question.options}
              value={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          );
        }

        return (
          <RadioCardGroup
            id={field.name}
            value={field.value ?? ''}
            options={question.options}
            onChange={field.onChange}
            error={fieldError?.message}
            labelledById={labelledById ?? `${question.id}-question`}
            columns={radioColumnsByLayout[question.layout ?? 'single-column']}
            describedById={describedById}
            onBlur={field.onBlur}
          />
        );
      }}
    />
  );
}
