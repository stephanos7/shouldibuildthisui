# Rule Authoring Guide

This guide explains how to change recommendation behavior safely inside `src/decision/policy`.

## First rule

Do not put recommendation logic in React components. All recommendation behavior belongs in the decision engine and policy modules under `src/decision`.

## Required metadata

Every rule must include:

- `id`
- `label`
- `intent`
- `reason`

Definitions:

- `id`: stable machine-readable identifier used in tests and audits
- `label`: short human-readable name
- `intent`: why the rule exists
- `reason`: explanation text surfaced in audits and result explanations

## Naming convention

Rule IDs should follow:

```txt
<domain>-<situation>-<intent>
```

Examples from the current policy:

- `scale-multi-team-multi-app`
- `advanced-ui-mission-critical-grid-enterprise-support`
- `maintainability-knowledge-concentration-long-horizon`

Prefer business language over technical shorthand.

## How to add a rule

1. Identify whether the change belongs in an existing rule file or needs a new policy grouping.
2. Decide whether the signal is a gate, base rule, or interaction rule.
3. Write conditions only against `DecisionFacts`.
4. Add complete metadata.
5. Choose integer scores that fit the existing scale.
6. Update calibration scenarios to cover the new intent.
7. Run tests and review nearby scenarios for regressions.

## Base vs interaction rules

Use a base rule when:

- one field is a weak standalone signal
- the rule should only nudge, not decide, on its own
- the behavior is broadly applicable across many contexts

Use an interaction rule when:

- the recommendation depends on a combination of fields
- a single input is not enough to justify the outcome
- you need most of the real recommendation intelligence to live in policy instead of UI heuristics

Default toward interaction rules when the business statement contains "when X and Y" or "unless X is also true".

## Why not to add more gates

The current policy has exactly one gate because gates bypass normal score balancing.

Adding more gates is risky because:

- they short-circuit competing signals
- they make edge cases harder to calibrate
- they reduce explainability for close scenarios

Only add a gate if the case is both narrow and intentionally absolute. Most proposed gate behavior should instead be modeled as a high-strength interaction rule.

## Rule placement

Current rule modules are grouped by business domain:

- `base.rules.ts`
- `scale.rules.ts`
- `design-system.rules.ts`
- `maintainability.rules.ts`
- `advanced-ui.rules.ts`
- `quality-risk.rules.ts`
- `delivery.rules.ts`
- `gate.rules.ts`

Follow that organization unless a new domain clearly emerges.

## Rule authoring checklist

- Does the rule operate only on `DecisionFacts`?
- Does it belong in policy rather than UI code?
- Is the `id` stable and descriptive?
- Does `intent` explain why the rule exists?
- Does `reason` read well in a user-facing explanation?
- Is the score strength proportional to the signal?
- Should this be an interaction rule instead of a stronger base rule?
- Does the change preserve the "one gate only" discipline?
- Did you add or update calibration scenarios?
- Did you review low-confidence outcomes after the change?

## Review checklist for pull requests

- No recommendation logic leaked into React components.
- No duplicate heuristics were introduced outside `src/decision`.
- The rule does not compensate for another rule with unrelated scoring noise.
- Calibration failures are understood, not papered over.
- Documentation stays aligned when new inputs or new rule categories are introduced.
