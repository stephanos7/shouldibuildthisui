import {
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material';
import type { QuestionOption } from '../questionnaireTypes';

type RadioCardGroupProps = {
  name: string;
  label: string;
  helperText?: string;
  error?: string;
  options: QuestionOption<string>[];
  value?: string;
  onBlur(): void;
  onChange(...args: [string]): void;
};

export default function RadioCardGroup({
  name,
  label,
  helperText,
  error,
  options,
  value,
  onBlur,
  onChange
}: RadioCardGroupProps) {
  return (
    <FormControl error={Boolean(error)} component="fieldset" fullWidth>
      <Stack spacing={2}>
        <Stack spacing={0.75}>
          <FormLabel component="legend" sx={{ color: 'text.primary', typography: 'h6' }}>
            {label}
          </FormLabel>
          {helperText ? (
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
          ) : null}
        </Stack>
        <RadioGroup name={name} value={value ?? ''} onBlur={onBlur}>
          <Stack spacing={1.5}>
            {options.map((option) => {
              const selected = value === option.value;

              return (
                <Card
                  key={option.value}
                  variant="outlined"
                  sx={{
                    borderColor: selected ? 'primary.main' : 'divider',
                    boxShadow: selected ? '0 0 0 1px rgba(31, 75, 63, 0.18)' : 'none',
                    transition: 'border-color 160ms ease, box-shadow 160ms ease'
                  }}
                >
                  <label>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      sx={{
                        cursor: 'pointer',
                        px: 2,
                        py: 1.75
                      }}
                    >
                      <Radio
                        checked={selected}
                        onChange={() => onChange(option.value)}
                        value={option.value}
                        inputProps={{ 'aria-label': option.label }}
                      />
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {option.label}
                        </Typography>
                        {option.helperText ? (
                          <Typography variant="body2" color="text.secondary">
                            {option.helperText}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Stack>
                  </label>
                </Card>
              );
            })}
          </Stack>
        </RadioGroup>
        {error ? <FormHelperText>{error}</FormHelperText> : null}
      </Stack>
    </FormControl>
  );
}
