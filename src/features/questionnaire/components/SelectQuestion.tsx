import {
  FormControl,
  FormHelperText,
  InputLabel,
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
  const fieldId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-select`;
  const labelId = `${fieldId}-label`;
  const helperTextId = helperText ? `${fieldId}-helper-text` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const descriptionIds = [helperTextId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <FormControl error={Boolean(error)} fullWidth>
      <Stack spacing={1.5}>
        <Stack spacing={0.75}>
          <InputLabel
            id={labelId}
            shrink
            sx={{ color: 'text.primary', typography: 'h6', position: 'static', transform: 'none' }}
          >
            {label}
          </InputLabel>
          {helperText ? (
            <Typography id={helperTextId} variant="body2" color="text.secondary">
              {helperText}
            </Typography>
          ) : null}
        </Stack>
        <Select
          id={fieldId}
          labelId={labelId}
          label={label}
          displayEmpty
          value={value ?? ''}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={descriptionIds}
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
        {error ? <FormHelperText id={errorId}>{error}</FormHelperText> : null}
      </Stack>
    </FormControl>
  );
}
