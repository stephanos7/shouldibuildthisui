# Calibration Guide

Calibration keeps the recommendation policy understandable as it evolves. The goal is not to maximize score totals. The goal is to keep expected scenarios recommending sensible paths for defensible reasons.

## Where calibration lives

- Scenarios: `src/decision/tests/calibrationScenarios.ts`
- Scenario test: `src/decision/tests/calibrationScenarios.test.ts`
- Policy under test: `src/decision/policy/recommendationPolicy.ts`
- Runtime calibration review: `src/features/calibration/CalibrationPage.tsx`, which evaluates scenarios against the active assembled policy including saved recalibration overrides.

Each scenario is a named business example with normalized inputs and an expected recommendation.

## How to add a scenario

1. Start from the shared baseline facts in `calibrationScenarios.ts`.
2. Override only the fields needed to express the scenario.
3. Give the scenario a stable `id`.
4. Write a short `label`.
5. Set `expectedRecommendation`.
6. Add `notes` that explain the policy intent, not just the input values.

Prefer scenario names that describe the business pattern, such as `small-team-advanced-grids`.

## How to interpret a calibration failure

A failing scenario means one of three things:

1. The policy changed and the old expectation is no longer correct.
2. The policy changed in an unintended way.
3. The scenario was underspecified and should express its intent more clearly.

Do not immediately update the expected recommendation. First answer:

- Which rule changed the outcome?
- Is the new winner actually preferable?
- Did the change accidentally affect nearby scenarios?
- Is the scenario a close call that should remain low confidence?

## How to tune scores

- Prefer adjusting an existing rule before adding new rules.
- Prefer interaction-rule tuning over making base rules strong enough to decide on their own.
- Change one score cluster at a time.
- Re-run the full calibration suite after each change.
- Review both the winner and the runner-up for affected scenarios.

If one scenario is fixed only by adding several unrelated rules, the policy is probably drifting away from explainability.

## How to review low-confidence outcomes

Low confidence means the top-two paths are separated by only `0` or `1` points.

Review low-confidence cases by asking:

- Is the scenario genuinely ambiguous?
- Does the runner-up explanation make sense?
- Is a missing interaction rule causing an artificial tie?
- Would a small change distort many other scenarios?

Do not force every low-confidence scenario into a decisive outcome. Some business cases should remain close calls.

## Common tuning pattern

When a recommendation is almost right but lacks context, prefer:

- add or refine an interaction rule

Instead of:

- increasing several base rules
- introducing a new gate
- moving logic into the UI

## Recommended validation

After a policy change, run:

```bash
npm run test
npm run lint
npm run typecheck
```

For policy-heavy changes, also inspect:

- changed calibration scenarios
- explanation output for representative cases
- whether the one existing gate still behaves as intended
