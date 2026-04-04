import { useMemo } from 'react';
import type { LapData, Driver, StintData } from '@/types/f1';
import { getTeamColor, formatLapTime, formatDelta } from '@/lib/f1Utils';
import { getTyreColor } from '@/lib/f1Utils';

interface RivalComparisonPanelProps {
  driverNumber: number;
  rivalNumber: number;
  drivers: Driver[];
  laps: Map<number, LapData[]>;
  stints: Map<number, StintData[]>;
}

export function RivalComparisonPanel({ driverNumber, rivalNumber, drivers, laps, stints }: RivalComparisonPanelProps) {
  const driverMap = useMemo(() => new Map(drivers.map(d => [d.driver_number, d])), [drivers]);
  const driver = driverMap.get(driverNumber);
  const rival = driverMap.get(rivalNumber);

  const comparison = useMemo(() => {
    const dLaps = laps.get(driverNumber) || [];
    const rLaps = laps.get(rivalNumber) || [];
    const dStints = stints.get(driverNumber) || [];
    const rStints = stints.get(rivalNumber) || [];

    const deltas: { lap: number; delta: number }[] = [];
    let cumDelta = 0;
    const maxLap = Math.max(dLaps.length, rLaps.length);

    for (let i = 0; i < maxLap; i++) {
      const dLap = dLaps[i];
      const rLap = rLaps[i];
      if (dLap?.lap_duration && rLap?.lap_duration && !dLap.is_pit_out_lap && !rLap.is_pit_out_lap) {
        cumDelta += dLap.lap_duration - rLap.lap_duration;
      }
      deltas.push({ lap: i + 1, delta: cumDelta });
    }

    // Best laps
    const validD = dLaps.filter(l => l.lap_duration && !l.is_pit_out_lap && l.lap_duration < 110);
    const validR = rLaps.filter(l => l.lap_duration && !l.is_pit_out_lap && l.lap_duration < 110);
    const bestD = validD.length > 0 ? Math.min(...validD.map(l => l.lap_duration!)) : null;
    const bestR = validR.length > 0 ? Math.min(...validR.map(l => l.lap_duration!)) : null;
    const avgD = validD.length > 0 ? validD.reduce((s, l) => s + l.lap_duration!, 0) / validD.length : null;
    const avgR = validR.length > 0 ? validR.reduce((s, l) => s + l.lap_duration!, 0) / validR.length : null;

    return { deltas, bestD, bestR, avgD, avgR, dStints, rStints, lastDelta: cumDelta };
  }, [driverNumber, rivalNumber, laps, stints]);

  if (!driver || !rival) return null;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-display tracking-wider text-foreground">Rival Comparison</h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <DriverBadge driver={driver} />
          <div className="text-center">
            <div className={`text-lg font-mono font-bold ${comparison.lastDelta <= 0 ? 'text-pitwall-green' : 'text-pitwall-red'}`}>
              {formatDelta(comparison.lastDelta)}
            </div>
            <div className="text-[9px] uppercase text-muted-foreground">Gap</div>
          </div>
          <DriverBadge driver={rival} />
        </div>

        {/* Stats comparison */}
        <div className="grid grid-cols-3 gap-px bg-border rounded overflow-hidden text-center">
          <CompareCell label="Best Lap" v1={formatLapTime(comparison.bestD)} v2={formatLapTime(comparison.bestR)} better={comparison.bestD && comparison.bestR ? (comparison.bestD < comparison.bestR ? 1 : 2) : 0} />
          <CompareCell label="Avg Pace" v1={formatLapTime(comparison.avgD)} v2={formatLapTime(comparison.avgR)} better={comparison.avgD && comparison.avgR ? (comparison.avgD < comparison.avgR ? 1 : 2) : 0} />
          <CompareCell label="Pit Stops" v1={`${comparison.dStints.length - 1}`} v2={`${comparison.rStints.length - 1}`} better={0} />
        </div>

        {/* Stint timelines */}
        <div className="space-y-1.5">
          <StintTimeline stints={comparison.dStints} acronym={driver.name_acronym} />
          <StintTimeline stints={comparison.rStints} acronym={rival.name_acronym} />
        </div>
      </div>
    </div>
  );
}

function DriverBadge({ driver }: { driver: Driver }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: getTeamColor(driver.team_colour) }} />
      <div>
        <div className="text-xs font-mono font-bold text-foreground">{driver.name_acronym}</div>
        <div className="text-[9px] text-muted-foreground">{driver.team_name}</div>
      </div>
    </div>
  );
}

function CompareCell({ label, v1, v2, better }: { label: string; v1: string; v2: string; better: number }) {
  return (
    <div className="bg-card p-2">
      <div className="text-[9px] text-muted-foreground uppercase mb-1">{label}</div>
      <div className="flex justify-between px-1">
        <span className={`text-[11px] font-mono ${better === 1 ? 'text-pitwall-green' : 'text-foreground'}`}>{v1}</span>
        <span className={`text-[11px] font-mono ${better === 2 ? 'text-pitwall-green' : 'text-foreground'}`}>{v2}</span>
      </div>
    </div>
  );
}

function StintTimeline({ stints, acronym }: { stints: StintData[]; acronym: string }) {
  if (stints.length === 0) return null;
  const totalLaps = stints[stints.length - 1]?.lap_end || 57;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-mono text-muted-foreground w-8">{acronym}</span>
      <div className="flex-1 flex h-4 rounded overflow-hidden">
        {stints.map(s => {
          const width = ((s.lap_end - s.lap_start + 1) / totalLaps) * 100;
          return (
            <div
              key={s.stint_number}
              className="h-full flex items-center justify-center text-[8px] font-mono font-bold"
              style={{
                width: `${width}%`,
                backgroundColor: getTyreColor(s.compound),
                color: s.compound === 'HARD' ? '#111' : '#fff',
              }}
            >
              {width > 8 ? s.compound[0] : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
