import { Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type PublicNavProps = {
  hasSavedResult: boolean;
};

export default function PublicNav({ hasSavedResult }: PublicNavProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      <Button component={RouterLink} to="/" variant="text" size="small">
        Assessment
      </Button>
      {hasSavedResult ? (
        <Button component={RouterLink} to="/result" variant="outlined" size="small">
          Result
        </Button>
      ) : null}
    </Stack>
  );
}
