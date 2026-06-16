# Recalibration Guide

Recalibration is the local maintainer workflow for tuning how strongly the shipped policy rules influence recommendations without changing the underlying policy structure.

## What recalibration means

Recalibration does not create a second policy system. The base policy still lives in `src/decision/policy/recommendationPolicy.ts`.

Recalibration adds a local layer of rule overrides on top of that base policy. Those overrides can change only editable non-gate rules by:

- enabling or disabling the rule
- changing integer path scores
- changing the rule reason text
- storing an internal note for the current browser

Recalibration does not let maintainers:

- add new inputs
- add new recommendation paths
- add new gates
- change rule conditions
- edit gate behavior

## Active policy resolution

The active policy is assembled by `getActiveRecommendationPolicy()` in `src/decision/policy/recommendationPolicy.ts`.

Resolution works like this:

1. Start from `recommendationPolicy`.
2. Load saved overrides from browser storage.
3. Apply overrides only when they are compatible with the shipped policy version.
4. Apply overrides only to editable base rules and interaction rules.
5. Leave gates and rule conditions unchanged.

Compatibility currently means:

- override payload `version === 1`
- override `policyVersion === recommendationPolicy.version`

If either check fails, the app falls back to the base policy with no local recalibration applied.

## localStorage persistence

Recalibration overrides are stored in browser `localStorage` under:

```txt
mui-recommender:v1:recalibration-overrides
```

The stored shape is `RecalibrationOverrides` from `src/decision/types/Recalibration.ts`:

- one top-level override document
- keyed by `ruleId`
- containing rule-level override data only

There is no persisted copy of a whole alternate policy. The base policy remains in source control, and the browser stores only the override values needed to modify matching editable rules.

## Reset behavior

The recalibration UI supports two reset paths:

- `Reset rule override` removes the selected rule's override and returns that rule to the shipped base policy values.
- `Reset all overrides` clears the entire recalibration storage entry and returns the active policy to the shipped base policy.

If the last saved override is removed, the storage entry is deleted rather than kept as an empty override object.

## Effect on future recommendations

Saved recalibration overrides affect future recommendations in the same browser when the overrides are still compatible with the current base policy version.

That applies to:

- new questionnaire submissions
- recomputation of stored results when the active policy metadata changes
- internal calibration review against the active assembled policy

Overrides are local and browser-only. They are not shared with other users, do not sync to a backend, and do not change the committed base policy files.
