import { Paper, Radio, Stack, Typography } from '@mui/material';
import type { QuestionOption } from '../questionnaireTypes';

type RadioOptionCardProps = {
  groupId: string;
  option: QuestionOption<string>;
  selected: boolean;
};

export default function RadioOptionCard({
  groupId,
  option,
  selected
}: RadioOptionCardProps) {
  const labelId = `${groupId}-${option.value}-label`;

  return (
    <Paper
      component="label"
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: { xs: 64, md: 46 },
        height: '100%',
        px: { xs: 2, md: 1.5 },
        py: { xs: 1.5, md: 0.875 },
        borderRadius: { xs: 3, md: 2 },
        cursor: 'pointer',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'action.selected' : 'background.paper',
        transition: (theme) =>
          theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        '&:hover': {
          borderColor: selected ? 'primary.main' : 'text.secondary',
          bgcolor: selected ? 'action.selected' : 'action.hover'
        },
        '&:focus-within': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2
        },
        '&:has(.Mui-disabled)': {
          cursor: 'not-allowed',
          opacity: 0.64
        }
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1.5, md: 1.25 }}
        alignItems="center"
        sx={{ width: '100%', minWidth: 0 }}
      >
        <Radio
          checked={selected}
          value={option.value}
          inputProps={{
            'aria-labelledby': labelId
          }}
          sx={{
            p: { xs: 1, md: 0.5 },
            flexShrink: 0
          }}
        />

        <Typography
          id={labelId}
          variant="subtitle2"
          sx={{
            fontWeight: selected ? 700 : 600,
            lineHeight: 1.25,
            overflowWrap: 'anywhere'
          }}
        >
          {option.label}
        </Typography>
      </Stack>
    </Paper>
  );
}
