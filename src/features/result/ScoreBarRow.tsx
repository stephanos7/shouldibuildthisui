import { Chip, LinearProgress, Stack, Typography } from '@mui/material';
import type { ScoreComparisonRow } from './resultContent';

type ScoreBarRowProps = {
  row: ScoreComparisonRow;
};

export default function ScoreBarRow({ row }: ScoreBarRowProps) {
  return (
    <Stack spacing={0.75}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          useFlexGap
          flexWrap="wrap"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
            {row.label}
          </Typography>
          {row.isRecommended ? (
            <Chip size="small" color="primary" label="Recommended" />
          ) : null}
          {row.isRunnerUp ? (
            <Chip size="small" variant="outlined" label="Runner-up" />
          ) : null}
        </Stack>

        <Typography variant="body2" fontWeight={700}>
          {row.score}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={row.normalizedScore}
        aria-label={`${row.label} score ${row.score}`}
        sx={{
          height: 8,
          borderRadius: 999,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            borderRadius: 999
          }
        }}
      />

      <Typography variant="caption" color="text.secondary">
        {row.description}
      </Typography>
    </Stack>
  );
}
