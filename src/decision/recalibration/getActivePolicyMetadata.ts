import { recommendationPolicy } from '../policy/recommendationPolicy';
import type { RecalibrationOverrides } from '../types/Recalibration';
import { loadRecalibrationOverrides } from '../../shared/storage/recalibrationStorage';

export type ActivePolicyMetadata = {
  policyVersion: string;
  recalibrationUpdatedAt: string | null;
  hasLocalOverrides: boolean;
};

export function getActivePolicyMetadata(
  overrides: RecalibrationOverrides | null = loadRecalibrationOverrides()
): ActivePolicyMetadata {
  const hasCompatibleOverrides =
    overrides?.version === 1 && overrides.policyVersion === recommendationPolicy.version;

  return {
    policyVersion: recommendationPolicy.version,
    recalibrationUpdatedAt: hasCompatibleOverrides ? overrides.updatedAt : null,
    hasLocalOverrides: Boolean(hasCompatibleOverrides)
  };
}

export function activePolicyMetadataMatches(
  left: ActivePolicyMetadata,
  right: ActivePolicyMetadata
): boolean {
  return (
    left.policyVersion === right.policyVersion &&
    left.recalibrationUpdatedAt === right.recalibrationUpdatedAt &&
    left.hasLocalOverrides === right.hasLocalOverrides
  );
}
