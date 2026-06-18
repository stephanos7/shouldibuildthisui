import { Paper, Stack, Typography } from '@mui/material';
import type { DecisionResult } from "../../decision/types/DecisionResult";
import ConfidenceBadge from "./ConfidenceBadge";
import {
  getConfidenceSupportingCopy,
  getLeadSummary,
  formatPathLabel,
  getPathDefinition,
  formatUserFacingText
} from "./resultContent";

type RecommendationHeroProps = {
  result: DecisionResult;
};

export default function RecommendationHero({
  result
}: RecommendationHeroProps) {
  const recommendation = getPathDefinition(result.recommendation);
  const runnerUpPath = result.explanation.runnerUp?.path;
  const runnerUp = runnerUpPath ? getPathDefinition(runnerUpPath) : undefined;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 3, sm: 4, md: 5 },
        borderRadius: '32px',
        bgcolor: 'background.paper',
        width: '100%',
        boxShadow: '0 22px 64px rgba(17, 17, 17, 0.05)'
      }}
    >
      <Stack spacing={{ xs: 2.75, md: 3.5 }} alignItems="center" textAlign="center">
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="overline" color="text.secondary">
            Recommended path
          </Typography>
          <ConfidenceBadge confidence={result.confidence} />
        </Stack>
        <Typography variant="h2" component="h2" sx={{ maxWidth: 900, textWrap: 'balance' }}>
          {recommendation?.label ?? formatPathLabel(result.recommendation)}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 780 }}>
          {recommendation?.summary}
        </Typography>
        <Stack spacing={1.25} sx={{ maxWidth: 760 }}>
          <Typography variant="body1">
            {formatUserFacingText(result.explanation.summary)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getLeadSummary(result)}
          </Typography>
          {runnerUpPath ? (
            <Typography variant="body2" color="text.secondary">
              Runner-up: {runnerUp?.label ?? formatPathLabel(runnerUpPath)}.{' '}
              {getConfidenceSupportingCopy(result.confidence)}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}
