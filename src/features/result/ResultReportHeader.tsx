import { Stack, Typography } from '@mui/material';

export default function ResultReportHeader() {
  return (
    <Stack spacing={1.25} sx={{ maxWidth: 760 }}>
      <Typography variant="h3" component="h1">
        Recommendation report
      </Typography>
      <Typography color="text.secondary">
        Your recommendation is based on your answers and the scoring factors that matched your
        situation.
      </Typography>
    </Stack>
  );
}
