import type { ScoredRule } from '../../types/Policy';

export const deliveryInteractionRules = [
  {
    id: 'delivery-enterprise-support-customer-rollout',
    label: 'Enterprise support with customer-facing rollout',
    intent: 'Identify delivery contexts where enterprise support matters during broader user exposure.',
    reason: 'Customer-facing rollout combined with enterprise support expectations increases the value of enterprise packaging.',
    enabled: true,
    editable: true,
    conditions: [
      {
        field: 'supportExpectation',
        operator: 'equals',
        value: 'enterprise_support'
      },
      {
        field: 'applicationCriticality',
        operator: 'in',
        value: ['customer_facing', 'revenue_critical', 'regulated_or_operationally_critical']
      }
    ],
    scores: {
      mui_x_enterprise: 4
    }
  }
] satisfies ScoredRule[];
