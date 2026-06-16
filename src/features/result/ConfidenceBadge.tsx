import { Chip } from '@mui/material';
import type { Confidence } from '../../decision/types/DecisionResult';
import { formatConfidenceLabel } from './resultContent';

const colorByConfidence: Record<Confidence, 'default' | 'warning' | 'success'> = {
  low: 'warning',
  medium: 'default',
  high: 'success'
};

type ConfidenceBadgeProps = {
  confidence: Confidence;
};

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  return (
    <Chip
      label={`${formatConfidenceLabel(confidence)} confidence`}
      color={colorByConfidence[confidence]}
      variant={confidence === 'medium' ? 'outlined' : 'filled'}
      size="small"
    />
  );
}
