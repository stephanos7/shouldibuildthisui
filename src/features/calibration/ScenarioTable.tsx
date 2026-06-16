import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { pathDefinitions } from '../../decision/policy/pathDefinitions';
import type { EvaluatedScenario } from './calibrationTypes';

type ScenarioTableProps = {
  scenarios: EvaluatedScenario[];
  onSelectScenario: (scenario: EvaluatedScenario) => void;
};

const pathLabelById = Object.fromEntries(pathDefinitions.map((path) => [path.id, path.label]));

function buildScoreSummary(scenario: EvaluatedScenario) {
  return scenario.result.rankedPaths
    .slice(0, 2)
    .map((path) => `${pathLabelById[path]} ${scenario.result.scores[path]}`)
    .join(' | ');
}

export default function ScenarioTable({ scenarios, onSelectScenario }: ScenarioTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 960 }} aria-label="Calibration scenarios">
        <TableHead>
          <TableRow>
            <TableCell>Scenario</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Expected</TableCell>
            <TableCell>Actual</TableCell>
            <TableCell>Confidence</TableCell>
            <TableCell>Score summary</TableCell>
            <TableCell align="right">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scenarios.map((scenario) => (
            <TableRow key={scenario.scenario.id} hover>
              <TableCell>
                <Typography variant="subtitle2">{scenario.scenario.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {scenario.scenario.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={scenario.passed ? 'Pass' : 'Fail'}
                  color={scenario.passed ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>{pathLabelById[scenario.scenario.expectedRecommendation]}</TableCell>
              <TableCell>{pathLabelById[scenario.result.recommendation]}</TableCell>
              <TableCell sx={{ textTransform: 'capitalize' }}>{scenario.result.confidence}</TableCell>
              <TableCell>{buildScoreSummary(scenario)}</TableCell>
              <TableCell align="right">
                <Button size="small" onClick={() => onSelectScenario(scenario)}>
                  View details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
