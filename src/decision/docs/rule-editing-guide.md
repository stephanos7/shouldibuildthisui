# Rule Editing Guide

A rule is a scoring instruction with stable metadata, explicit conditions, and explainable effects on one or more recommendation paths.

This guide describes what the shipped local recalibration UI can and cannot edit.

## Editable rule types

The recalibration UI can edit only non-gate scored rules:

- base rules
- interaction rules

Base rules are weak single-signal nudges. Interaction rules carry most of the recommendation intelligence because they model meaningful combinations of facts.

## Non-exhaustive policy model

The recalibration UI is not a full policy editor.

It does not expose every possible policy change. It exists to tune the shipped policy safely within a narrow surface area:

- enable or disable an editable rule
- change that rule's integer scores
- change that rule's `reason`
- save an internal note alongside the local override

Everything else remains source-controlled policy work.

## Enabling and disabling rules

Disabling a rule means the active policy keeps the rule definition but sets its `enabled` flag from the local override.

That is useful when maintainers want to suppress a weak signal temporarily without deleting the base rule from source.

Enabling a rule again removes that temporary suppression.

## Score edits vs reason edits

Score edits change recommendation behavior. They alter how much the rule contributes to each path when its conditions match.

Reason edits do not change matching logic. They change the explanation text surfaced in audits and recommendation output when that rule applies.

Both are stored as local rule-level overrides in the browser, not as permanent source edits.

## Why gates are fixed

Gate rules are direct recommendations. They bypass normal score balancing, so making them locally editable would create a much riskier policy surface.

The shipped policy therefore keeps gates fixed:

- the gate remains part of the base policy
- gate overrides are ignored
- the integrity tests require gates to be uneditable

If recommendation behavior needs to move, prefer score-based policy composition first. Do not turn recalibration into ad hoc gate editing.

## Why conditions are read-only

Conditions remain read-only because recalibration is intended to tune rule strength, not rewrite rule meaning.

The current override model stores only:

- `enabled`
- `scores`
- `reason`
- `internalNote`
- `updatedAt`

It does not store condition edits, and active-policy assembly always preserves the source rule conditions.

That keeps local recalibration explainable:

- the base policy still defines when a rule matches
- local overrides define only how strongly that matching rule behaves
