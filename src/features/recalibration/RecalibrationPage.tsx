import { Alert, Button, Grid2 as Grid, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { recommendationPolicy } from '../../decision/policy/recommendationPolicy';
import { isValidOverrideScore } from '../../decision/recalibration/validateRecalibrationOverride';
import type { Path } from '../../decision/types/Path';
import type { RecalibrationOverrides } from '../../decision/types/Recalibration';
import {
  clearRecalibrationOverrides,
  loadRecalibrationOverrides,
  saveRecalibrationOverrides
} from '../../shared/storage/recalibrationStorage';
import RecalibrationHelpText from './RecalibrationHelpText';
import RuleEditPanel from './RuleEditPanel';
import RuleList from './RuleList';
import {
  buildEditableRuleView,
  buildGateRuleView,
  createRuleDraft,
  type RuleDraft,
  type RuleView
} from './recalibrationTypes';

type ValidationErrors = Partial<Record<Path | 'reason', string>>;

function buildRuleViews(overrides: RecalibrationOverrides | null): RuleView[] {
  return [
    ...recommendationPolicy.baseRules.map((rule) =>
      buildEditableRuleView(rule, 'Base rule', overrides?.overrides[rule.id])
    ),
    ...recommendationPolicy.interactionRules.map((rule) =>
      buildEditableRuleView(rule, 'Interaction rule', overrides?.overrides[rule.id])
    ),
    ...recommendationPolicy.gates.map((rule) => buildGateRuleView(rule))
  ];
}

function buildOverridesPayload(
  nextOverrides: RecalibrationOverrides['overrides']
): RecalibrationOverrides | null {
  const ruleOverrides = Object.values(nextOverrides);

  if (ruleOverrides.length === 0) {
    return null;
  }

  const latestUpdatedAt = ruleOverrides.reduce(
    (latest, override) => (override.updatedAt > latest ? override.updatedAt : latest),
    ruleOverrides[0].updatedAt
  );

  return {
    version: 1,
    policyVersion: recommendationPolicy.version,
    updatedAt: latestUpdatedAt,
    overrides: nextOverrides
  };
}

export function validateDraft(draft: RuleDraft): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [path, value] of Object.entries(draft.scores) as Array<[Path, string]>) {
    const numericValue = Number(value);

    if (!isValidOverrideScore(numericValue)) {
      errors[path] = 'Choose a score between -5 and 5.';
    }
  }

  if (!draft.reason.trim()) {
    errors.reason = 'Reason is required.';
  }

  return errors;
}

function findSourceEditableRule(ruleId: string) {
  const baseRule = recommendationPolicy.baseRules.find((rule) => rule.id === ruleId);

  if (baseRule) {
    return buildEditableRuleView(baseRule, 'Base rule');
  }

  const interactionRule = recommendationPolicy.interactionRules.find((rule) => rule.id === ruleId);

  if (interactionRule) {
    return buildEditableRuleView(interactionRule, 'Interaction rule');
  }

  return null;
}

export default function RecalibrationPage() {
  const [overrides, setOverrides] = useState<RecalibrationOverrides | null>(() => loadRecalibrationOverrides());
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, RuleDraft>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusSeverity, setStatusSeverity] = useState<'success' | 'error'>('success');

  const rules = useMemo(() => buildRuleViews(overrides), [overrides]);
  const selectedRule = useMemo(
    () => rules.find((rule) => rule.id === selectedRuleId) ?? rules[0] ?? null,
    [rules, selectedRuleId]
  );

  useEffect(() => {
    if (!selectedRuleId && rules.length > 0) {
      setSelectedRuleId(rules[0].id);
    }
  }, [rules, selectedRuleId]);

  useEffect(() => {
    if (!selectedRule || !selectedRule.editable || drafts[selectedRule.id]) {
      return;
    }

    setDrafts((current) => ({
      ...current,
      [selectedRule.id]: createRuleDraft(selectedRule)
    }));
  }, [drafts, selectedRule]);

  const selectedDraft = selectedRule && selectedRule.editable ? drafts[selectedRule.id] ?? null : null;

  function updateSelectedDraft(updater: (draft: RuleDraft) => RuleDraft) {
    if (!selectedRule || !selectedRule.editable) {
      return;
    }

    setDrafts((current) => {
      const existingDraft = current[selectedRule.id] ?? createRuleDraft(selectedRule);

      return {
        ...current,
        [selectedRule.id]: updater(existingDraft)
      };
    });
  }

  function persistOverrides(nextOverrides: RecalibrationOverrides['overrides']) {
    const payload = buildOverridesPayload(nextOverrides);

    if (!payload) {
      clearRecalibrationOverrides();
      setOverrides(null);
      return true;
    }

    const didSave = saveRecalibrationOverrides(payload);

    if (!didSave) {
      return false;
    }

    setOverrides(payload);
    return true;
  }

  function handleSaveRule() {
    if (!selectedRule || !selectedRule.editable || !selectedDraft) {
      return;
    }

    const nextErrors = validateDraft(selectedDraft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatusSeverity('error');
      setStatusMessage('Fix validation errors before saving.');
      return;
    }

    const updatedAt = new Date().toISOString();
    const nextOverride = {
      ruleId: selectedRule.id,
      enabled: selectedDraft.enabled,
      scores: {
        build_it_yourself: Number(selectedDraft.scores.build_it_yourself),
        mui_core: Number(selectedDraft.scores.mui_core),
        mui_x_premium: Number(selectedDraft.scores.mui_x_premium),
        mui_x_enterprise: Number(selectedDraft.scores.mui_x_enterprise)
      },
      reason: selectedDraft.reason.trim(),
      internalNote: selectedDraft.internalNote.trim() || undefined,
      updatedAt
    };

    const nextOverrides = {
      ...(overrides?.overrides ?? {}),
      [selectedRule.id]: nextOverride
    };

    if (!persistOverrides(nextOverrides)) {
      setStatusSeverity('error');
      setStatusMessage('Recalibration changes could not be saved.');
      return;
    }

    setDrafts((current) => ({
      ...current,
      [selectedRule.id]: {
        ...selectedDraft,
        reason: selectedDraft.reason.trim(),
        internalNote: selectedDraft.internalNote.trim()
      }
    }));
    setStatusSeverity('success');
    setStatusMessage('Recalibration changes saved.');
  }

  function handleResetRule() {
    if (!selectedRule || !selectedRule.editable) {
      return;
    }

    const nextOverrides = { ...(overrides?.overrides ?? {}) };
    delete nextOverrides[selectedRule.id];

    persistOverrides(nextOverrides);

    const sourceRule = findSourceEditableRule(selectedRule.id);

    if (!sourceRule) {
      return;
    }

    setDrafts((current) => ({
      ...current,
      [selectedRule.id]: createRuleDraft(sourceRule)
    }));
    setErrors({});
    setStatusSeverity('success');
    setStatusMessage('Rule override reset.');
  }

  function handleResetAll() {
    clearRecalibrationOverrides();
    setOverrides(null);
    setDrafts({});
    setErrors({});
    setStatusSeverity('success');
    setStatusMessage('All recalibration overrides cleared.');
  }

  return (
    <>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            Internal recalibration
          </Typography>
          <Typography color="text.secondary">
            Review existing rules and adjust editable rule strength without changing the decision
            model structure.
          </Typography>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <RecalibrationHelpText />
        </Paper>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Typography variant="h6">Rules</Typography>
          <Button variant="outlined" color="inherit" onClick={() => void handleResetAll()}>
            Reset all overrides
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper variant="outlined">
              <Stack spacing={2} sx={{ p: 3, pb: 0 }}>
                <Typography variant="subtitle1">Rule list</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gate rules are fixed and cannot be recalibrated in this version.
                </Typography>
              </Stack>
              <RuleList
                rules={rules}
                selectedRuleId={selectedRule?.id ?? null}
                onSelectRule={(ruleId) => {
                  setSelectedRuleId(ruleId);
                  setErrors({});
                }}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 7 }}>
            <RuleEditPanel
              selectedRule={selectedRule}
              draft={selectedDraft}
              errors={errors}
              onChangeEnabled={(enabled) => {
                setErrors((current) => ({ ...current, reason: undefined }));
                updateSelectedDraft((draft) => ({ ...draft, enabled }));
              }}
              onChangeInternalNote={(internalNote) =>
                updateSelectedDraft((draft) => ({ ...draft, internalNote }))
              }
              onChangeReason={(reason) => {
                setErrors((current) => ({ ...current, reason: undefined }));
                updateSelectedDraft((draft) => ({ ...draft, reason }));
              }}
              onChangeScore={(path, value) => {
                setErrors((current) => ({ ...current, [path]: undefined }));
                updateSelectedDraft((draft) => ({
                  ...draft,
                  scores: {
                    ...draft.scores,
                    [path]: value
                  }
                }));
              }}
              onResetRule={handleResetRule}
              onSaveRule={handleSaveRule}
            />
          </Grid>
        </Grid>

        <Alert severity="info" variant="outlined">
          No preview, impact assessment, candidate policy comparison, condition editing, new rule
          creation, gate editing, backend persistence, or policy publishing is available on this
          page.
        </Alert>
      </Stack>

      <Snackbar
        open={statusMessage !== null}
        autoHideDuration={4000}
        onClose={() => setStatusMessage(null)}
      >
        <Alert severity={statusSeverity} variant="filled" onClose={() => setStatusMessage(null)}>
          {statusMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
