import type { WeatherData } from '@/types/f1';
import { Cloud, Droplets, Wind, Thermometer, Sun } from 'lucide-react';

interface WeatherOverlayProps {
  weather: WeatherData;
}

export function WeatherOverlay({ weather }: WeatherOverlayProps) {
  const rainProb = weather.rainfall ? 90 : weather.humidity > 70 ? 40 : weather.humidity > 50 ? 15 : 5;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-display tracking-wider text-foreground">Weather</h3>
        {weather.rainfall ? (
          <Cloud className="w-4 h-4 text-pitwall-blue" />
        ) : (
          <Sun className="w-4 h-4 text-pitwall-yellow" />
        )}
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        <WeatherStat icon={<Thermometer className="w-3.5 h-3.5" />} label="Air" value={`${weather.air_temperature}°C`} />
        <WeatherStat icon={<Thermometer className="w-3.5 h-3.5 text-pitwall-orange" />} label="Track" value={`${weather.track_temperature}°C`} />
        <WeatherStat icon={<Droplets className="w-3.5 h-3.5 text-pitwall-blue" />} label="Rain%" value={`${rainProb}%`} highlight={rainProb > 50} />
        <WeatherStat icon={<Wind className="w-3.5 h-3.5" />} label="Wind" value={`${weather.wind_speed} km/h`} />
      </div>
      {rainProb > 50 && (
        <div className="px-4 pb-3">
          <div className="bg-pitwall-blue/10 border border-pitwall-blue/30 rounded px-3 py-2 text-[10px] text-pitwall-blue font-mono">
            ⚠ HIGH RAIN PROBABILITY — WET TYRES STANDBY
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherStat({ icon, label, value, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 bg-secondary/30 rounded px-3 py-2">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`text-xs font-mono font-semibold ${highlight ? 'text-pitwall-blue' : 'text-foreground'}`}>
          {value}
        </div>
      </div>
    </div>
  );
}
