import { Alert, Paper, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { decide } from '../../decision/engine/decide';
import { recommendationPolicy } from '../../decision/policy/recommendationPolicy';
import { calibrationScenarios } from '../../decision/tests/calibrationScenarios';
import ScenarioDetailsDrawer from './ScenarioDetailsDrawer';
import ScenarioTable from './ScenarioTable';
import type { EvaluatedScenario } from './calibrationTypes';

function evaluateScenarios(): EvaluatedScenario[] {
  return calibrationScenarios.map((scenario) => {
    const result = decide(scenario.input, recommendationPolicy);

    return {
      scenario,
      result,
      passed: result.recommendation === scenario.expectedRecommendation
    };
  });
}

export default function CalibrationPage() {
  const [selectedScenario, setSelectedScenario] = useState<EvaluatedScenario | null>(null);
  const evaluation = useMemo(() => {
    try {
      const scenarios = evaluateScenarios();
      const passCount = scenarios.filter((scenario) => scenario.passed).length;

      return {
        scenarios,
        passCount,
        failCount: scenarios.length - passCount,
        error: null
      };
    } catch (error) {
      return {
        scenarios: [],
        passCount: 0,
        failCount: 0,
        error: error instanceof Error ? error.message : 'Unknown calibration evaluation error.'
      };
    }
  }, []);

  const { scenarios, passCount, failCount, error } = evaluation;

  return (
    <>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            Internal calibration
          </Typography>
          <Typography color="text.secondary">
            Review expected versus actual recommendations for the current policy without editing scenarios
            or rules.
          </Typography>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h6">Calibration summary</Typography>
            {error ? (
              <Alert severity="error">
                Calibration scenarios could not be evaluated: {error}
              </Alert>
            ) : scenarios.length === 0 ? (
              <Alert severity="info">
                No calibration scenarios are currently defined. Add scenarios before using this page for
                policy review.
              </Alert>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  {passCount} of {scenarios.length} scenarios match their expected recommendation.
                </Typography>
                {failCount > 0 ? (
                  <Alert severity="warning">{failCount} scenarios currently fail calibration.</Alert>
                ) : (
                  <Alert severity="success">All scenarios currently pass calibration.</Alert>
                )}
              </>
            )}
          </Stack>
        </Paper>

        {scenarios.length > 0 ? (
          <ScenarioTable scenarios={scenarios} onSelectScenario={setSelectedScenario} />
        ) : null}
      </Stack>

      <ScenarioDetailsDrawer scenario={selectedScenario} onClose={() => setSelectedScenario(null)} />
    </>
  );
}
