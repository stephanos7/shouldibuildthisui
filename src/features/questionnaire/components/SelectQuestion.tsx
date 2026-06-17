import { FormControl, MenuItem, Select } from '@mui/material';
import type { QuestionOption } from '../questionnaireTypes';

type SelectQuestionProps = {
  id: string;
  labelledById?: string;
  describedById?: string;
  hasError?: boolean;
  options: QuestionOption<string>[];
  value?: string;
  onBlur(): void;
  onChange(...args: [string]): void;
};

export default function SelectQuestion({
  id,
  labelledById,
  describedById,
  hasError = false,
  options,
  value,
  onBlur,
  onChange
}: SelectQuestionProps) {
  const fieldId = `${id}-select`;

  return (
    <FormControl error={hasError} fullWidth>
      <Select
        id={fieldId}
        displayEmpty
        value={value ?? ''}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        inputProps={{
          'aria-labelledby': labelledById,
          'aria-describedby': describedById
        }}
      >
        <MenuItem disabled value="">
          Select an option
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
