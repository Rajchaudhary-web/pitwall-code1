import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useRaceData } from '@/hooks/useRaceData';
import { generateStrategy } from '@/services/strategyEngine';
import { DriverSelector } from '@/components/DriverSelector';
import { StrategyPanel } from '@/components/StrategyPanel';
import { LapTimeChart } from '@/components/LapTimeChart';
import { PositionGraph } from '@/components/PositionGraph';
import { WeatherOverlay } from '@/components/WeatherOverlay';
import { RivalComparisonPanel } from '@/components/RivalComparisonPanel';
import { PaceHeatmap } from '@/components/PaceHeatmap';
import { StrategyTimeline } from '@/components/StrategyTimeline';
import type { StrategyRecommendation } from '@/types/f1';
import { RefreshCw, Radio, Database } from 'lucide-react';

export default function Dashboard() {
  const { drivers, laps, positions, stints, weather, loading, currentLap, totalLaps, refreshData, isLive, session } = useRaceData();
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [rivalDriver, setRivalDriver] = useState<number | null>(null);
  const [strategy, setStrategy] = useState<StrategyRecommendation | null>(null);

  const selectedDrivers = useMemo(() => {
    const s: number[] = [];
    if (selectedDriver) s.push(selectedDriver);
    if (rivalDriver && rivalDriver !== selectedDriver) s.push(rivalDriver);
    return s;
  }, [selectedDriver, rivalDriver]);

  const handleDriverSelect = useCallback((dn: number) => {
    setSelectedDriver(dn);
    // Auto-generate strategy
    const driverLaps = laps.get(dn) || [];
    const driverStints = stints.get(dn) || [];
    const lastStint = driverStints[driverStints.length - 1];

    const raceState = {
      currentLap,
      totalLaps,
      driverNumber: dn,
      currentCompound: lastStint?.compound || 'MEDIUM',
      tyreAge: lastStint ? currentLap - lastStint.lap_start : 10,
      position: 1,
      weather,
      rivalPositions: drivers
        .filter(d => d.driver_number !== dn)
        .slice(0, 5)
        .map((d, i) => ({
          driverNumber: d.driver_number,
          position: i + 2,
          compound: (stints.get(d.driver_number) || []).slice(-1)[0]?.compound || 'MEDIUM',
        })),
    };

    setStrategy(generateStrategy(raceState, driverLaps));

    // Auto-select rival
    if (!rivalDriver || rivalDriver === dn) {
      const nextDriver = drivers.find(d => d.driver_number !== dn);
      if (nextDriver) setRivalDriver(nextDriver.driver_number);
    }
  }, [laps, stints, currentLap, totalLaps, weather, drivers, rivalDriver]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="font-display text-xs tracking-widest text-foreground">PITWALL AI</span>
            </Link>
            {session && (
              <span className="text-[10px] font-mono text-muted-foreground hidden sm:block">
                {session.circuit_short_name} · {session.country_name} · {session.year}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-[10px] font-mono ${isLive ? 'text-pitwall-green' : 'text-muted-foreground'}`}>
              {isLive ? <Radio className="w-3 h-3" /> : <Database className="w-3 h-3" />}
              {isLive ? 'LIVE DATA' : 'SAMPLE DATA'}
            </span>
            <button
              onClick={refreshData}
              className="p-1.5 rounded border border-border hover:border-primary/50 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        {/* Driver selector */}
        <DriverSelector drivers={drivers} selectedDriver={selectedDriver} onSelect={handleDriverSelect} />

        {/* Rival selector */}
        {selectedDriver && (
          <DriverSelector
            drivers={drivers.filter(d => d.driver_number !== selectedDriver)}
            selectedDriver={rivalDriver}
            onSelect={setRivalDriver}
            label="Select Rival"
          />
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left column - Strategy + Weather */}
          <div className="space-y-4">
            <StrategyPanel strategy={strategy} loading={loading} />
            <WeatherOverlay weather={weather} />
          </div>

          {/* Center - Charts */}
          <div className="lg:col-span-2 space-y-4">
            <LapTimeChart laps={laps} drivers={drivers} selectedDrivers={selectedDrivers} />
            <PositionGraph positions={positions} drivers={drivers} selectedDrivers={selectedDrivers} />
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid lg:grid-cols-2 gap-4">
          {selectedDriver && rivalDriver && (
            <RivalComparisonPanel
              driverNumber={selectedDriver}
              rivalNumber={rivalDriver}
              drivers={drivers}
              laps={laps}
              stints={stints}
            />
          )}
          <StrategyTimeline
            stints={stints}
            drivers={drivers}
            selectedDrivers={selectedDrivers.length > 0 ? selectedDrivers : drivers.slice(0, 5).map(d => d.driver_number)}
            totalLaps={totalLaps}
          />
        </div>

        <PaceHeatmap laps={laps} drivers={drivers} selectedDrivers={selectedDrivers.length > 0 ? selectedDrivers : drivers.slice(0, 5).map(d => d.driver_number)} />
      </div>
    </div>
  );
}
