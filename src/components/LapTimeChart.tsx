import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { LapData, Driver } from '@/types/f1';
import { getTeamColor, formatLapTime } from '@/lib/f1Utils';

interface LapTimeChartProps {
  laps: Map<number, LapData[]>;
  drivers: Driver[];
  selectedDrivers: number[];
}

export function LapTimeChart({ laps, drivers, selectedDrivers }: LapTimeChartProps) {
  const chartData = useMemo(() => {
    const maxLap = Math.max(
      ...Array.from(laps.values()).flatMap(ls => ls.map(l => l.lap_number)),
      1
    );
    const data: Record<string, number | null>[] = [];
    for (let lap = 1; lap <= maxLap; lap++) {
      const entry: Record<string, number | null> = { lap };
      selectedDrivers.forEach(dn => {
        const driverLaps = laps.get(dn);
        const lapData = driverLaps?.find(l => l.lap_number === lap);
        entry[`d${dn}`] = lapData?.lap_duration && !lapData.is_pit_out_lap && lapData.lap_duration < 110
          ? parseFloat(lapData.lap_duration.toFixed(3))
          : null;
      });
      data.push(entry);
    }
    return data;
  }, [laps, selectedDrivers]);

  const driverMap = useMemo(() => new Map(drivers.map(d => [d.driver_number, d])), [drivers]);

  if (selectedDrivers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground">Select drivers to view lap times</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-display tracking-wider text-foreground">Lap Times</h3>
      </div>
      <div className="p-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis
              dataKey="lap"
              stroke="hsl(220, 10%, 40%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              label={{ value: 'Lap', position: 'insideBottom', offset: -2, fontSize: 10, fill: 'hsl(220, 10%, 55%)' }}
            />
            <YAxis
              domain={['auto', 'auto']}
              stroke="hsl(220, 10%, 40%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(v: number) => v.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 18%, 10%)',
                border: '1px solid hsl(220, 15%, 18%)',
                borderRadius: '6px',
                fontFamily: 'JetBrains Mono',
                fontSize: '11px',
              }}
              formatter={(value: number, name: string) => {
                const dn = parseInt(name.replace('d', ''));
                const driver = driverMap.get(dn);
                return [formatLapTime(value), driver?.name_acronym || name];
              }}
              labelFormatter={(label) => `Lap ${label}`}
            />
            {selectedDrivers.map(dn => {
              const driver = driverMap.get(dn);
              return (
                <Line
                  key={dn}
                  type="monotone"
                  dataKey={`d${dn}`}
                  stroke={driver ? getTeamColor(driver.team_colour) : '#888'}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  animationDuration={400}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
