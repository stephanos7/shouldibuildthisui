import { List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import type { DecisionResult } from '../../decision/types/DecisionResult';

type ExplanationListProps = {
  result: DecisionResult;
};

export default function ExplanationList({ result }: ExplanationListProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          Applied rule explanations
        </Typography>
        <List disablePadding>
          {result.appliedRules.map((rule) => (
            <ListItem key={rule.ruleId} disableGutters sx={{ alignItems: 'flex-start', py: 1.5 }}>
              <ListItemText
                primary={rule.label}
                secondary={`${rule.ruleType === 'gate' ? 'Gate' : 'Scoring rule'}: ${rule.reason}`}
              />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  );
}
