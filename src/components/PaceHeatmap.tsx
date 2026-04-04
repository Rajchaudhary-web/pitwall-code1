import { useMemo } from 'react';
import type { LapData, Driver } from '@/types/f1';
import { getTeamColor } from '@/lib/f1Utils';

interface PaceHeatmapProps {
  laps: Map<number, LapData[]>;
  drivers: Driver[];
  selectedDrivers: number[];
}

export function PaceHeatmap({ laps, drivers, selectedDrivers }: PaceHeatmapProps) {
  const driverMap = useMemo(() => new Map(drivers.map(d => [d.driver_number, d])), [drivers]);

  const { heatmapLookup, minTime, maxTime, totalLaps } = useMemo(() => {
    const lookup = new Map<string, number | null>();
    let min = Infinity;
    let max = -Infinity;
    let tLaps = 0;

    selectedDrivers.forEach(dn => {
      const driverLaps = laps.get(dn) || [];
      tLaps = Math.max(tLaps, driverLaps.length);
      driverLaps.forEach(l => {
        const t = l.lap_duration && !l.is_pit_out_lap && l.lap_duration < 110 ? l.lap_duration : null;
        if (t) {
          min = Math.min(min, t);
          max = Math.max(max, t);
        }
        lookup.set(`${dn}-${l.lap_number}`, t);
      });
    });

    return { heatmapLookup: lookup, minTime: min, maxTime: max, totalLaps: tLaps };
  }, [laps, selectedDrivers]);

  if (selectedDrivers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">Select drivers to view pace heatmap</p>
      </div>
    );
  }

  const getColor = (time: number | null) => {
    if (!time) return 'hsl(220, 15%, 12%)';
    const ratio = (time - minTime) / (maxTime - minTime || 1);
    if (ratio < 0.3) return 'hsl(270, 70%, 55%)'; // purple = fast
    if (ratio < 0.5) return 'hsl(210, 90%, 55%)'; // blue
    if (ratio < 0.7) return 'hsl(142, 70%, 45%)'; // green
    if (ratio < 0.85) return 'hsl(45, 95%, 55%)'; // yellow
    return 'hsl(0, 85%, 50%)'; // red = slow
  };

  // Show every Nth lap to fit
  const step = Math.max(1, Math.floor(totalLaps / 40));
  const lapNumbers = Array.from({ length: Math.ceil(totalLaps / step) }, (_, i) => i * step + 1);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-display tracking-wider text-foreground">Pace Heatmap</h3>
        <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
          <span>Fast</span>
          <div className="flex h-2">
            {['hsl(270,70%,55%)', 'hsl(210,90%,55%)', 'hsl(142,70%,45%)', 'hsl(45,95%,55%)', 'hsl(0,85%,50%)'].map(c => (
              <div key={c} className="w-3 h-2" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span>Slow</span>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <div className="min-w-[500px]">
          {selectedDrivers.map(dn => {
            const driver = driverMap.get(dn);
            return (
              <div key={dn} className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono text-muted-foreground w-8 text-right">
                  {driver?.name_acronym || dn}
                </span>
                <div className="flex gap-px flex-1">
                  {lapNumbers.map(lap => {
                    const time = heatmapLookup.get(`${dn}-${lap}`) ?? null;
                    return (
                      <div
                        key={lap}
                        className="flex-1 h-5 rounded-sm transition-colors"
                        style={{ backgroundColor: getColor(time), minWidth: '4px' }}
                        title={time ? `Lap ${lap}: ${time.toFixed(3)}s` : `Lap ${lap}: -`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
