import { Grid, Paper, Stack, Typography } from '@mui/material';
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
import KeyFactorsSection from './KeyFactorsSection';
import RecommendationHero from './RecommendationHero';
import ReportMetricTile from './ReportMetricTile';
import ResultReportHeader from './ResultReportHeader';
import ResultReportShell from './ResultReportShell';
import ScoreBreakdown from './ScoreBreakdown';
import { formatConfidenceLabel, getLeadDelta, getPathDefinition } from './resultContent';

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
      <ResultReportShell>
        <Paper variant="outlined" sx={{ p: 4, maxWidth: 720 }}>
          <Stack spacing={2}>
            <Typography variant="h4" component="h1">
              Recommendation report
            </Typography>
            <Typography color="text.secondary">
              No questionnaire submission was found. Start from the questionnaire to generate a
              result.
            </Typography>
            <Typography
              component={RouterLink}
              to="/"
              sx={{
                alignSelf: 'flex-start',
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Back to questionnaire
            </Typography>
          </Stack>
        </Paper>
      </ResultReportShell>
    );
  }

  const runnerUpPath = resolvedResult.result.explanation.runnerUp?.path;
  const runnerUp = runnerUpPath ? getPathDefinition(runnerUpPath) : undefined;
  const leadDelta = getLeadDelta(resolvedResult.result);

  return (
    <ResultReportShell>
      <ResultReportHeader
        policyVersion={activePolicy.version}
        decisionType={resolvedResult.result.decisionType}
        hasLocalOverrides={resolvedResult.metadata.hasLocalOverrides}
        onStartOver={handleStartOver}
      />
      <RecommendationHero result={resolvedResult.result} />

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <ReportMetricTile
            label="Confidence"
            value={formatConfidenceLabel(resolvedResult.result.confidence)}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <ReportMetricTile
            label="Score lead"
            value={leadDelta > 0 ? `${leadDelta} point${leadDelta === 1 ? '' : 's'}` : 'Tied'}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <ReportMetricTile
            label="Runner-up"
            value={runnerUp?.label ?? 'None'}
            description={
              runnerUpPath ? `Score ${resolvedResult.result.scores[runnerUpPath]}` : 'No close alternative'
            }
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <ReportMetricTile label="Policy version" value={activePolicy.version} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <KeyFactorsSection
            appliedRules={resolvedResult.result.appliedRules}
            recommendation={resolvedResult.result.recommendation}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ScoreBreakdown result={resolvedResult.result} />
        </Grid>
      </Grid>
    </ResultReportShell>
  );
}
