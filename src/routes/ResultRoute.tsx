import { Alert, Paper, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import type { QuestionnaireResultState } from '../features/questionnaire/questionnaireResultState';

export default function ResultRoute() {
  const location = useLocation();
  const state = location.state as QuestionnaireResultState | null;

  return (
    <Paper variant="outlined" sx={{ p: 4, maxWidth: 720 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1">
          Result route
        </Typography>
        {state ? (
          <>
            <Typography color="text.secondary">
              Recommendation calculated. Detailed result UI is intentionally deferred to a later PR.
            </Typography>
            <Alert severity="success">
              Recommendation: <strong>{state.result.recommendation}</strong>
            </Alert>
          </>
        ) : (
          <Alert severity="info">
            No questionnaire submission was found. Start from the questionnaire to generate a result.
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
