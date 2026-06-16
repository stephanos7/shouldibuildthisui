# shouldibuildthisui

`shouldibuildthisui` is a Vite + React + TypeScript application that asks 16 questionnaire inputs and recommends one of four paths:

- `build_it_yourself`
- `mui_core`
- `mui_x_premium`
- `mui_x_enterprise`

The product goal is explainable recommendation behavior. The app does not use percentages, probabilities, or opaque formulas. It uses explicit decision facts, integer scores, and rule metadata that can be reviewed by maintainers.

## What the app does

1. Collects questionnaire answers in the UI.
2. Validates them with Zod.
3. Normalizes them into `DecisionFacts`.
4. Evaluates one gate, then base rules, then interaction rules.
5. Ranks the four paths.
6. Calculates confidence from the top-two score margin.
7. Builds a human-readable explanation and runner-up summary.

## Technology stack

- Vite
- React
- TypeScript
- MUI
- React Router
- React Hook Form
- Zod
- Vitest
- Testing Library

## Run locally

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

## Test and validate

```bash
npm run test
npm run lint
npm run typecheck
```

## High-level architecture

```txt
Questionnaire UI
  -> React Hook Form
  -> Zod schema
  -> normalizeQuestionnaireValues()
  -> DecisionFacts
  -> decide()
  -> gate evaluation
  -> base rules
  -> interaction rules
  -> score aggregation
  -> ranked paths
  -> confidence
  -> explanation
  -> result UI
```

Recommendation logic belongs only in `src/decision`.

UI components must not:

- calculate scores
- evaluate rule conditions
- choose recommendation paths
- duplicate recommendation heuristics

UI components may:

- render questions
- collect answers
- validate inputs
- call `decide()`
- render a `DecisionResult`

## Where code lives

- UI routes and layouts: `src/routes`, `src/layouts`, `src/app`
- Questionnaire UI: `src/features/questionnaire`
- Result UI: `src/features/result`
- Calibration UI: `src/features/calibration`
- Decision engine: `src/decision/engine`
- Decision types: `src/decision/types`
- Policy definitions and rules: `src/decision/policy`
- Calibration scenarios and policy tests: `src/decision/tests`
- Decision documentation: `src/decision/docs`

## Where policy lives

The assembled policy lives in `src/decision/policy/recommendationPolicy.ts`.

That module combines:

- `gate.rules.ts`
- `base.rules.ts`
- `scale.rules.ts`
- `design-system.rules.ts`
- `maintainability.rules.ts`
- `advanced-ui.rules.ts`
- `quality-risk.rules.ts`
- `delivery.rules.ts`

The current policy intentionally ships exactly one gate in `src/decision/policy/rules/gate.rules.ts`. It exists only to short-circuit a narrow internal prototype case. Everything else is decided through scoring.

## Recalibration overview

The app also ships an internal recalibration UI at `/internal/recalibration`.

It does not replace the base policy. The active policy is the shipped base policy plus any compatible local browser overrides for editable non-gate rules. Those overrides are stored only in local `localStorage`, are not shared with other users, and do not allow editing gates or rule conditions.

## Further reading

- Decision overview: `src/decision/README.md`
- Input reference: `src/decision/docs/input-dictionary.md`
- Scoring model: `src/decision/docs/scoring-model.md`
- Rule authoring: `src/decision/docs/rule-authoring-guide.md`
- Calibration workflow: `src/decision/docs/calibration-guide.md`
- Recalibration workflow: `src/decision/docs/recalibration-guide.md`
- Rule editing in recalibration: `src/decision/docs/rule-editing-guide.md`
- Adding a question: `src/decision/docs/adding-a-question.md`
