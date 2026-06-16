# AGENTS.md

## Project Overview

This repository contains a Vite + React + TypeScript application that recommends one of four paths:

- Build it yourself
- MUI Core
- MUI X Premium
- MUI X Enterprise

The application collects questionnaire responses, evaluates them through a decision engine, and returns a recommendation with explanations.

The primary goal is maintainable, explainable, and calibratable decisioning.

---

## Core Architecture

The application follows this pipeline:

Questionnaire UI
→ Validation
→ Normalization
→ Decision Engine
→ Recommendation Result

Expanded flow:

1. User completes questionnaire
2. React Hook Form captures values
3. Zod validates values
4. Values are normalized into `DecisionFacts`
5. Decision engine evaluates:
   - Gate rules
   - Base rules
   - Interaction rules

6. Paths are scored
7. Paths are ranked
8. Confidence is calculated
9. Explanations are generated
10. Result is rendered

---

## Architectural Rule

Recommendation logic belongs only in the decision engine.

React components must never:

- calculate scores
- evaluate rule conditions
- choose recommendation paths
- duplicate business logic
- contain recommendation heuristics

React components may:

- collect inputs
- display inputs
- validate inputs
- call `decide()`
- display results

---

## Decision Paths

The only valid recommendation paths are:

- `build_it_yourself`
- `mui_core`
- `mui_x_premium`
- `mui_x_enterprise`

Do not introduce additional paths without explicit approval.

---

## DecisionFacts

All recommendation logic must operate on normalized `DecisionFacts`.

The UI layer must not directly drive recommendation behavior.

If questionnaire wording changes, the decision engine should remain unaffected whenever possible.

---

## Rule Types

### Gate Rules

Gates are direct recommendations.

Do not introduce additional gates unless explicitly requested.

Gates should remain exceptional.

### Base Rules

Base rules represent weak individual signals.

Typical score range:

-2 to +2

Base rules should not determine recommendations on their own.

### Interaction Rules

Interaction rules represent contextual combinations.

Most recommendation intelligence should live here.

Typical score range:

-5 to +5

Interaction rules are preferred over increasing base-rule strength.

---

## Scoring Principles

Do not use:

- percentages
- probabilities
- machine learning
- opaque formulas
- decimal weights

Use:

- simple integer scoring
- explicit conditions
- explainable reasoning

The system should be understandable by non-technical stakeholders.

---

## Rule Requirements

Every rule must contain:

- id
- label
- intent
- reason

Definitions:

### id

Unique stable identifier.

Example:

`scale-multi-team-multi-app`

### label

Short human-readable name.

Example:

`Multiple teams and multiple apps`

### intent

Why the rule exists.

Example:

`Identify organizational scale where governance becomes valuable.`

### reason

Explanation shown in audits and decision explanations.

Example:

`Multiple teams and apps increase the value of shared standards and support.`

---

## Decision Engine Responsibilities

The decision engine is responsible for:

- condition evaluation
- gate evaluation
- base rule application
- interaction rule application
- score aggregation
- ranking
- confidence calculation
- explanation generation

The decision engine should remain framework-independent.

Do not import:

- React
- MUI
- React Router
- browser APIs

into decision-engine modules.

---

## Confidence

Confidence is determined by the margin between the top two paths.

Suggested ranges:

- 0–1 = low
- 2–4 = medium
- 5+ = high

Avoid presenting confidence as a percentage.

---

## Calibration

The recommendation system must remain calibratable.

When changing rules:

1. Review calibration scenarios
2. Update scenarios if necessary
3. Ensure expected recommendations still make sense
4. Avoid compensating for one rule by adding multiple unrelated rules

Prefer adjusting existing rules before adding new ones.

---

## Documentation Expectations

When introducing:

### New input

Update:

- input dictionary
- questionnaire configuration
- validation schema
- decision facts
- calibration scenarios

### New rule

Update:

- policy file
- calibration scenarios
- relevant documentation

### New recommendation behavior

Document:

- business rationale
- affected paths
- expected scenarios

---

## Naming Conventions

Use descriptive names.

Good:

- `frontendDeveloperCount`
- `dataGridComplexity`
- `ownershipHorizon`
- `calculateConfidence`

Avoid:

- `devs`
- `complexity`
- `processData`
- `rule1`

Rule IDs should follow:

`<domain>-<situation>-<intent>`

Examples:

- `scale-multi-team-multi-app`
- `advanced-ui-mission-critical-grid`
- `maintainability-knowledge-concentration`

---

## Testing Expectations

Decisioning changes should include:

- unit tests where appropriate
- calibration scenario updates where appropriate

Critical areas:

- condition evaluation
- rule application
- ranking
- confidence calculation
- calibration scenarios

---

## Maintainability Principles

Optimize for future maintainers.

A new engineer should be able to answer:

- Where does recommendation logic live?
- Why was this recommendation made?
- Which rule caused this behavior?
- How can this behavior be changed safely?

without reverse-engineering the application.

Prefer:

- explicitness over cleverness
- readability over abstraction
- business terminology over technical shortcuts
- rule explanations over hidden behavior

The recommendation system is a business policy engine, not a technical optimization problem.

## Implementation Plan

For this project, follow `IMPLEMENTATION_PLAN.md` as the source of truth for build order, PR sequencing, scope boundaries, and acceptance criteria.

Do not implement the whole app in one pass.

For each implementation task:

1. Identify the relevant PR section in `IMPLEMENTATION_PLAN.md`.
2. Modify only the files needed for that PR.
3. Do not pull in future PR scope.
4. Run the required validation commands.
5. Summarize what changed and whether acceptance criteria were met.

If `IMPLEMENTATION_PLAN.md` conflicts with this `AGENTS.md`, follow `AGENTS.md` for architectural constraints and `IMPLEMENTATION_PLAN.md` for sequencing.
