import { Alert, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
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
  const scenarios = evaluateScenarios();
  const passCount = scenarios.filter((scenario) => scenario.passed).length;
  const failCount = scenarios.length - passCount;

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
            <Typography variant="body2" color="text.secondary">
              {passCount} of {scenarios.length} scenarios match their expected recommendation.
            </Typography>
            {failCount > 0 ? (
              <Alert severity="warning">{failCount} scenarios currently fail calibration.</Alert>
            ) : (
              <Alert severity="success">All scenarios currently pass calibration.</Alert>
            )}
          </Stack>
        </Paper>

        <ScenarioTable scenarios={scenarios} onSelectScenario={setSelectedScenario} />
      </Stack>

      <ScenarioDetailsDrawer scenario={selectedScenario} onClose={() => setSelectedScenario(null)} />
    </>
  );
}
