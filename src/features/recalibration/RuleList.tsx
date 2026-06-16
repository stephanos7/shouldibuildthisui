import { Chip, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { pathDefinitions } from '../../decision/policy/pathDefinitions';
import type { RuleView } from './recalibrationTypes';

type RuleListProps = {
  rules: RuleView[];
  selectedRuleId: string | null;
  onSelectRule: (ruleId: string) => void;
};

function getAffectedPathsLabel(rule: RuleView) {
  if (!rule.editable) {
    const match = pathDefinitions.find((path) => path.id === rule.recommendation);
    return match ? `Gate recommends ${match.label}` : 'Gate rule';
  }

  const labels = pathDefinitions
    .filter((path) => rule.affectedPaths.includes(path.id))
    .map((path) => path.label);

  return labels.length > 0 ? labels.join(', ') : 'No path impact';
}

export default function RuleList({ rules, selectedRuleId, onSelectRule }: RuleListProps) {
  return (
    <List sx={{ p: 0 }}>
      {rules.map((rule) => (
        <ListItemButton
          key={rule.id}
          selected={selectedRuleId === rule.id}
          onClick={() => onSelectRule(rule.id)}
          alignItems="flex-start"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <ListItemText
            primary={rule.label}
            secondaryTypographyProps={{ component: 'div' }}
            secondary={
              <Stack spacing={1} sx={{ mt: 1 }}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip size="small" label={rule.type} />
                  <Chip
                    size="small"
                    color={rule.editable ? 'primary' : 'default'}
                    variant={rule.editable ? 'filled' : 'outlined'}
                    label={rule.editable ? (rule.enabled ? 'Enabled' : 'Disabled') : 'Fixed'}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={rule.editable ? 'Editable' : 'Non-editable'}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {getAffectedPathsLabel(rule)}
                </Typography>
              </Stack>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );
}
