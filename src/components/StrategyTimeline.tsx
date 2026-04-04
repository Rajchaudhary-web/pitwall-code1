import type { StintData, Driver } from '@/types/f1';
import { getTyreColor, getTeamColor } from '@/lib/f1Utils';
import { useMemo } from 'react';

interface StrategyTimelineProps {
  stints: Map<number, StintData[]>;
  drivers: Driver[];
  selectedDrivers: number[];
  totalLaps: number;
}

export function StrategyTimeline({ stints, drivers, selectedDrivers, totalLaps }: StrategyTimelineProps) {
  const driverMap = useMemo(() => new Map(drivers.map(d => [d.driver_number, d])), [drivers]);

  if (selectedDrivers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 flex items-center justify-center h-32">
        <p className="text-sm text-muted-foreground">Select drivers to view strategy</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-display tracking-wider text-foreground">Strategy Timeline</h3>
      </div>
      <div className="p-4 space-y-2">
        {/* Lap markers */}
        <div className="flex items-center gap-1.5 ml-12">
          <div className="flex-1 flex justify-between text-[8px] font-mono text-muted-foreground">
            {[1, Math.round(totalLaps * 0.25), Math.round(totalLaps * 0.5), Math.round(totalLaps * 0.75), totalLaps].map(l => (
              <span key={l}>L{l}</span>
            ))}
          </div>
        </div>
        {selectedDrivers.map(dn => {
          const driver = driverMap.get(dn);
          const driverStints = stints.get(dn) || [];
          return (
            <div key={dn} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-10">
                <div className="w-0.5 h-4 rounded-full" style={{ backgroundColor: driver ? getTeamColor(driver.team_colour) : '#888' }} />
                <span className="text-[9px] font-mono font-semibold text-foreground">{driver?.name_acronym || dn}</span>
              </div>
              <div className="flex-1 flex h-6 rounded overflow-hidden bg-secondary/30">
                {driverStints.map(s => {
                  const width = ((s.lap_end - s.lap_start + 1) / totalLaps) * 100;
                  return (
                    <div
                      key={s.stint_number}
                      className="h-full flex items-center justify-center text-[9px] font-mono font-bold border-r border-background/30 last:border-0 transition-all"
                      style={{
                        width: `${width}%`,
                        backgroundColor: getTyreColor(s.compound),
                        color: s.compound === 'HARD' ? '#111' : '#fff',
                      }}
                    >
                      {width > 6 ? `${s.compound.charAt(0)} ${s.lap_end - s.lap_start + 1}L` : s.compound.charAt(0)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
