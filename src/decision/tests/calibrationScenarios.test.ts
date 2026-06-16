import { describe, expect, it } from 'vitest';
import { decide } from '../engine/decide';
import { recommendationPolicy } from '../policy/recommendationPolicy';
import { calibrationScenarios } from './calibrationScenarios';

describe('calibration scenarios', () => {
  it('covers at least 25 representative scenarios', () => {
    expect(calibrationScenarios.length).toBeGreaterThanOrEqual(25);
  });

  it.each(calibrationScenarios)('$id -> $expectedRecommendation', (scenario) => {
    const result = decide(scenario.input, recommendationPolicy);

    expect(result.recommendation).toBe(scenario.expectedRecommendation);
  });
});
