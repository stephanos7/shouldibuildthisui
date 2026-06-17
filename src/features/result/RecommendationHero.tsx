import { Paper, Stack, Typography } from '@mui/material';
import type { DecisionResult } from '../../decision/types/DecisionResult';
import ConfidenceBadge from './ConfidenceBadge';
import {
  getConfidenceSupportingCopy,
  getLeadSummary,
  getPathDefinition
} from './resultContent';

type RecommendationHeroProps = {
  result: DecisionResult;
};

export default function RecommendationHero({ result }: RecommendationHeroProps) {
  const recommendation = getPathDefinition(result.recommendation);
  const runnerUpPath = result.explanation.runnerUp?.path;
  const runnerUp = runnerUpPath ? getPathDefinition(runnerUpPath) : undefined;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        bgcolor: 'background.paper'
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-start' }}
        >
          <Stack spacing={1.25} sx={{ maxWidth: 720 }}>
            <Typography variant="overline" color="text.secondary">
              Recommended path
            </Typography>
            <Typography variant="h2" component="h2">
              {recommendation?.label ?? result.recommendation}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {recommendation?.summary}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <ConfidenceBadge confidence={result.confidence} />
            </Stack>
          </Stack>

          <Stack spacing={1.25} sx={{ maxWidth: 360 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Executive summary
            </Typography>
            <Typography variant="body1">{result.explanation.summary}</Typography>
            <Typography variant="body2" color="text.secondary">
              {getLeadSummary(result)}
            </Typography>
            {runnerUpPath ? (
              <Typography variant="body2" color="text.secondary">
                Runner-up: {runnerUp?.label ?? runnerUpPath}.{' '}
                {getConfidenceSupportingCopy(result.confidence)}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
