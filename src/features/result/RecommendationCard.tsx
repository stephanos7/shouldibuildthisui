import { Paper, Stack, Typography } from "@mui/material";
import type { DecisionResult } from "../../decision/types/DecisionResult";
import ConfidenceBadge from "./ConfidenceBadge";
import { formatPathLabel, getPathDefinition } from "./resultContent";

type RecommendationCardProps = {
  result: DecisionResult;
};

export default function RecommendationCard({
  result
}: RecommendationCardProps) {
  const recommendation = getPathDefinition(result.recommendation);

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          useFlexGap
          alignItems={{ sm: "center" }}
        >
          <ConfidenceBadge confidence={result.confidence} />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            Recommended path
          </Typography>
          <Typography variant="h3" component="h1">
            {recommendation?.label ?? formatPathLabel(result.recommendation)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {recommendation?.summary}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {result.explanation.summary}
        </Typography>
      </Stack>
    </Paper>
  );
}
