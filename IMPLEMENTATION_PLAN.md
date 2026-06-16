# IMPLEMENTATION_PLAN.md

# MUI Recommendation App Implementation Plan

## 1. Project Goal

Build a Vite + React + TypeScript + MUI application that collects structured questionnaire inputs and recommends one of four paths:

- `build_it_yourself`
- `mui_core`
- `mui_x_premium`
- `mui_x_enterprise`

The system must be:

- maintainable
- explainable
- calibratable
- testable
- easy for future maintainers to understand

The highest-priority concern is the business decision logic, not visual polish.

---

## 2. Core Product Behavior

The user completes a questionnaire.

The app validates the answers, normalizes them into decision facts, evaluates the facts through a decision engine, and shows a recommendation.

The result must include:

- recommended path
- confidence
- runner-up path where useful
- score breakdown
- explanation based on applied rules

The result must not present fake precision such as percentages or probabilities.

Use confidence labels instead:

- low
- medium
- high

---

## 3. Core Architecture

The application follows this pipeline:

```txt
MUI questionnaire
  -> React Hook Form state
  -> Zod validation
  -> normalizeQuestionnaireValues()
  -> DecisionFacts
  -> decide()
  -> one gate
  -> base rules
  -> interaction rules
  -> ranked paths
  -> confidence calculation
  -> explanation generation
  -> MUI result page
```

The React UI must not contain recommendation logic.

The decision engine must not import React, MUI, React Router, browser APIs, or UI components.

---

## 4. Main Architectural Constraint

Recommendation logic belongs only in `src/decision`.

React components may:

- render questions
- collect answers
- validate form completion
- call `decide()`
- render a `DecisionResult`

React components must not:

- calculate scores
- evaluate rule conditions
- select recommendation paths
- duplicate decision policy
- contain recommendation heuristics

---

## 5. Technology Choices

Use:

- Vite
- React
- TypeScript
- MUI
- React Router
- React Hook Form
- Zod
- Vitest
- Testing Library

Do not introduce a general-purpose decision rules engine for the initial version.

The decision engine should be a small internal TypeScript module because the core need is calibrated scoring, explainability, and auditability rather than generic rule execution.

---

## 6. Recommendation Paths

The only valid paths are:

```ts
export type Path =
  | "build_it_yourself"
  | "mui_core"
  | "mui_x_premium"
  | "mui_x_enterprise";
```

Do not add more paths unless explicitly requested.

---

## 7. Decision Inputs

Use normalized decision facts with descriptive values.

```ts
export type DecisionFacts = {
  frontendDeveloperCount: "1_9" | "10_19" | "20_49" | "50_plus";
  teamCount: "1" | "2_3" | "4_7" | "8_plus";
  reactAppCount: "1" | "2_4" | "5_10" | "11_plus";

  designSystemMaturity: "none" | "early" | "established" | "centralized";
  uiKnowledgeDistribution:
    | "distributed"
    | "some_specialists"
    | "few_specialists"
    | "single_point";
  designEngineeringFriction: "low" | "medium" | "high" | "severe";
  standardizationIntent:
    | "none"
    | "local_consistency"
    | "cross_app_consistency"
    | "org_wide_platform";

  dataGridComplexity:
    | "none"
    | "simple_tables"
    | "advanced_grids"
    | "mission_critical_grids";
  performanceCriticality: "low" | "medium" | "high" | "critical";
  accessibilityCriticality:
    | "low"
    | "medium"
    | "high"
    | "regulated_or_mandatory";

  changeLeadTime: "same_day" | "days" | "weeks" | "months";
  uiRegressionFrequency: "rare" | "occasional" | "frequent" | "constant";
  deliveryUrgency: "low" | "medium" | "high" | "fixed_deadline";

  applicationCriticality:
    | "internal_tool"
    | "customer_facing"
    | "revenue_critical"
    | "regulated_or_operationally_critical";
  supportExpectation:
    | "self_serve"
    | "standard_support"
    | "priority_support"
    | "enterprise_support";
  ownershipHorizon:
    | "prototype"
    | "short_term"
    | "long_term"
    | "platform_investment";
};
```

Do not use `a`, `b`, `c`, `d` internally.

User-facing labels may say things like `1–9`, but policy and decision logic should use descriptive values.

---

## 8. Input Grouping

The questionnaire should be sectioned.

### Team and scale

- `frontendDeveloperCount`
- `teamCount`
- `reactAppCount`

### Design system and workflow

- `designSystemMaturity`
- `designEngineeringFriction`
- `standardizationIntent`

### Maintainability risk

- `uiKnowledgeDistribution`
- `changeLeadTime`
- `uiRegressionFrequency`
- `ownershipHorizon`

### Advanced UI needs

- `dataGridComplexity`
- `performanceCriticality`

### Quality, support, and delivery

- `accessibilityCriticality`
- `applicationCriticality`
- `supportExpectation`
- `deliveryUrgency`

---

## 9. Rule Types

The decision engine supports three rule types.

### Gate rule

A gate is a direct recommendation.

For now, the app must have exactly one gate.

Do not add more gates unless explicitly requested.

### Base rule

A base rule is a weak signal from one individual answer.

Typical score range:

```txt
-2 to +2
```

Base rules should not decide the recommendation alone.

### Interaction rule

An interaction rule captures meaningful combinations of inputs.

Most decision nuance should live in interaction rules.

Typical score range:

```txt
-5 to +5
```

Interaction rules should be preferred over making base rules stronger.

---

## 10. Example Gate

Implement exactly one gate.

The gate should recommend `build_it_yourself` for a narrow, low-risk, short-lived internal use case.

Suggested gate:

```ts
{
  id: 'gate-prototype-simple-internal-tool',
  label: 'Prototype or short-term simple internal tool',
  intent: 'Allow a clearly low-risk and short-lived internal use case to bypass scoring.',
  recommendation: 'build_it_yourself',
  conditions: [
    { field: 'ownershipHorizon', operator: 'in', value: ['prototype', 'short_term'] },
    { field: 'applicationCriticality', operator: 'equals', value: 'internal_tool' },
    { field: 'teamCount', operator: 'equals', value: '1' },
    { field: 'reactAppCount', operator: 'equals', value: '1' },
    { field: 'dataGridComplexity', operator: 'in', value: ['none', 'simple_tables'] },
    { field: 'accessibilityCriticality', operator: 'in', value: ['low', 'medium'] },
    { field: 'supportExpectation', operator: 'equals', value: 'self_serve' }
  ],
  reason: 'The use case is narrow, low-risk, short-lived, and does not show advanced UI, support, or accessibility requirements.'
}
```

This should be the only gate.

Everything else should go through scoring.

---

## 11. Scoring Principles

Do not use:

- percentages
- probabilities
- decimal weights
- machine learning
- opaque formulas
- hidden normalization

Use:

- integer scoring
- explicit rules
- named conditions
- clear reasons
- applied-rule explanations

The scoring model should be understandable to non-technical stakeholders.

---

## 12. Rule Requirements

Every rule must include:

- `id`
- `label`
- `intent`
- `reason`

Definitions:

### `id`

Stable unique identifier.

Example:

```txt
scale-moderate-team-narrow-scope
```

### `label`

Short readable title.

Example:

```txt
Moderate team, narrow scope
```

### `intent`

Why the rule exists.

Example:

```txt
Prevent developer count alone from over-recommending Enterprise.
```

### `reason`

Explanation used for result/audit output.

Example:

```txt
A moderate developer count does not justify Enterprise when team count, app count, and advanced UI complexity are low.
```

---

## 13. Initial Rule Families

Create policy rules in these families:

```txt
src/decision/policy/rules/gate.rules.ts
src/decision/policy/rules/base.rules.ts
src/decision/policy/rules/scale.rules.ts
src/decision/policy/rules/design-system.rules.ts
src/decision/policy/rules/maintainability.rules.ts
src/decision/policy/rules/advanced-ui.rules.ts
src/decision/policy/rules/quality-risk.rules.ts
src/decision/policy/rules/delivery.rules.ts
```

### Scale rules

Use:

- `frontendDeveloperCount`
- `teamCount`
- `reactAppCount`

Purpose:

- identify narrow scope
- identify broad rollout
- prevent team size alone from over-recommending Enterprise

### Design-system rules

Use:

- `designSystemMaturity`
- `designEngineeringFriction`
- `standardizationIntent`

Purpose:

- identify standardization needs
- identify design-system platform needs
- favor MUI Core or Enterprise depending on scale

### Maintainability rules

Use:

- `uiKnowledgeDistribution`
- `changeLeadTime`
- `uiRegressionFrequency`
- `ownershipHorizon`

Purpose:

- penalize custom builds when long-term maintainability risk is high
- favor packaged foundations where UI delivery is fragile

### Advanced UI rules

Use:

- `dataGridComplexity`
- `performanceCriticality`

Purpose:

- identify MUI X Premium fit
- identify MUI X Enterprise when advanced UI combines with criticality or support

### Quality-risk rules

Use:

- `accessibilityCriticality`
- `applicationCriticality`
- `supportExpectation`

Purpose:

- reduce custom-build recommendations for critical or regulated apps
- favor Enterprise when support expectation and criticality are high

### Delivery rules

Use:

- `deliveryUrgency`

Purpose:

- penalize custom builds under fixed deadlines
- favor ready-made components when delivery pressure is high

---

## 14. Example Interaction Rules

Initial policy should include interaction rules like these.

### Moderate team, narrow scope

```txt
If:
- frontendDeveloperCount = 10_19
- teamCount = 1
- reactAppCount = 1
- dataGridComplexity = none or simple_tables

Then:
- build_it_yourself +3
- mui_core +1
- mui_x_enterprise -3
```

Intent:

```txt
Prevent developer count alone from over-recommending Enterprise.
```

### Small team with advanced grid needs

```txt
If:
- frontendDeveloperCount = 1_9 or 10_19
- dataGridComplexity = advanced_grids or mission_critical_grids
- teamCount = 1 or 2_3

Then:
- build_it_yourself -5
- mui_x_premium +5
- mui_x_enterprise +1
```

Intent:

```txt
Allow Premium to win even when organizational scale is limited.
```

### Multiple teams and multiple apps

```txt
If:
- teamCount = 4_7 or 8_plus
- reactAppCount = 5_10 or 11_plus

Then:
- build_it_yourself -4
- mui_core +2
- mui_x_premium +2
- mui_x_enterprise +5
```

Intent:

```txt
Identify organizational scale where governance and standardization become valuable.
```

### Centralized design system and org-wide standardization

```txt
If:
- designSystemMaturity = centralized
- standardizationIntent = org_wide_platform

Then:
- build_it_yourself -4
- mui_core +2
- mui_x_enterprise +5
```

Intent:

```txt
Identify a platform-level use case.
```

### Concentrated UI knowledge with long ownership horizon

```txt
If:
- uiKnowledgeDistribution = few_specialists or single_point
- ownershipHorizon = long_term or platform_investment

Then:
- build_it_yourself -5
- mui_core +3
- mui_x_premium +2
- mui_x_enterprise +2
```

Intent:

```txt
Penalize custom builds where long-term maintainability risk is high.
```

### Mission-critical grids with enterprise support

```txt
If:
- dataGridComplexity = mission_critical_grids
- supportExpectation = enterprise_support

Then:
- build_it_yourself -5
- mui_x_premium +2
- mui_x_enterprise +5
```

Intent:

```txt
Distinguish Enterprise from Premium when advanced UI is also operationally critical.
```

---

## 15. Decision Engine Modules

Create:

```txt
src/decision/engine/decide.ts
src/decision/engine/normalizeQuestionnaireValues.ts
src/decision/engine/evaluateCondition.ts
src/decision/engine/applyGate.ts
src/decision/engine/applyBaseRules.ts
src/decision/engine/applyInteractionRules.ts
src/decision/engine/combineScores.ts
src/decision/engine/rankPaths.ts
src/decision/engine/calculateConfidence.ts
src/decision/engine/buildExplanation.ts
src/decision/engine/validatePolicy.ts
```

The main entry point should be:

```ts
decide(input, policy);
```

React code should not call lower-level decision helpers.

---

## 16. DecisionResult

Every decision should return:

```ts
export type DecisionResult = {
  decisionType: "gate" | "score";
  policyVersion: string;
  facts: DecisionFacts;
  recommendation: Path;
  rankedPaths: Path[];
  scores: Record<Path, number>;
  confidence: "low" | "medium" | "high";
  appliedRules: AppliedRule[];
  explanation: DecisionExplanation;
};
```

For a gate result, scores may be zeroed or still returned in a neutral shape, but the result must clearly state `decisionType: 'gate'`.

---

## 17. Confidence Calculation

Confidence is based on the score margin between the top two paths.

```txt
0-1 point margin: low
2-4 point margin: medium
5+ point margin: high
```

Do not display confidence as a percentage.

---

## 18. Explanation Generation

Explanations should come from applied rules.

Do not generate explanations from unrelated UI copy.

A result explanation should include:

- top positive reasons for the recommendation
- meaningful negative reasons where relevant
- runner-up explanation if the margin is low

Applied rules should remain available for audit/debugging.

---

## 19. App Routes

Use React Router.

Create these routes:

```txt
/
Questionnaire

/result
Recommendation result

/internal/calibration
Read-only calibration review
```

Do not add authentication in the initial implementation.

Do not add policy editing in the initial implementation.

---

## 20. MUI Questionnaire UI

Use MUI for all UI.

Use these primitives where appropriate:

- `Container`
- `Stack`
- `Card`
- `Paper`
- `Typography`
- `FormControl`
- `FormLabel`
- `RadioGroup`
- `FormControlLabel`
- `Radio`
- `FormHelperText`
- `Select`
- `MenuItem`
- `Button`
- `Alert`

Create:

```txt
src/features/questionnaire/QuestionnairePage.tsx
src/features/questionnaire/QuestionSection.tsx
src/features/questionnaire/QuestionRenderer.tsx
src/features/questionnaire/components/RadioCardGroup.tsx
src/features/questionnaire/components/SelectQuestion.tsx
```

Use radio-card UI for important categorical questions.

Use compact selects only for lower-salience questions.

All 16 questions must render from `questions.ts`.

---

## 21. Result UI

Create:

```txt
src/features/result/ResultPage.tsx
src/features/result/RecommendationCard.tsx
src/features/result/ConfidenceBadge.tsx
src/features/result/RunnerUpCard.tsx
src/features/result/ScoreBreakdown.tsx
src/features/result/ExplanationList.tsx
```

The result page should show:

- recommended path
- confidence
- runner-up path
- score breakdown
- applied-rule explanations
- graceful fallback if no result is available

The result page must not recompute policy behavior manually.

---

## 22. Calibration UI

Create:

```txt
src/features/calibration/CalibrationPage.tsx
src/features/calibration/ScenarioTable.tsx
src/features/calibration/ScenarioDetailsDrawer.tsx
```

The calibration page should:

- load calibration scenarios
- run each scenario through `decide()`
- show expected recommendation
- show actual recommendation
- show pass/fail
- show confidence
- show scores
- show applied rules
- show explanation

This page is read-only.

Do not add policy editing.

---

## 23. Tests

Use Vitest.

Create:

```txt
src/decision/tests/evaluateCondition.test.ts
src/decision/tests/decide.test.ts
src/decision/tests/policyIntegrity.test.ts
src/decision/tests/calibrationScenarios.test.ts
src/decision/tests/calibrationScenarios.ts
```

### Policy integrity tests must check:

- exactly one gate exists
- all rule IDs are unique
- every rule has `id`, `label`, `intent`, and `reason`
- every score is between `-5` and `+5`
- every score references a valid path
- every condition references a valid `DecisionFacts` field
- every condition uses a valid value
- every condition uses a supported operator

### Calibration scenarios

Add at least 25 scenarios.

They should cover:

- simple internal prototype
- small team with advanced grids
- moderate team with narrow scope
- multi-team multi-app organization
- centralized design system
- early design system with local consistency
- knowledge concentration risk
- frequent regression risk
- long change lead time
- fixed deadline pressure
- regulated or operationally critical app
- enterprise support expectation
- high accessibility criticality
- platform investment horizon
- customer-facing revenue-critical app
- simple single-app internal tool
- large organization with low complexity
- mission-critical grids with support requirements
- org-wide standardization intent
- distributed knowledge with low complexity

---

## 24. Documentation

Create:

```txt
README.md
src/decision/README.md
src/decision/docs/input-dictionary.md
src/decision/docs/scoring-model.md
src/decision/docs/rule-authoring-guide.md
src/decision/docs/calibration-guide.md
src/decision/docs/adding-a-question.md
```

Documentation should explain:

- input-to-decision pipeline
- four recommendation paths
- all 16 inputs
- gate vs base rule vs interaction rule
- why only one gate exists for now
- scoring ranges
- confidence calculation
- how explanations are generated
- how calibration scenarios protect behavior
- how to add a new input
- how to change recommendation behavior safely

---

## 25. Implementation PR Sequence

Implement in this order.

### PR 0: Add AGENTS.md

Scope:

- Add repository guidance only.

Do not scaffold app code.

Acceptance:

- Codex and humans can understand architectural constraints.

---

### PR 1: App scaffold and tooling

Scope:

- Vite React TypeScript app
- MUI theme provider
- React Router
- placeholder routes
- lint/typecheck/test scripts

Do not add decision logic.

Acceptance:

- `npm run build` passes
- `npm run typecheck` passes
- `npm test` passes

---

### PR 2: Domain types, schema, and questions

Scope:

- `Path`
- `DecisionFacts`
- Zod questionnaire schema
- question configuration for all 16 inputs

Do not add scoring.

Acceptance:

- all fields exist
- all fields have allowed values
- question config covers all fields once
- schema tests pass

---

### PR 3: Decision engine core

Scope:

- pure TypeScript engine
- no real policy beyond test fixtures
- no React/MUI imports

Acceptance:

- `decide(input, policy)` works
- condition operators work
- ranking works
- confidence works
- explanation object is returned

---

### PR 4: Initial policy

Scope:

- path definitions
- exactly one gate
- base rules
- interaction rules
- policy export

Acceptance:

- exactly one gate
- every rule has required metadata
- base and interaction scores follow ranges

---

### PR 5: Decision tests and calibration scenarios

Scope:

- policy integrity tests
- decision tests
- at least 25 calibration scenarios

Acceptance:

- all tests pass
- calibration scenarios pass
- exactly one gate enforced

---

### PR 6: Questionnaire UI

Scope:

- sectioned MUI questionnaire
- React Hook Form
- Zod validation
- submit flow calls `decide()`

Acceptance:

- all 16 inputs render
- validation works
- submit produces a decision result
- no decision logic in UI components

---

### PR 7: Result UI

Scope:

- recommendation display
- confidence display
- runner-up display
- score breakdown
- explanation list

Acceptance:

- result page renders `DecisionResult`
- missing result state handled gracefully
- no manual recomputation in UI

---

### PR 8: Internal calibration UI

Scope:

- `/internal/calibration`
- scenario table
- details drawer/panel

Acceptance:

- expected vs actual shown
- pass/fail shown
- applied rules shown
- scores shown
- read-only only

---

### PR 9: Documentation

Scope:

- root README
- decision docs
- input dictionary
- scoring guide
- rule-authoring guide
- calibration guide
- adding-a-question guide

Acceptance:

- new maintainer can understand architecture and make safe changes

---

### PR 10: Final hardening

Scope:

- cleanup
- accessibility pass
- lint/typecheck/test/build
- remove dead code

Acceptance:

- all validation commands pass
- no business logic in UI
- exactly one gate remains
- no new scope added

---

## 26. Commands to Run

Before completing any PR after setup, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

If one of these scripts does not exist yet, add it in the setup PR.

---

## 27. Definition of Done

The first complete implementation is done when:

- all 16 inputs are captured
- questionnaire uses MUI
- validation uses Zod
- decision engine is pure TypeScript
- recommendation is produced only by `decide()`
- exactly one gate exists
- base rules are weak signals
- interaction rules handle context
- result shows recommendation, confidence, scores, and explanations
- internal calibration page works
- at least 25 calibration scenarios exist
- policy integrity tests pass
- calibration scenario tests pass
- docs explain how to change the system safely
- no React component contains recommendation logic

---

## 28. Things Not to Build Yet

Do not build:

- policy editor
- admin authentication
- backend persistence
- analytics dashboard
- machine learning model
- percentage-based fit score
- additional gates
- alternative recommendation paths
- external rules-engine integration

These can be considered later after the initial model is validated.
