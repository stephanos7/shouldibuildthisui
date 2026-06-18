import { Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { decide } from "../../decision/engine/decide";
import { getActiveRecommendationPolicy } from "../../decision/policy/recommendationPolicy";
import {
  activePolicyMetadataMatches,
  getActivePolicyMetadata
} from "../../decision/recalibration/getActivePolicyMetadata";
import {
  loadDecisionResult,
  saveDecisionResult
} from "../../shared/storage/recommendationStorage";
import type { QuestionnaireResultState } from "../questionnaire/questionnaireResultState";
import KeyFactorsSection from "./KeyFactorsSection";
import RecommendationHero from "./RecommendationHero";
import ResultReportLayout from "./ResultReportLayout";
import ResultReportShell from "./ResultReportShell";
import ScoreComparison from "./ScoreComparison";

type ResultPageProps = {
  state: QuestionnaireResultState | null;
};

export default function ResultPage({ state }: ResultPageProps) {
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

    if (
      activePolicyMetadataMatches(storedResult.metadata, activePolicyMetadata)
    ) {
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

    saveDecisionResult(
      resolvedResult.input,
      resolvedResult.result,
      resolvedResult.metadata
    );
  }, [resolvedResult]);

  if (!resolvedResult) {
    return (
      <ResultReportShell>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, md: 5 },
            maxWidth: 720,
            mx: "auto",
            borderRadius: "32px"
          }}
        >
          <Stack spacing={2.25}>
            <Typography variant="h3" component="h1">
              No recommendation found
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
              Complete the assessment to generate a recommendation report.
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              sx={{ alignSelf: "flex-start" }}
            >
              Start assessment
            </Button>
          </Stack>
        </Paper>
      </ResultReportShell>
    );
  }

  return (
    <ResultReportShell>
      <ResultReportLayout
        recommendationHero={
          <RecommendationHero result={resolvedResult.result} />
        }
        keyFactors={
          <KeyFactorsSection
            appliedRules={resolvedResult.result.appliedRules}
            recommendation={resolvedResult.result.recommendation}
          />
        }
        scoreComparison={<ScoreComparison result={resolvedResult.result} />}
      />
    </ResultReportShell>
  );
}
