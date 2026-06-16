import {
  Alert,
  Button,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { pathDefinitions } from '../../decision/policy/pathDefinitions';
import type { Path } from '../../decision/types/Path';
import RuleConditionSummary from './RuleConditionSummary';
import RuleScoreEditor from './RuleScoreEditor';
import type { EditableRuleView, RuleDraft, RuleView } from './recalibrationTypes';

type RuleEditPanelProps = {
  draft: RuleDraft | null;
  errors: Partial<Record<Path | 'reason', string>>;
  onChangeEnabled: (enabled: boolean) => void;
  onChangeInternalNote: (value: string) => void;
  onChangeReason: (value: string) => void;
  onChangeScore: (path: Path, value: string) => void;
  onResetRule: () => void;
  onSaveRule: () => void;
  selectedRule: RuleView | null;
};

function renderGateSummary(rule: RuleView) {
  if (rule?.editable) {
    return null;
  }

  const recommendedPath = pathDefinitions.find((path) => path.id === rule.recommendation);

  return (
    <Alert severity="info" variant="outlined">
      Gate rules are fixed and cannot be recalibrated in this version.
      {recommendedPath ? ` This gate recommends ${recommendedPath.label}.` : ''}
    </Alert>
  );
}

function renderReadOnlyMetadata(rule: RuleView) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Rule ID</Typography>
      <Typography variant="body2" color="text.secondary">
        {rule.id}
      </Typography>
      <Typography variant="subtitle2">Rule type</Typography>
      <Typography variant="body2" color="text.secondary">
        {rule.type}
      </Typography>
      <Typography variant="subtitle2">Intent</Typography>
      <Typography variant="body2" color="text.secondary">
        {rule.intent}
      </Typography>
    </Stack>
  );
}

function renderEditableFields(
  draft: RuleDraft,
  errors: Partial<Record<Path | 'reason', string>>,
  onChangeEnabled: (enabled: boolean) => void,
  onChangeInternalNote: (value: string) => void,
  onChangeReason: (value: string) => void,
  onChangeScore: (path: Path, value: string) => void,
  onSaveRule: () => void,
  onResetRule: () => void
) {
  return (
    <>
      <FormControlLabel
        control={
          <Switch checked={draft.enabled} onChange={(event) => onChangeEnabled(event.target.checked)} />
        }
        label={draft.enabled ? 'Rule enabled' : 'Rule disabled'}
      />

      <RuleScoreEditor
        errors={{
          build_it_yourself: errors.build_it_yourself,
          mui_core: errors.mui_core,
          mui_x_premium: errors.mui_x_premium,
          mui_x_enterprise: errors.mui_x_enterprise
        }}
        scores={draft.scores}
        onChange={onChangeScore}
      />

      <TextField
        fullWidth
        label="Reason"
        value={draft.reason}
        onChange={(event) => onChangeReason(event.target.value)}
        error={Boolean(errors.reason)}
        helperText={errors.reason ?? 'This explanation is used in audits and recommendation output.'}
        multiline
        minRows={3}
      />

      <TextField
        fullWidth
        label="Internal note"
        value={draft.internalNote}
        onChange={(event) => onChangeInternalNote(event.target.value)}
        helperText="Internal note is stored with the recalibration override for future reference in this browser."
        multiline
        minRows={3}
      />

      <Alert severity="info" variant="outlined">
        Saved recalibration changes affect future recommendations in this browser.
      </Alert>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button variant="contained" onClick={() => void onSaveRule()}>
          Save changes
        </Button>
        <Button variant="outlined" color="inherit" onClick={() => void onResetRule()}>
          Reset rule override
        </Button>
      </Stack>
    </>
  );
}

export default function RuleEditPanel({
  draft,
  errors,
  onChangeEnabled,
  onChangeInternalNote,
  onChangeReason,
  onChangeScore,
  onResetRule,
  onSaveRule,
  selectedRule
}: RuleEditPanelProps) {
  if (!selectedRule) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6">Selected rule</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Choose a rule to inspect its conditions and recalibration settings.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h6">Selected rule</Typography>
          <Typography variant="subtitle1">{selectedRule.label}</Typography>
        </Stack>

        {renderGateSummary(selectedRule)}
        {renderReadOnlyMetadata(selectedRule)}

        <Divider />

        <RuleConditionSummary conditions={selectedRule.conditions} />

        {selectedRule.editable && draft ? (
          <>
            <Divider />
            {renderEditableFields(
              draft,
              errors,
              onChangeEnabled,
              onChangeInternalNote,
              onChangeReason,
              onChangeScore,
              onSaveRule,
              onResetRule
            )}
          </>
        ) : null}
      </Stack>
    </Paper>
  );
}
