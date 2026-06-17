import { Box, Stack, Typography } from '@mui/material';
import type { DecisionResult } from '../../decision/types/DecisionResult';
import ScoreBarRow from './ScoreBarRow';
import {
  getRankedScoreComparisonRows,
  shouldShowLowScoreComparisonCopy
} from './resultContent';

type ScoreComparisonProps = {
  result: DecisionResult;
};

export default function ScoreComparison({ result }: ScoreComparisonProps) {
  const rows = getRankedScoreComparisonRows(result);

  return (
    <Box component="section" aria-labelledby="score-comparison-heading">
      <Stack spacing={2.5}>
        <Box>
          <Typography id="score-comparison-heading" variant="h5" component="h2">
            Path comparison
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
            Scores show how strongly your answers matched each path.
          </Typography>
        </Box>

        {shouldShowLowScoreComparisonCopy(rows) ? (
          <Typography variant="body2" color="text.secondary">
            Scores are close or low across all paths.
          </Typography>
        ) : null}

        <Stack spacing={1.5}>
          {rows.map((row) => (
            <ScoreBarRow key={row.path} row={row} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
