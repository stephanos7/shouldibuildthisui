import { Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function InternalNav() {
  return (
    <Stack direction="row" spacing={1}>
      <Button component={RouterLink} to="/" color="inherit">
        Assessment
      </Button>
      <Button component={RouterLink} to="/result" color="inherit">
        Result
      </Button>
      <Button component={RouterLink} to="/internal/calibration" color="inherit">
        Calibration
      </Button>
      <Button component={RouterLink} to="/internal/recalibration" color="inherit">
        Recalibration
      </Button>
    </Stack>
  );
}
