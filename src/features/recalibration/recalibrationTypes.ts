import type { RuleRecalibrationOverride } from '../../decision/types/Recalibration';
import type { GatePolicy, ScoredRule } from '../../decision/types/Policy';
import type { Path } from '../../decision/types/Path';

export const scoreOptions = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] as const;

export type RuleEditorType = 'Gate rule' | 'Base rule' | 'Interaction rule';

export type EditableRuleView = {
  id: string;
  label: string;
  intent: string;
  reason: string;
  type: RuleEditorType;
  editable: true;
  enabled: boolean;
  conditions: ScoredRule['conditions'];
  scores: Record<Path, number>;
  internalNote: string;
  affectedPaths: Path[];
};

export type ReadOnlyGateRuleView = {
  id: string;
  label: string;
  intent: string;
  reason: string;
  type: RuleEditorType;
  editable: false;
  conditions: GatePolicy['conditions'];
  recommendation: GatePolicy['recommendation'];
};

export type RuleView = EditableRuleView | ReadOnlyGateRuleView;

export type RuleDraft = {
  enabled: boolean;
  scores: Record<Path, string>;
  reason: string;
  internalNote: string;
};

function buildScoreRecord(scores: Partial<Record<Path, number>>): Record<Path, number> {
  return {
    build_it_yourself: scores.build_it_yourself ?? 0,
    mui_core: scores.mui_core ?? 0,
    mui_x_premium: scores.mui_x_premium ?? 0,
    mui_x_enterprise: scores.mui_x_enterprise ?? 0
  };
}

export function buildEditableRuleView(
  rule: ScoredRule,
  type: Exclude<RuleEditorType, 'Gate rule'>,
  override?: RuleRecalibrationOverride
): EditableRuleView {
  const mergedScores = buildScoreRecord({
    ...rule.scores,
    ...override?.scores
  });

  return {
    id: rule.id,
    label: rule.label,
    intent: rule.intent,
    reason: override?.reason ?? rule.reason,
    type,
    editable: true,
    enabled: override?.enabled ?? rule.enabled,
    conditions: rule.conditions,
    scores: mergedScores,
    internalNote: override?.internalNote ?? '',
    affectedPaths: Object.entries(mergedScores)
      .filter(([, score]) => score !== 0)
      .map(([path]) => path as Path)
  };
}

export function buildGateRuleView(rule: GatePolicy): ReadOnlyGateRuleView {
  return {
    id: rule.id,
    label: rule.label,
    intent: rule.intent,
    reason: rule.reason,
    type: 'Gate rule',
    editable: false,
    conditions: rule.conditions,
    recommendation: rule.recommendation
  };
}

export function createRuleDraft(rule: EditableRuleView): RuleDraft {
  return {
    enabled: rule.enabled,
    scores: {
      build_it_yourself: String(rule.scores.build_it_yourself),
      mui_core: String(rule.scores.mui_core),
      mui_x_premium: String(rule.scores.mui_x_premium),
      mui_x_enterprise: String(rule.scores.mui_x_enterprise)
    },
    reason: rule.reason,
    internalNote: rule.internalNote
  };
}
