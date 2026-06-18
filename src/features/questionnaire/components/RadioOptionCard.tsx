import { Paper, Radio, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
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
        minHeight: { xs: 64, md: 52 },
        height: '100%',
        px: { xs: 2, md: 2 },
        py: { xs: 1.5, md: 1.25 },
        cursor: 'pointer',
        borderColor: selected ? 'success.main' : 'divider',
        bgcolor: selected ? alpha('#245B4E', 0.08) : 'background.paper',
        borderRadius: { xs: '24px', md: '999px' },
        transition: (theme) =>
          theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        '&:hover': {
          borderColor: selected ? 'success.main' : 'rgba(17, 17, 17, 0.28)',
          bgcolor: selected ? alpha('#245B4E', 0.1) : 'rgba(17, 17, 17, 0.03)'
        },
        '&:focus-within': {
          outline: '2px solid',
          outlineColor: 'success.main',
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
          color="success"
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
          variant="subtitle1"
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
