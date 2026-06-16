# Adding a Question

Adding a questionnaire field is a cross-cutting change. The UI, schema, normalized facts, policy docs, and calibration fixtures must all stay aligned.

This checklist is the safe path.

## 1. Update `DecisionFacts`

Add the field and allowed values in `src/decision/types/DecisionFacts.ts`.

This is the source of truth for recommendation inputs. Use descriptive normalized values, not presentation labels like `a`, `b`, `c`, `d`.

## 2. Update the Zod schema

Add the field to `src/features/questionnaire/questionnaireSchema.ts`.

If the schema does not include it, the UI can collect a value that the decision engine cannot trust.

## 3. Update question definitions

Add the questionnaire definition in `src/features/questionnaire/questions.ts`.

Include:

- stable `id`
- section
- label
- helper text
- component type
- options

The question `id` must match the `DecisionFacts` field name.

## 4. Update normalization

Review `src/decision/engine/normalizeQuestionnaireValues.ts`.

Today the normalizer is identity-only, but new questions may require translation from UI-facing values into a stable policy shape. Keep that translation here, not in React components and not scattered across rules.

## 5. Update the input dictionary

Document the new field in `src/decision/docs/input-dictionary.md`.

Include:

- user-facing meaning
- allowed values
- why it matters
- main affected paths
- common interactions

## 6. Decide whether policy changes are needed

Not every new question requires rules immediately.

If the question should affect recommendation behavior:

- add or update base rules if it is a weak standalone signal
- add or update interaction rules if the value matters mainly in combination with other fields

Do not add UI heuristics as a shortcut.

## 7. Update calibration scenarios

Add scenarios or extend existing ones in `src/decision/tests/calibrationScenarios.ts` so the new input is exercised in representative contexts.

Questions that influence behavior should have scenario coverage for:

- the main intended path pressure
- an edge case or nearby path
- at least one close-call or interaction-heavy case if relevant

## 8. Update tests

Review tests that depend on the questionnaire contract:

- `src/features/questionnaire/__tests__`
- `src/decision/engine/__tests__`
- `src/decision/tests`

For a new required field, expect schema tests, questionnaire tests, and calibration scenarios to need updates.

## 9. Re-run validation

```bash
npm run test
npm run lint
npm run typecheck
```

## 10. Final review

Before merging, confirm:

- the UI renders the question
- the schema validates it
- `DecisionFacts` includes it
- normalization handles it correctly
- policy changes, if any, live only in `src/decision`
- the input dictionary documents it
- calibration scenarios still make sense
- no business logic was added to React components
