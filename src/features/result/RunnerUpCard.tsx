import { Paper, Stack, Typography } from '@mui/material';
import type { DecisionResult } from '../../decision/types/DecisionResult';
import { getConfidenceSupportingCopy, getPathDefinition } from './resultContent';

type RunnerUpCardProps = {
  result: DecisionResult;
};

export default function RunnerUpCard({ result }: RunnerUpCardProps) {
  const runnerUpPath = result.rankedPaths[1];
  const runnerUp = runnerUpPath ? getPathDefinition(runnerUpPath) : undefined;

  if (!runnerUpPath) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="h5" component="h2">
          Runner-up
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getConfidenceSupportingCopy(result.confidence)}
        </Typography>
        <Typography variant="h6">{runnerUp?.label ?? runnerUpPath}</Typography>
        <Typography variant="body2" color="text.secondary">
          {runnerUp?.summary}
        </Typography>
        <Typography variant="body2">
          Score: {result.scores[runnerUpPath]}
        </Typography>
      </Stack>
    </Paper>
  );
}
