import { Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type PublicNavProps = {
  hasSavedResult: boolean;
};

export default function PublicNav({ hasSavedResult }: PublicNavProps) {
  return (
    <Stack direction="row" spacing={1}>
      <Button component={RouterLink} to="/" color="inherit">
        Assessment
      </Button>
      {hasSavedResult ? (
        <Button component={RouterLink} to="/result" color="inherit">
          Result
        </Button>
      ) : null}
    </Stack>
  );
}
