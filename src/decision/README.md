# Decision System

This directory contains the framework-independent recommendation engine. It turns normalized questionnaire answers into a `DecisionResult`.

## Input-to-decision pipeline

1. The questionnaire UI collects raw answers in `src/features/questionnaire`.
2. `questionnaireSchema.ts` validates that every field is present and uses an allowed value.
3. `normalizeQuestionnaireValues()` converts validated input into `DecisionFacts`.
4. `decide()` validates the policy shape.
5. `applyGate()` checks the single exceptional gate.
6. If no gate matches, base rules and interaction rules are applied.
7. `combineScores()` sums integer deltas per path.
8. `rankPaths()` sorts the four paths by score.
9. `calculateConfidence()` compares the winner and runner-up.
10. `buildExplanation()` produces the summary, reasons, counter-signals, and optional runner-up detail.

The current normalizer is identity-only, but the pipeline still routes through `DecisionFacts` so questionnaire wording can evolve without forcing policy rewrites.

## DecisionFacts

`DecisionFacts` in `src/decision/types/DecisionFacts.ts` is the only input shape the decision engine understands.

Important constraint:

- Policy code works with normalized descriptive values such as `cross_app_consistency`.
- Policy code does not depend on UI labels such as "Consistency across multiple apps".
- React components must not branch recommendation behavior directly from form state.

See `docs/input-dictionary.md` for field-by-field meaning.

## DecisionResult

`DecisionResult` in `src/decision/types/DecisionResult.ts` contains:

- `decisionType`: `gate` or `score`
- `policyVersion`: version string from the assembled policy
- `facts`: normalized `DecisionFacts`
- `recommendation`: winning path
- `rankedPaths`: all four paths in descending order
- `scores`: integer totals for all four paths
- `confidence`: `low`, `medium`, or `high`
- `appliedRules`: audit trail of the matched rules
- `explanation`: summary text and recommendation rationale

This structure exists so the result page can stay dumb: it renders the engine output instead of reconstructing business logic.

## Rule types

### Gate rules

Gate rules are direct recommendations. If a gate matches, scoring stops and the engine returns a high-confidence recommendation.

The current policy has exactly one gate:

- `gate-prototype-simple-internal-tool`

Why exactly one gate exists:

- Gates bypass normal tradeoff scoring.
- More gates would make the policy harder to calibrate and harder to explain when scenarios sit near a boundary.
- The shipped gate is intentionally narrow: a single-team internal prototype with simple scope and self-serve expectations.

If you think a new gate is needed, the default answer should be "use interaction rules instead" unless the case is truly exceptional.

### Base rules

Base rules represent weak standalone signals. Most current weights are in the `+1` to `+2` range, with occasional path-specific negative space handled by absence of competing points rather than explicit penalties.

Examples:

- prototype horizon nudges toward `build_it_yourself`
- advanced grids nudge toward `mui_x_premium`
- enterprise support nudges toward `mui_x_enterprise`

### Interaction rules

Interaction rules represent combinations that matter more than any single field alone. Most recommendation intelligence should live here.

Examples:

- multi-team plus multi-app scale
- concentrated UI knowledge plus long ownership horizon
- frequent regressions plus long change lead time
- mission-critical grids plus enterprise support

## Confidence

Confidence is based on the score margin between the top two ranked paths:

- `0-1` points: `low`
- `2-4` points: `medium`
- `5+` points: `high`

This keeps confidence explainable and easy to tune. The app intentionally does not present fake precision such as percentages.

## Explanations

The explanation builder uses applied rules only.

- `summary` states the winning path and margin, or the matching gate.
- `recommendationReasons` lists positive reasons for the winning path.
- `counterSignals` lists negative contributions against the winning path if any exist.
- `runnerUp` is included only when the score margin is `0` or `1`.

That means the UI can explain close calls without inventing new heuristics.

## Calibration scenarios

Calibration scenarios live in `src/decision/tests/calibrationScenarios.ts`. They are the maintainers' main safety net when changing policy.

Each scenario includes:

- stable `id`
- human label
- normalized input
- expected recommendation
- notes describing the business intent

`calibrationScenarios.test.ts` runs every scenario through `decide()` against the assembled policy. When policy behavior changes, update scenarios only if the business intent has changed. Do not patch around failures by stacking unrelated rules.

## Related docs

- `docs/input-dictionary.md`
- `docs/scoring-model.md`
- `docs/rule-authoring-guide.md`
- `docs/calibration-guide.md`
- `docs/adding-a-question.md`
