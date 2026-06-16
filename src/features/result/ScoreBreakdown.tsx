import { Divider, Paper, Stack, Typography } from '@mui/material';
import { pathDefinitions } from '../../decision/policy/pathDefinitions';
import type { DecisionResult } from '../../decision/types/DecisionResult';

type ScoreBreakdownProps = {
  result: DecisionResult;
};

export default function ScoreBreakdown({ result }: ScoreBreakdownProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2} divider={<Divider flexItem />}>
        <Typography variant="h5" component="h2">
          Score breakdown
        </Typography>
        {pathDefinitions.map((pathDefinition) => (
          <Stack
            key={pathDefinition.id}
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">{pathDefinition.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {pathDefinition.summary}
              </Typography>
            </Stack>
            <Typography variant="h6" component="div">
              {result.scores[pathDefinition.id]}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
