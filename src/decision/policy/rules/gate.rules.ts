import type { GatePolicy } from '../../types/Policy';

export const gateRules = [
  {
    id: 'gate-prototype-simple-internal-tool',
    label: 'Prototype internal tool shortcut',
    intent: 'Short-circuit a very narrow internal use case that does not justify platform investment.',
    reason:
      'A single-team internal prototype with simple scope and self-serve expectations is usually best built directly.',
    editable: false,
    recommendation: 'build_it_yourself',
    conditions: [
      { field: 'ownershipHorizon', operator: 'in', value: ['prototype', 'short_term'] },
      { field: 'applicationCriticality', operator: 'equals', value: 'internal_tool' },
      { field: 'teamCount', operator: 'equals', value: '1' },
      { field: 'reactAppCount', operator: 'equals', value: '1' },
      { field: 'dataGridComplexity', operator: 'in', value: ['none', 'simple_tables'] },
      { field: 'accessibilityCriticality', operator: 'in', value: ['low', 'medium'] },
      { field: 'supportExpectation', operator: 'equals', value: 'self_serve' }
    ]
  }
] satisfies GatePolicy[];
