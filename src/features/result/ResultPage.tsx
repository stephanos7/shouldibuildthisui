import { Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { decide } from '../../decision/engine/decide';
import { getActiveRecommendationPolicy } from '../../decision/policy/recommendationPolicy';
import {
  activePolicyMetadataMatches,
  getActivePolicyMetadata
} from '../../decision/recalibration/getActivePolicyMetadata';
import { clearRecommendationSession, loadDecisionResult, saveDecisionResult } from '../../shared/storage/recommendationStorage';
import type { QuestionnaireResultState } from '../questionnaire/questionnaireResultState';
import ExplanationList from './ExplanationList';
import RecommendationCard from './RecommendationCard';
import RunnerUpCard from './RunnerUpCard';
import ScoreBreakdown from './ScoreBreakdown';

type ResultPageProps = {
  state: QuestionnaireResultState | null;
};

export default function ResultPage({ state }: ResultPageProps) {
  const navigate = useNavigate();
  const activePolicy = useMemo(() => getActiveRecommendationPolicy(), []);
  const activePolicyMetadata = useMemo(() => getActivePolicyMetadata(), []);
  const resolvedResult = useMemo(() => {
    if (state) {
      return {
        input: state.input,
        result: state.result,
        metadata: activePolicyMetadata,
        shouldPersist: true
      };
    }

    const storedResult = loadDecisionResult();

    if (!storedResult) {
      return null;
    }

    if (activePolicyMetadataMatches(storedResult.metadata, activePolicyMetadata)) {
      return {
        input: storedResult.input,
        result: storedResult.result,
        metadata: storedResult.metadata,
        shouldPersist: false
      };
    }

    const recomputedResult = decide(storedResult.input, activePolicy);

    return {
      input: storedResult.input,
      result: recomputedResult,
      metadata: activePolicyMetadata,
      shouldPersist: true
    };
  }, [activePolicy, activePolicyMetadata, state]);

  useEffect(() => {
    if (!resolvedResult?.shouldPersist) {
      return;
    }

    saveDecisionResult(resolvedResult.input, resolvedResult.result, resolvedResult.metadata);
  }, [resolvedResult]);

  const handleStartOver = () => {
    clearRecommendationSession();
    navigate('/');
  };

  if (!resolvedResult) {
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
        <Typography variant="body2" color="text.secondary">
          Current policy version: {activePolicy.version}
        </Typography>
        <Typography variant="h4" component="h1">
          Recommendation result
        </Typography>
        <Typography color="text.secondary">
          Review the recommendation, confidence, applied rules, and full score breakdown.
        </Typography>
        {resolvedResult.metadata.hasLocalOverrides ? (
          <Typography variant="body2" color="text.secondary">
            This recommendation uses locally recalibrated rule settings.
          </Typography>
        ) : null}
        <Button type="button" variant="text" onClick={handleStartOver} sx={{ alignSelf: 'flex-start' }}>
          Start over
        </Button>
      </Stack>
      <RecommendationCard result={resolvedResult.result} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <RunnerUpCard result={resolvedResult.result} />
        </Grid>
        <Grid item xs={12} md={7}>
          <ExplanationList result={resolvedResult.result} />
        </Grid>
        <Grid item xs={12}>
          <ScoreBreakdown result={resolvedResult.result} />
        </Grid>
      </Grid>
    </Stack>
  );
}
