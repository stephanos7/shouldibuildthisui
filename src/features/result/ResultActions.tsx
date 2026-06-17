import { Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type ResultActionsProps = {
  onStartOver: () => void;
};

export default function ResultActions({ onStartOver }: ResultActionsProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', sm: 'center' }}
    >
      <Button component={RouterLink} to="/" variant="contained">
        Edit answers
      </Button>
      <Button type="button" variant="text" color="inherit" onClick={onStartOver}>
        Start over
      </Button>
    </Stack>
  );
}
