import { Paper, Stack, Typography } from "@mui/material";
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
        p: { xs: 2.5, sm: 3, md: 4 },
        borderRadius: 3,
        bgcolor: "background.paper",
        width: "100%"
      }}
    >
      <Stack spacing={{ xs: 2.5, md: 3 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={{ xs: 2.5, md: 3 }}
          alignItems={{ lg: "center" }}
        >
          <Stack spacing={1.25} sx={{ minWidth: 0 }}>
            <Typography variant="overline" color="text.secondary">
              Recommended path
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3rem", lg: "4rem" },
                lineHeight: 1.02
              }}
            >
              {recommendation?.label ?? formatPathLabel(result.recommendation)}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 820 }}
            >
              {recommendation?.summary}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <ConfidenceBadge confidence={result.confidence} />
            </Stack>
          </Stack>

          <Stack spacing={1.25} sx={{ minWidth: 0, maxWidth: { lg: 520 } }}>
            <Typography variant="subtitle2" color="text.secondary">
              Executive summary
            </Typography>
            <Typography variant="body1">
              {formatUserFacingText(result.explanation.summary)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getLeadSummary(result)}
            </Typography>
            {runnerUpPath ? (
              <Typography variant="body2" color="text.secondary">
                Runner-up: {runnerUp?.label ?? formatPathLabel(runnerUpPath)}.{" "}
                {getConfidenceSupportingCopy(result.confidence)}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
