import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material';
import type { QuestionImportance, QuestionLayout, QuestionOption } from '../questionnaireTypes';

type RadioCardGroupProps = {
  name: string;
  label: string;
  helperText?: string;
  error?: string;
  layout?: QuestionLayout;
  importance?: QuestionImportance;
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
  layout = 'single-column',
  importance = 'primary',
  options,
  value,
  onBlur,
  onChange
}: RadioCardGroupProps) {
  const labelId = `${name}-label`;
  const helperTextId = helperText ? `${name}-helper-text` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const descriptionIds = [helperTextId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <FormControl error={Boolean(error)} component="fieldset" fullWidth>
      <Stack spacing={1.5}>
        <FormLabel
          id={labelId}
          component="legend"
          sx={{
            color: 'text.primary',
            typography: importance === 'primary' ? 'h6' : 'subtitle1'
          }}
        >
          {label}
        </FormLabel>
        {helperText ? (
          <FormHelperText id={helperTextId} sx={{ ml: 0, mt: 0 }}>
            {helperText}
          </FormHelperText>
        ) : null}
        <RadioGroup
          name={name}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-labelledby={labelId}
          aria-describedby={descriptionIds}
        >
          <Box
            data-testid={`${name}-options-grid`}
            data-layout={layout}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: layout === 'two-column' ? 'repeat(2, minmax(0, 1fr))' : '1fr'
              },
              gap: 1.5
            }}
          >
            {options.map((option) => {
              const selected = value === option.value;

              return (
                <Box
                  key={option.value}
                  component="label"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    minWidth: 0,
                    p: 1.25,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: selected ? 'primary.main' : 'divider',
                    bgcolor: selected ? 'action.selected' : 'background.paper',
                    transition: 'border-color 160ms ease, background-color 160ms ease',
                    cursor: 'pointer'
                  }}
                >
                  <Radio
                    checked={selected}
                    value={option.value}
                    inputProps={{
                      'aria-label': option.label,
                      'aria-describedby': descriptionIds
                    }}
                  />
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: selected ? 700 : 600 }}>
                      {option.label}
                    </Typography>
                    {option.description ?? option.helperText ? (
                      <Typography variant="body2" color="text.secondary">
                        {option.description ?? option.helperText}
                      </Typography>
                    ) : null}
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </RadioGroup>
        {error ? <FormHelperText id={errorId}>{error}</FormHelperText> : null}
      </Stack>
    </FormControl>
  );
}
