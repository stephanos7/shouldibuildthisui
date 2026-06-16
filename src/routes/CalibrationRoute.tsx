import { Paper, Stack, Typography } from '@mui/material';

export default function CalibrationRoute() {
  return (
    <Paper variant="outlined" sx={{ p: 4, maxWidth: 720 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1">
          Internal calibration
        </Typography>
        <Typography color="text.secondary">
          Placeholder page for calibration scenarios and decision policy review.
        </Typography>
      </Stack>
    </Paper>
  );
}
