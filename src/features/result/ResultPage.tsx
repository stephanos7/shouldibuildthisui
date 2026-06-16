import { Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { QuestionnaireResultState } from '../questionnaire/questionnaireResultState';
import ExplanationList from './ExplanationList';
import RecommendationCard from './RecommendationCard';
import RunnerUpCard from './RunnerUpCard';
import ScoreBreakdown from './ScoreBreakdown';

type ResultPageProps = {
  state: QuestionnaireResultState | null;
};

export default function ResultPage({ state }: ResultPageProps) {
  if (!state) {
    return (
      <Paper variant="outlined" sx={{ p: 4, maxWidth: 720 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            Recommendation result
          </Typography>
          <Typography color="text.secondary">
            No questionnaire submission was found. Start from the questionnaire to generate a result.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" sx={{ alignSelf: 'flex-start' }}>
            Back to questionnaire
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack spacing={3.5}>
      <Stack spacing={1}>
        <Typography variant="h4" component="h1">
          Recommendation result
        </Typography>
        <Typography color="text.secondary">
          Review the recommendation, confidence, applied rules, and full score breakdown.
        </Typography>
      </Stack>
      <RecommendationCard result={state.result} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <RunnerUpCard result={state.result} />
        </Grid>
        <Grid item xs={12} md={7}>
          <ExplanationList result={state.result} />
        </Grid>
        <Grid item xs={12}>
          <ScoreBreakdown result={state.result} />
        </Grid>
      </Grid>
    </Stack>
  );
}
