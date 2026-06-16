import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import { pathDefinitions } from '../../decision/policy/pathDefinitions';
import type { AppliedRule } from '../../decision/types/DecisionResult';
import type { DecisionFacts } from '../../decision/types/DecisionFacts';
import type { EvaluatedScenario } from './calibrationTypes';

type ScenarioDetailsDrawerProps = {
  scenario: EvaluatedScenario | null;
  onClose: () => void;
};

const pathLabelById = Object.fromEntries(pathDefinitions.map((path) => [path.id, path.label]));

function formatToken(value: string) {
  return value
    .split('_')
    .map((part) => {
      if (part === 'plus') {
        return '+';
      }

      return part;
    })
    .join(' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function renderFacts(facts: DecisionFacts) {
  return Object.entries(facts).map(([field, value]) => (
    <ListItem key={field} disableGutters sx={{ py: 0.75 }}>
      <ListItemText primary={field} secondary={formatToken(value)} />
    </ListItem>
  ));
}

function renderAppliedRule(rule: AppliedRule) {
  const ruleOutcome = rule.recommendation
    ? `Recommends ${pathLabelById[rule.recommendation]}`
    : Object.entries(rule.scores ?? {})
        .map(([path, score]) => `${pathLabelById[path as keyof typeof pathLabelById]} ${score}`)
        .join(' | ');

  return (
    <ListItem key={rule.ruleId} disableGutters sx={{ alignItems: 'flex-start', py: 1.5 }}>
      <ListItemText
        primary={`${rule.label} (${rule.ruleType})`}
        secondary={
          <>
            <Typography component="span" variant="body2" display="block">
              {rule.intent}
            </Typography>
            <Typography component="span" variant="body2" display="block">
              {rule.reason}
            </Typography>
            {ruleOutcome ? (
              <Typography component="span" variant="body2" display="block">
                {ruleOutcome}
              </Typography>
            ) : null}
          </>
        }
      />
    </ListItem>
  );
}

export default function ScenarioDetailsDrawer({ scenario, onClose }: ScenarioDetailsDrawerProps) {
  return (
    <Drawer anchor="right" open={scenario !== null} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 540 }, p: 3 }}>
        {scenario ? (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
              <Stack spacing={1}>
                <Typography variant="h5" component="h2">
                  {scenario.scenario.label}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={scenario.passed ? 'Pass' : 'Fail'}
                    color={scenario.passed ? 'success' : 'error'}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {scenario.scenario.id}
                  </Typography>
                </Stack>
              </Stack>
              <IconButton aria-label="Close details" onClick={onClose}>
                <Typography component="span" variant="h6" lineHeight={1}>
                  ×
                </Typography>
              </IconButton>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="h6">Recommendation outcome</Typography>
              <Typography variant="body2">
                Expected: {pathLabelById[scenario.scenario.expectedRecommendation]}
              </Typography>
              <Typography variant="body2">
                Actual: {pathLabelById[scenario.result.recommendation]}
              </Typography>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                Confidence: {scenario.result.confidence}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h6">Scenario rationale</Typography>
              <Typography variant="body2" color="text.secondary">
                {scenario.scenario.notes}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h6">Input facts</Typography>
              <List disablePadding>{renderFacts(scenario.result.facts)}</List>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h6">Ranked paths</Typography>
              <List disablePadding>
                {scenario.result.rankedPaths.map((path, index) => (
                  <ListItem key={path} disableGutters sx={{ py: 0.75 }}>
                    <ListItemText
                      primary={`${index + 1}. ${pathLabelById[path]}`}
                      secondary={`Score ${scenario.result.scores[path]}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h6">Scores</Typography>
              <List disablePadding>
                {pathDefinitions.map((path) => (
                  <ListItem key={path.id} disableGutters sx={{ py: 0.75 }}>
                    <ListItemText primary={path.label} secondary={`Score ${scenario.result.scores[path.id]}`} />
                  </ListItem>
                ))}
              </List>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h6">Applied rules</Typography>
              <List disablePadding>{scenario.result.appliedRules.map(renderAppliedRule)}</List>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h6">Explanation</Typography>
              <Typography variant="body2">{scenario.result.explanation.summary}</Typography>
              <Typography variant="subtitle2">Recommendation reasons</Typography>
              <List disablePadding>
                {scenario.result.explanation.recommendationReasons.map((reason) => (
                  <ListItem key={reason} disableGutters sx={{ py: 0.5 }}>
                    <ListItemText primary={reason} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle2">Counter signals</Typography>
              <List disablePadding>
                {scenario.result.explanation.counterSignals.length > 0 ? (
                  scenario.result.explanation.counterSignals.map((reason) => (
                    <ListItem key={reason} disableGutters sx={{ py: 0.5 }}>
                      <ListItemText primary={reason} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemText primary="No counter signals" />
                  </ListItem>
                )}
              </List>
              {scenario.result.explanation.runnerUp ? (
                <>
                  <Typography variant="subtitle2">Runner-up</Typography>
                  <Typography variant="body2">
                    {pathLabelById[scenario.result.explanation.runnerUp.path]} trailed by{' '}
                    {scenario.result.explanation.runnerUp.scoreDelta}.
                  </Typography>
                  <List disablePadding>
                    {scenario.result.explanation.runnerUp.reasons.map((reason) => (
                      <ListItem key={reason} disableGutters sx={{ py: 0.5 }}>
                        <ListItemText primary={reason} />
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : null}
            </Stack>
          </Stack>
        ) : null}
      </Box>
    </Drawer>
  );
}
