import { applyBaseRules } from './applyBaseRules';
import { applyGate } from './applyGate';
import { applyInteractionRules } from './applyInteractionRules';
import { buildExplanation } from './buildExplanation';
import { calculateConfidence } from './calculateConfidence';
import { combineScores } from './combineScores';
import { normalizeQuestionnaireValues } from './normalizeQuestionnaireValues';
import { rankPaths } from './rankPaths';
import { validatePolicy } from './validatePolicy';
import type { AppliedRule, DecisionResult } from '../types/DecisionResult';
import type { DecisionFacts } from '../types/DecisionFacts';
import type { Policy } from '../types/Policy';

function buildGateAppliedRule(gate: Policy['gates'][number]): AppliedRule {
  return {
    ruleId: gate.id,
    label: gate.label,
    intent: gate.intent,
    reason: gate.reason,
    ruleType: 'gate',
    recommendation: gate.recommendation
  };
}

export function decide(input: DecisionFacts, policy: Policy): DecisionResult {
  validatePolicy(policy);

  const facts = normalizeQuestionnaireValues(input);
  const gate = applyGate(facts, policy.gates);

  if (gate) {
    const rankedPaths = [
      gate.recommendation,
      ...rankPaths({
        build_it_yourself: 0,
        mui_core: 0,
        mui_x_premium: 0,
        mui_x_enterprise: 0
      }).filter((path) => path !== gate.recommendation)
    ];
    const scores = {
      build_it_yourself: 0,
      mui_core: 0,
      mui_x_premium: 0,
      mui_x_enterprise: 0
    };
    const appliedRules = [buildGateAppliedRule(gate)];

    return {
      decisionType: 'gate',
      policyVersion: policy.version,
      facts,
      recommendation: gate.recommendation,
      rankedPaths,
      scores,
      confidence: 'high',
      appliedRules,
      explanation: buildExplanation({
        decisionType: 'gate',
        recommendation: gate.recommendation,
        rankedPaths,
        scores,
        appliedRules
      })
    };
  }

  const appliedRules = [
    ...applyBaseRules(facts, policy.baseRules),
    ...applyInteractionRules(facts, policy.interactionRules)
  ];
  const scores = combineScores(appliedRules);
  const rankedPaths = rankPaths(scores);
  const recommendation = rankedPaths[0];
  const confidence = calculateConfidence(rankedPaths, scores);

  return {
    decisionType: 'score',
    policyVersion: policy.version,
    facts,
    recommendation,
    rankedPaths,
    scores,
    confidence,
    appliedRules,
    explanation: buildExplanation({
      decisionType: 'score',
      recommendation,
      rankedPaths,
      scores,
      appliedRules
    })
  };
}
