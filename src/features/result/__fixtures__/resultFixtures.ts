import type { DecisionFacts } from '../../../decision/types/DecisionFacts';
import type {
  AppliedRule,
  Confidence,
  DecisionResult
} from '../../../decision/types/DecisionResult';
import type { Path } from '../../../decision/types/Path';

export const questionnaireFacts = {
  frontendDeveloperCount: '20_49',
  teamCount: '4_7',
  reactAppCount: '5_10',
  designSystemMaturity: 'established',
  uiKnowledgeDistribution: 'some_specialists',
  designEngineeringFriction: 'high',
  standardizationIntent: 'cross_app_consistency',
  dataGridComplexity: 'advanced_grids',
  performanceCriticality: 'high',
  accessibilityCriticality: 'high',
  changeLeadTime: 'weeks',
  uiRegressionFrequency: 'frequent',
  deliveryUrgency: 'high',
  applicationCriticality: 'customer_facing',
  supportExpectation: 'enterprise_support',
  ownershipHorizon: 'long_term'
} as const satisfies DecisionFacts;

export const noGateQuestionnaireFacts = {
  ...questionnaireFacts,
  teamCount: '1',
  reactAppCount: '1',
  dataGridComplexity: 'none',
  applicationCriticality: 'customer_facing',
  supportExpectation: 'standard_support',
  ownershipHorizon: 'long_term',
  standardizationIntent: 'none',
  designSystemMaturity: 'none',
  designEngineeringFriction: 'low',
  uiRegressionFrequency: 'rare',
  changeLeadTime: 'same_day'
} as const satisfies DecisionFacts;

function buildAppliedRule(
  index: number,
  options?: {
    ruleType?: AppliedRule['ruleType'];
    recommendation?: Path;
    score?: number;
  }
): AppliedRule {
  const recommendation = options?.recommendation ?? 'mui_x_premium';
  const score = options?.score;

  return {
    ruleId: `rule-${index}`,
    label: `Factor ${index}`,
    intent: `Intent ${index}`,
    reason: `Reason ${index}`,
    ruleType: options?.ruleType ?? 'interaction',
    recommendation,
    scores: score === undefined ? undefined : { [recommendation]: score }
  };
}

function buildAppliedRules(count: number, recommendation: Path = 'mui_x_premium') {
  return Array.from({ length: count }, (_, index) =>
    buildAppliedRule(index + 1, {
      recommendation,
      score: index + 1
    })
  );
}

type ResultOverrides = {
  decisionType?: DecisionResult['decisionType'];
  recommendation?: Path;
  rankedPaths?: Path[];
  scores?: DecisionResult['scores'];
  confidence?: Confidence;
  appliedRules?: AppliedRule[];
  explanation?: DecisionResult['explanation'];
  policyVersion?: string;
  facts?: DecisionFacts;
};

function buildResult(overrides: ResultOverrides = {}): DecisionResult {
  const recommendation = overrides.recommendation ?? 'mui_x_premium';

  return {
    decisionType: overrides.decisionType ?? 'score',
    policyVersion: overrides.policyVersion ?? 'test-policy-v1',
    facts: overrides.facts ?? questionnaireFacts,
    recommendation,
    rankedPaths:
      overrides.rankedPaths ?? [
        'mui_x_premium',
        'mui_x_enterprise',
        'mui_core',
        'build_it_yourself'
      ],
    scores:
      overrides.scores ?? {
        build_it_yourself: 0,
        mui_core: 1,
        mui_x_premium: 3,
        mui_x_enterprise: 2
      },
    confidence: overrides.confidence ?? 'low',
    appliedRules: overrides.appliedRules ?? [],
    explanation:
      overrides.explanation ?? {
        summary: 'Recommended mui_x_premium with a 1-point lead over mui_x_enterprise.',
        recommendationReasons: [],
        counterSignals: [],
        runnerUp: {
          path: 'mui_x_enterprise',
          scoreDelta: 1,
          reasons: []
        }
      }
  };
}

export const oneAppliedRuleResult = buildResult({
  appliedRules: [buildAppliedRule(1, { score: 1 })]
});

export const threeAppliedRulesResult = buildResult({
  appliedRules: buildAppliedRules(3)
});

export const tenAppliedRulesResult = buildResult({
  appliedRules: buildAppliedRules(10)
});

export const lowConfidenceResult = buildResult({
  confidence: 'low'
});

export const mediumConfidenceResult = buildResult({
  confidence: 'medium',
  scores: {
    build_it_yourself: 1,
    mui_core: 3,
    mui_x_premium: 6,
    mui_x_enterprise: 4
  },
  explanation: {
    summary: 'Recommended mui_x_premium with a 2-point lead over mui_x_enterprise.',
    recommendationReasons: [],
    counterSignals: [],
    runnerUp: {
      path: 'mui_x_enterprise',
      scoreDelta: 2,
      reasons: []
    }
  }
});

export const highConfidenceResult = buildResult({
  confidence: 'high',
  scores: {
    build_it_yourself: 0,
    mui_core: 0,
    mui_x_premium: 8,
    mui_x_enterprise: 2
  },
  explanation: {
    summary: 'Recommended mui_x_premium with a strong lead over mui_x_enterprise.',
    recommendationReasons: [],
    counterSignals: [],
    runnerUp: {
      path: 'mui_x_enterprise',
      scoreDelta: 6,
      reasons: []
    }
  }
});

export const scoreResult = buildResult({
  appliedRules: threeAppliedRulesResult.appliedRules,
  confidence: 'low'
});

export const gateResult = buildResult({
  decisionType: 'gate',
  recommendation: 'mui_core',
  rankedPaths: ['mui_core', 'build_it_yourself', 'mui_x_premium', 'mui_x_enterprise'],
  scores: {
    build_it_yourself: 0,
    mui_core: 4,
    mui_x_premium: 0,
    mui_x_enterprise: 0
  },
  confidence: 'high',
  appliedRules: [
    buildAppliedRule(1, {
      ruleType: 'gate',
      recommendation: 'mui_core',
      score: 4
    })
  ],
  explanation: {
    summary: 'Recommended mui_core directly after a gate condition matched.',
    recommendationReasons: ['The assessment matched a direct gate condition.'],
    counterSignals: [],
    runnerUp: {
      path: 'build_it_yourself',
      scoreDelta: 4,
      reasons: []
    }
  }
});

export const negativeScoreResult = buildResult({
  recommendation: 'build_it_yourself',
  rankedPaths: ['build_it_yourself', 'mui_core', 'mui_x_premium', 'mui_x_enterprise'],
  scores: {
    build_it_yourself: 0,
    mui_core: 0,
    mui_x_premium: -1,
    mui_x_enterprise: -2
  },
  confidence: 'high',
  explanation: {
    summary: 'Recommended build_it_yourself with a narrow lead.',
    recommendationReasons: [],
    counterSignals: [],
    runnerUp: {
      path: 'mui_core',
      scoreDelta: 0,
      reasons: []
    }
  }
});

export const allZeroScoreResult = buildResult({
  recommendation: 'build_it_yourself',
  rankedPaths: ['build_it_yourself', 'mui_core', 'mui_x_premium', 'mui_x_enterprise'],
  scores: {
    build_it_yourself: 0,
    mui_core: 0,
    mui_x_premium: 0,
    mui_x_enterprise: 0
  },
  confidence: 'low',
  explanation: {
    summary: 'Recommended build_it_yourself because all paths are tied.',
    recommendationReasons: [],
    counterSignals: [],
    runnerUp: {
      path: 'mui_core',
      scoreDelta: 0,
      reasons: []
    }
  }
});

export const localRecalibrationResult = buildResult({
  appliedRules: [buildAppliedRule(1, { score: 2 })],
  explanation: {
    summary: 'Recommended mui_x_premium with a 1-point lead over mui_x_enterprise.',
    recommendationReasons: [],
    counterSignals: [],
    runnerUp: {
      path: 'mui_x_enterprise',
      scoreDelta: 1,
      reasons: []
    }
  }
});

export const localRecalibrationMetadata = {
  policyVersion: 'test-policy-v1',
  recalibrationUpdatedAt: '2026-01-01T00:00:00.000Z',
  hasLocalOverrides: true
} as const;

export const missingResult = null;
