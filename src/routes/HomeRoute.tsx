import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function HomeRoute() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          App foundation
        </Typography>
        <Typography variant="h2" component="h1">
          Routing and MUI shell are ready.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is a placeholder home route for the future questionnaire flow.
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" component={RouterLink} to="/result">
          View result placeholder
        </Button>
        <Button variant="outlined" component={RouterLink} to="/internal/calibration">
          View calibration placeholder
        </Button>
      </Stack>
    </Stack>
  );
}
