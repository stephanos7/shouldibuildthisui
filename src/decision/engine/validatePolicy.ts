import type { Policy } from '../types/Policy';
import { decisionFactOptions } from '../types/DecisionFacts';
import type { Path } from '../types/Path';
import { validPaths } from '../types/Path';

const VALID_PATHS = new Set<Path>(validPaths);
const VALID_FIELDS = new Set<keyof typeof decisionFactOptions>(
  Object.keys(decisionFactOptions) as Array<keyof typeof decisionFactOptions>
);

const VALID_OPERATORS = new Set(['equals', 'notEquals', 'in', 'notIn']);

export function validatePolicy(policy: Policy): void {
  if (!policy.version.trim()) {
    throw new Error('Policy version is required.');
  }

  if (policy.gates.length !== 1) {
    throw new Error(`Policy must contain exactly one gate. Received ${policy.gates.length}.`);
  }

  const seenRuleIds = new Set<string>();

  for (const gate of policy.gates) {
    validateRuleMetadata(gate.id, gate.label, gate.intent, gate.reason, seenRuleIds);

    if (gate.editable !== false) {
      throw new Error(`Gate "${gate.id}" must not be editable.`);
    }

    if (!VALID_PATHS.has(gate.recommendation)) {
      throw new Error(`Gate "${gate.id}" has an invalid recommendation path.`);
    }

    for (const condition of gate.conditions) {
      validateCondition(gate.id, condition);
    }
  }

  for (const rule of [...policy.baseRules, ...policy.interactionRules]) {
    validateRuleMetadata(rule.id, rule.label, rule.intent, rule.reason, seenRuleIds);

    if (typeof rule.enabled !== 'boolean' || typeof rule.editable !== 'boolean') {
      throw new Error(`Rule "${rule.id}" must include enabled and editable flags.`);
    }

    for (const condition of rule.conditions) {
      validateCondition(rule.id, condition);
    }

    for (const [path, score] of Object.entries(rule.scores)) {
      if (!VALID_PATHS.has(path as Path)) {
        throw new Error(`Rule "${rule.id}" references an invalid path "${path}".`);
      }

      validateScore(rule.id, score);
    }
  }
}

function validateRuleMetadata(
  id: string,
  label: string,
  intent: string,
  reason: string,
  seenRuleIds: Set<string>
): void {
  if (!id.trim()) {
    throw new Error('Rule id is required.');
  }

  if (seenRuleIds.has(id)) {
    throw new Error(`Duplicate rule id "${id}" found in policy.`);
  }

  seenRuleIds.add(id);

  if (!label.trim() || !intent.trim() || !reason.trim()) {
    throw new Error(`Rule "${id}" must include label, intent, and reason.`);
  }
}

function validateCondition(
  ruleId: string,
  condition: Policy['gates'][number]['conditions'][number] | Policy['baseRules'][number]['conditions'][number]
): void {
  if (!VALID_OPERATORS.has(condition.operator)) {
    throw new Error(`Rule "${ruleId}" uses unsupported operator "${condition.operator}".`);
  }

  if (!VALID_FIELDS.has(condition.field)) {
    throw new Error(`Rule "${ruleId}" references invalid field "${condition.field}".`);
  }

  const allowedValues = new Set<string>(decisionFactOptions[condition.field] as readonly string[]);
  const values = Array.isArray(condition.value) ? condition.value : [condition.value];

  for (const value of values) {
    if (!allowedValues.has(value)) {
      throw new Error(
        `Rule "${ruleId}" uses invalid value "${value}" for field "${condition.field}".`
      );
    }
  }
}

function validateScore(ruleId: string, score: number): void {
  if (!Number.isInteger(score)) {
    throw new Error(`Rule "${ruleId}" must use integer scores.`);
  }

  if (score < -5 || score > 5) {
    throw new Error(`Rule "${ruleId}" must use scores between -5 and +5.`);
  }
}
