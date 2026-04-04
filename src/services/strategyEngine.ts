import type { RaceState, StrategyRecommendation, TyreCompound, LapData } from '@/types/f1';

// Tyre degradation rates (seconds per lap, approximate)
const DEGRADATION_RATES: Record<TyreCompound, number> = {
  SOFT: 0.12,
  MEDIUM: 0.07,
  HARD: 0.04,
  INTERMEDIATE: 0.06,
  WET: 0.05,
};

const TYRE_CLIFF: Record<TyreCompound, number> = {
  SOFT: 18,
  MEDIUM: 28,
  HARD: 40,
  INTERMEDIATE: 30,
  WET: 35,
};

const PIT_STOP_LOSS = 22; // seconds

// Simple linear regression for lap time degradation
export function predictDegradation(laps: LapData[]): { slope: number; intercept: number } {
  const valid = laps.filter(l => l.lap_duration && l.lap_duration > 60 && l.lap_duration < 120 && !l.is_pit_out_lap);
  if (valid.length < 3) return { slope: 0.08, intercept: 85 };

  const n = valid.length;
  const xs = valid.map((_, i) => i + 1);
  const ys = valid.map(l => l.lap_duration!);
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumX2 = xs.reduce((a, x) => a + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope: Math.max(slope, 0.01), intercept };
}

export function generateStrategy(
  raceState: RaceState,
  driverLaps: LapData[] = []
): StrategyRecommendation {
  const { currentLap, totalLaps, currentCompound, tyreAge, weather } = raceState;
  const lapsRemaining = totalLaps - currentLap;
  const rainProbability = weather.rainfall ? 0.9 : weather.humidity > 70 ? 0.4 : 0.1;

  // ML prediction
  const { slope: degradationRate } = predictDegradation(driverLaps);

  // Rule-based logic
  const tyreCliff = TYRE_CLIFF[currentCompound];
  const lapsToCliff = Math.max(0, tyreCliff - tyreAge);
  const baseDeg = DEGRADATION_RATES[currentCompound];

  // Rain switch
  if (rainProbability > 0.6 && currentCompound !== 'INTERMEDIATE' && currentCompound !== 'WET') {
    return {
      recommendedPitLap: currentLap + 1,
      currentLap,
      totalLaps,
      tyreChoice: rainProbability > 0.8 ? 'WET' : 'INTERMEDIATE',
      confidence: 0.85,
      explanation: `Rain probability at ${(rainProbability * 100).toFixed(0)}%. Immediate switch to ${rainProbability > 0.8 ? 'wets' : 'intermediates'} recommended.`,
      degradationRate,
      estimatedTimeGain: 15,
      strategy: 'wet-switch',
      alternativeStrategies: [],
    };
  }

  // Check rival pit strategies for undercut/overcut
  const rivalsNearby = raceState.rivalPositions.filter(
    r => Math.abs(r.position - raceState.position) <= 2
  );
  const rivalPitting = rivalsNearby.some(r => r.compound !== currentCompound);

  let strategy: 'undercut' | 'overcut' | 'standard' = 'standard';
  let pitLapAdjust = 0;

  if (rivalPitting && lapsToCliff > 3) {
    strategy = 'undercut';
    pitLapAdjust = -2;
  } else if (rivalPitting && lapsToCliff <= 3) {
    strategy = 'overcut';
    pitLapAdjust = 2;
  }

  // Optimal pit window
  const optimalPitLap = Math.min(
    currentLap + lapsToCliff + pitLapAdjust,
    totalLaps - 5
  );

  // Choose next compound
  let nextCompound: TyreCompound;
  if (lapsRemaining > 30) {
    nextCompound = 'HARD';
  } else if (lapsRemaining > 18) {
    nextCompound = 'MEDIUM';
  } else {
    nextCompound = currentCompound === 'SOFT' ? 'MEDIUM' : 'SOFT';
  }

  const timeGain = (tyreAge * baseDeg * 1.5) - PIT_STOP_LOSS / lapsRemaining;
  const confidence = Math.min(0.95, 0.5 + (driverLaps.length / 50) + (tyreAge > tyreCliff * 0.7 ? 0.2 : 0));

  const alternatives = [
    {
      name: 'Aggressive',
      pitLap: Math.max(currentLap + 1, optimalPitLap - 3),
      tyre: 'SOFT' as TyreCompound,
      estimatedDelta: -0.8,
    },
    {
      name: 'Conservative',
      pitLap: Math.min(totalLaps - 3, optimalPitLap + 4),
      tyre: 'HARD' as TyreCompound,
      estimatedDelta: 0.3,
    },
  ];

  const explanations: string[] = [];
  explanations.push(`Tyre age: ${tyreAge} laps. Cliff at ~${tyreCliff} laps.`);
  explanations.push(`Degradation: +${(degradationRate).toFixed(3)}s/lap.`);
  if (strategy === 'undercut') explanations.push('Rival threat detected — undercut recommended.');
  if (strategy === 'overcut') explanations.push('Extending stint to overcut rival.');
  explanations.push(`Switch to ${nextCompound} for optimal remaining race pace.`);

  return {
    recommendedPitLap: Math.max(currentLap + 1, optimalPitLap),
    currentLap,
    totalLaps,
    tyreChoice: nextCompound,
    confidence,
    explanation: explanations.join(' '),
    degradationRate,
    estimatedTimeGain: Math.max(0, timeGain),
    strategy,
    alternativeStrategies: alternatives,
  };
}
