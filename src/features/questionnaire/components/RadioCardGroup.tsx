import {
  Box,
  FormControl,
  FormHelperText,
  RadioGroup
} from '@mui/material';
import type { QuestionOption } from '../questionnaireTypes';
import RadioOptionCard from './RadioOptionCard';

export type RadioCardGroupProps = {
  id: string;
  value: string;
  options: QuestionOption<string>[];
  onChange: (value: string) => void;
  error?: string;
  labelledById: string;
  columns?: {
    xs?: 1 | 2;
    sm?: 1 | 2;
    md?: 1 | 2;
  };
  describedById?: string;
  onBlur(): void;
};

const defaultColumns = {
  xs: 1,
  sm: 1,
  md: 2
} satisfies NonNullable<RadioCardGroupProps['columns']>;

function buildGridTemplateColumns(columns: NonNullable<RadioCardGroupProps['columns']>) {
  return {
    xs: columns.xs === 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
    sm: columns.sm === 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
    md: columns.md === 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr'
  };
}

export default function RadioCardGroup({
  id,
  value,
  options,
  onChange,
  error,
  labelledById,
  columns = defaultColumns,
  describedById,
  onBlur
}: RadioCardGroupProps) {
  const helperTextId = error ? describedById ?? `${id}-error` : describedById;

  return (
    <FormControl error={Boolean(error)} component="fieldset" fullWidth>
      <RadioGroup
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-labelledby={labelledById}
        aria-describedby={helperTextId}
      >
        <Box
          data-testid={`${id}-options-grid`}
          sx={{
            display: 'grid',
            gridTemplateColumns: buildGridTemplateColumns(columns),
            gap: { xs: 1.5, md: 1.25 }
          }}
        >
          {options.map((option) => {
            return (
              <RadioOptionCard
                key={option.value}
                groupId={id}
                option={option}
                selected={value === option.value}
              />
            );
          })}
        </Box>
      </RadioGroup>
      {error ? (
        <FormHelperText id={helperTextId} sx={{ mx: 0, mt: 1 }}>
          {error}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}
