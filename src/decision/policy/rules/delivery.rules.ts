import type { ScoredRule } from "../../types/Policy";

export const deliveryInteractionRules = [
  {
    id: "delivery-enterprise-support-high-risk-app",
    label: "Enterprise support in a high-risk app",
    intent:
      "Escalate enterprise recommendations for top-tier support needs only when the application itself is high-risk.",
    reason:
      "Enterprise support needs in revenue-critical or operationally critical applications justify enterprise packaging even without broad rollout.",
    enabled: true,
    editable: true,
    conditions: [
      {
        field: "supportExpectation",
        operator: "equals",
        value: "enterprise_support"
      },
      {
        field: "applicationCriticality",
        operator: "in",
        value: ["revenue_critical", "regulated_or_critical"]
      }
    ],
    scores: {
      mui_x_enterprise: 4
    }
  }
] satisfies ScoredRule[];
