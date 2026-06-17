import { Alert, Chip, Stack, Typography } from "@mui/material";
import { formatDecisionType } from "./resultContent";
import ResultActions from "./ResultActions";

type ResultReportHeaderProps = {
  policyVersion: string;
  decisionType: "gate" | "score";
  hasLocalOverrides: boolean;
  onStartOver: () => void;
};

export default function ResultReportHeader({
  policyVersion,
  decisionType,
  hasLocalOverrides,
  onStartOver
}: ResultReportHeaderProps) {
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
      >
        <Stack spacing={1.25} sx={{ maxWidth: 760 }}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              label={`Policy ${policyVersion}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={formatDecisionType(decisionType)}
              size="small"
              variant="outlined"
            />
          </Stack>
          <Typography variant="h4" component="h1">
            Recommendation report
          </Typography>
          <Typography color="text.secondary">
            Your recommended path is based on your answers, the current decision
            policy, and the scoring factors that matched your situation.
          </Typography>
        </Stack>
        <ResultActions onStartOver={onStartOver} />
      </Stack>
      {hasLocalOverrides ? (
        <Alert severity="info">
          This recommendation uses locally recalibrated rule settings.
        </Alert>
      ) : null}
    </Stack>
  );
}
