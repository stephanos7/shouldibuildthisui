import { Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function InternalNav() {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      <Button component={RouterLink} to="/" variant="text" size="small">
        Assessment
      </Button>
      <Button component={RouterLink} to="/result" variant="outlined" size="small">
        Result
      </Button>
      <Button component={RouterLink} to="/internal/calibration" variant="text" size="small">
        Calibration
      </Button>
      <Button component={RouterLink} to="/internal/recalibration" variant="text" size="small">
        Recalibration
      </Button>
    </Stack>
  );
}
