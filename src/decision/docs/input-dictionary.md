# Input Dictionary

This document explains every `DecisionFacts` field used by the decision engine. Each field maps to a user-facing questionnaire question, a closed set of allowed values, and one or more policy signals.

## Team and scale

### `frontendDeveloperCount`

- User-facing meaning: size of the frontend developer population working on the React UI estate.
- Allowed values: `1_9`, `10_19`, `20_49`, `50_plus`
- Why it matters: broader frontend ownership usually increases governance and reuse pressure, especially when it overlaps with many teams and many apps.
- Main affected paths: `build_it_yourself` for narrow local scope and `mui_x_premium` / `mui_x_enterprise` when combined with broader rollout signals.
- Common interactions: contributes to narrow-scope guardrails and large-organization scenarios, especially alongside `teamCount` and `reactAppCount`.

### `teamCount`

- User-facing meaning: number of teams that regularly ship or maintain UI work.
- Allowed values: `1`, `2_3`, `4_7`, `8_plus`
- Why it matters: team count is a core indicator of coordination cost and standardization pressure.
- Main affected paths: `build_it_yourself` for single-team scope, `mui_core` for moderate scale, `mui_x_premium` and `mui_x_enterprise` for broader rollout.
- Common interactions: used by the gate, `scale-moderate-team-narrow-scope`, `scale-multi-team-multi-app`, and the advanced-grid interaction.

### `reactAppCount`

- User-facing meaning: number of React applications expected to share the chosen approach.
- Allowed values: `1`, `2_4`, `5_10`, `11_plus`
- Why it matters: multiple apps increase the value of reusable components, consistency, and support.
- Main affected paths: `build_it_yourself` when scope is tiny, `mui_core` for moderate reuse, `mui_x_premium` and `mui_x_enterprise` for larger shared estates.
- Common interactions: used by the gate and both scale interactions, especially when paired with `teamCount`.

## Design system and workflow

### `designSystemMaturity`

- User-facing meaning: how mature the current design system is today.
- Allowed values: `none`, `early`, `established`, `centralized`
- Why it matters: existing design-system maturity affects whether the org needs a local component set or a governed platform.
- Main affected paths: `mui_core`, `mui_x_premium`, and especially `mui_x_enterprise` when maturity is centralized.
- Common interactions: `design-system-centralized-org-wide-standardization` pairs `centralized` with `org_wide_platform`.

### `designEngineeringFriction`

- User-facing meaning: amount of friction between design and engineering during handoff and iteration.
- Allowed values: `low`, `medium`, `high`, `severe`
- Why it matters: this field captures workflow pain that may justify more standardization later.
- Main affected paths: `mui_core`, `mui_x_premium`, and `mui_x_enterprise` when friction reinforces standardization goals.
- Common interactions: used by cross-app standardization and org-wide platform interactions to strengthen shared-platform recommendations when workflow friction is high.

### `standardizationIntent`

- User-facing meaning: the target level of UI consistency the organization wants.
- Allowed values: `none`, `local_consistency`, `cross_app_consistency`, `org_wide_platform`
- Why it matters: this is one of the strongest direction-setting inputs because it distinguishes local optimization from platform investment.
- Main affected paths: `mui_core` for local or cross-app consistency, `mui_x_premium` and `mui_x_enterprise` for org-wide platform intent.
- Common interactions: used by `scale-moderate-team-narrow-scope` and `design-system-centralized-org-wide-standardization`.

## Maintainability risk

### `uiKnowledgeDistribution`

- User-facing meaning: how widely critical UI implementation knowledge is distributed.
- Allowed values: `distributed`, `some_specialists`, `few_specialists`, `single_point`
- Why it matters: concentrated knowledge increases maintainability risk and raises the value of standardization.
- Main affected paths: `mui_core` and `mui_x_premium`.
- Common interactions: `maintainability-knowledge-concentration-long-horizon` amplifies this when the product is long-lived.

### `changeLeadTime`

- User-facing meaning: how long non-trivial UI changes normally take from request to release.
- Allowed values: `same_day`, `days`, `weeks`, `months`
- Why it matters: long UI lead time is a signal that delivery is already costly or fragile.
- Main affected paths: mainly `mui_x_premium` and `mui_x_enterprise` when maintainability problems are already present.
- Common interactions: `maintainability-frequent-regressions-long-lead-time` combines slow change with regressions.

### `uiRegressionFrequency`

- User-facing meaning: how often visual, interaction, or accessibility regressions appear during delivery.
- Allowed values: `rare`, `occasional`, `frequent`, `constant`
- Why it matters: regressions are a direct signal that the current UI delivery model is unstable.
- Main affected paths: `mui_core` under deadline pressure, `mui_x_premium` and `mui_x_enterprise` when instability is sustained.
- Common interactions: pairs with `changeLeadTime` and `deliveryUrgency`.

### `ownershipHorizon`

- User-facing meaning: expected lifecycle of the UI investment.
- Allowed values: `prototype`, `short_term`, `long_term`, `platform_investment`
- Why it matters: horizon changes whether the app should optimize for immediate delivery or long-term maintainability.
- Main affected paths: `build_it_yourself` for short-lived work, `mui_core` and `mui_x_premium` for long-lived maintainability needs.
- Common interactions: used by the gate and `maintainability-knowledge-concentration-long-horizon`.

## Advanced UI needs

### `dataGridComplexity`

- User-facing meaning: hardest table, grid, or spreadsheet-like workflow in scope.
- Allowed values: `none`, `simple_tables`, `advanced_grids`, `mission_critical_grids`
- Why it matters: grid complexity is one of the strongest product-capability signals in the policy.
- Main affected paths: `build_it_yourself` for simple scope, `mui_x_premium` for advanced grids, `mui_x_enterprise` for mission-critical grid workflows with stronger support expectations.
- Common interactions: used by the gate, `advanced-ui-small-team-advanced-grids`, and `advanced-ui-mission-critical-grid-enterprise-support`.

### `performanceCriticality`

- User-facing meaning: how performance-sensitive the UI interactions are under real workload.
- Allowed values: `low`, `medium`, `high`, `critical`
- Why it matters: performance criticality is a meaningful product signal when advanced data-heavy experiences must also meet higher responsiveness expectations.
- Main affected paths: `mui_x_premium` for advanced grids and `mui_x_enterprise` for mission-critical grid workflows with stricter performance demands.
- Common interactions: used by advanced-grid and mission-critical-grid interactions to add context rather than act as a standalone enterprise signal.

## Quality, support, and delivery

### `accessibilityCriticality`

- User-facing meaning: strength of accessibility expectations, including regulated compliance.
- Allowed values: `low`, `medium`, `high`, `regulated_or_mandatory`
- Why it matters: higher accessibility burden increases the value of mature reusable UI infrastructure.
- Main affected paths: `build_it_yourself` is favored only when accessibility pressure stays low, while `mui_x_enterprise` gains strength under regulated conditions.
- Common interactions: used by the gate and `quality-risk-regulated-operationally-critical-app`.

### `applicationCriticality`

- User-facing meaning: business or operational impact if the application performs poorly or becomes hard to maintain.
- Allowed values: `internal_tool`, `customer_facing`, `revenue_critical`, `regulated_or_critical`
- Why it matters: application criticality is a direct proxy for delivery risk and support expectations.
- Main affected paths: `build_it_yourself` for narrow internal prototypes, `mui_x_premium` and especially `mui_x_enterprise` for higher-risk applications.
- Common interactions: used by the gate, `quality-risk-regulated-operationally-critical-app`, and `delivery-enterprise-support-customer-rollout`.

### `supportExpectation`

- User-facing meaning: level of vendor support the organization expects to rely on.
- Allowed values: `self_serve`, `standard_support`, `priority_support`, `enterprise_support`
- Why it matters: support demand is one of the clearest differentiators between lighter and heavier recommendation paths.
- Main affected paths: `build_it_yourself` for self-serve cases, `mui_x_premium` for priority support, `mui_x_enterprise` for enterprise support.
- Common interactions: used by the gate, `scale-enterprise-support-broad-rollout`, `advanced-ui-mission-critical-grid-enterprise-support`, and `delivery-enterprise-support-customer-rollout`.

### `deliveryUrgency`

- User-facing meaning: current delivery pressure and schedule commitment.
- Allowed values: `low`, `medium`, `high`, `fixed_deadline`
- Why it matters: deadline pressure increases the value of lower implementation risk and proven building blocks.
- Main affected paths: `mui_core` and `mui_x_premium`.
- Common interactions: used by `quality-risk-fixed-deadline-regression-risk` and also has a standalone base-rule signal for fixed deadlines.

## Summary notes

- All fields are validated in `src/features/questionnaire/questionnaireSchema.ts`.
- All fields are represented in `src/features/questionnaire/questions.ts`.
- Every required field currently participates in at least one policy rule condition.
