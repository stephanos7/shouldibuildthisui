# Scoring Model

This policy uses explicit integer scoring so maintainers can inspect and tune recommendation behavior without reverse-engineering formulas.

## Why integer scoring

- Integer deltas are easy to read in code reviews.
- Maintainers can reason about the effect of a rule without translating weights or percentages.
- Explanations can point back to specific matched rules.
- Calibration scenarios remain understandable to non-technical stakeholders.

## Why no percentages or probabilities

The app is not predicting an objective truth. It is applying business policy.

Percentages would imply a level of statistical precision the system does not have. Instead, the engine:

- scores four known paths
- ranks them
- reports confidence from the score margin

That is intentionally simpler and more honest.

## Rule ranges

Current guidance from `AGENTS.md`:

- base rules: usually `-2` to `+2`
- interaction rules: usually `-5` to `+5`

In the current implementation, most base rules are weak positive nudges and most interaction rules are medium-strength positive combinations. The model can support negative scores through `ScoreMap`, but the shipped policy mostly expresses opposition by strengthening competing paths instead of subtracting points.

## Scoring flow

1. Evaluate the single gate rule first.
2. If the gate matches, return that recommendation immediately.
3. Otherwise, collect all matching base rules.
4. Collect all matching interaction rules.
5. Sum all score deltas per path in `combineScores()`.
6. Sort the paths in `rankPaths()`.
7. Compute confidence from the winner-runner-up margin.

## Path ranking

`rankPaths()` sorts by descending score. If two paths tie, the engine uses the fixed path order:

1. `build_it_yourself`
2. `mui_core`
3. `mui_x_premium`
4. `mui_x_enterprise`

That tie-breaker is deterministic, which keeps tests and audits stable.

## Runner-up selection

The runner-up is simply `rankedPaths[1]` after sorting.

Two consequences matter:

- the runner-up is always the second-highest path after tie-breaking
- explanation output only includes runner-up detail when the margin is `0` or `1`

Close calls therefore stay visible without cluttering decisive outcomes.

## Confidence model

`calculateConfidence()` uses the score margin between the top two paths:

- `0-1`: `low`
- `2-4`: `medium`
- `5+`: `high`

Examples:

- winner `6`, runner-up `6` -> `low`
- winner `7`, runner-up `6` -> `low`
- winner `8`, runner-up `5` -> `medium`
- winner `10`, runner-up `4` -> `high`

The engine does not look at absolute score totals for confidence. Only the margin matters.

## Why the model prefers interaction rules

Single inputs are often weak signals. Recommendation quality usually comes from combinations:

- scale plus support expectations
- maintainability issues plus long ownership horizon
- deadline pressure plus regression risk
- grid complexity plus enterprise support

When a scenario feels underpowered, prefer improving an interaction rule before increasing a base rule until it dominates by itself.

## Safe tuning guidance

- Adjust one rule at a time.
- Re-run calibration scenarios after each change.
- Check whether the intended path changed for the intended reason.
- Review low-confidence results before increasing weights.
- Prefer modifying an existing rule over adding several compensating rules.
