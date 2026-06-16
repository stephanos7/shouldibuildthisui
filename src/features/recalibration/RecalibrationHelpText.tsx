import { Alert, Stack, Typography } from '@mui/material';

export default function RecalibrationHelpText() {
  return (
    <Stack spacing={2}>
      <Typography color="text.secondary">
        Recalibration lets you adjust how strongly existing rules influence recommendations.
      </Typography>
      <Typography color="text.secondary">
        You can enable or disable existing non-gate rules, change their score contributions, and
        edit explanation text.
      </Typography>
      <Typography color="text.secondary">
        You cannot add new questions, create new gates, change rule conditions, or create new
        recommendation paths in this version.
      </Typography>
      <Alert severity="info" variant="outlined">
        These changes are stored locally in this browser. They are not shared with other users.
      </Alert>
    </Stack>
  );
}
