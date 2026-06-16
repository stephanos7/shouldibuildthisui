import { Paper, Stack, Typography } from '@mui/material';

export default function ResultRoute() {
  return (
    <Paper variant="outlined" sx={{ p: 4, maxWidth: 720 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1">
          Result route
        </Typography>
        <Typography color="text.secondary">
          Placeholder page for the future recommendation result view.
        </Typography>
      </Stack>
    </Paper>
  );
}
