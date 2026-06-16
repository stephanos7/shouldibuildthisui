import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import type { QuestionOption } from '../questionnaireTypes';

type SelectQuestionProps = {
  label: string;
  helperText?: string;
  error?: string;
  options: QuestionOption<string>[];
  value?: string;
  onBlur(): void;
  onChange(...args: [string]): void;
};

export default function SelectQuestion({
  label,
  helperText,
  error,
  options,
  value,
  onBlur,
  onChange
}: SelectQuestionProps) {
  return (
    <FormControl error={Boolean(error)} fullWidth>
      <Stack spacing={1.5}>
        <Stack spacing={0.75}>
          <FormLabel sx={{ color: 'text.primary', typography: 'h6' }}>{label}</FormLabel>
          {helperText ? (
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
          ) : null}
        </Stack>
        <Select
          displayEmpty
          value={value ?? ''}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
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
        {error ? <FormHelperText>{error}</FormHelperText> : null}
      </Stack>
    </FormControl>
  );
}
