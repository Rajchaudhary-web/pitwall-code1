import { type Driver } from '@/types/f1';
import { getTeamColor } from '@/lib/f1Utils';

interface DriverSelectorProps {
  drivers: Driver[];
  selectedDriver: number | null;
  onSelect: (driverNumber: number) => void;
  label?: string;
}

export function DriverSelector({ drivers, selectedDriver, onSelect, label = 'Select Driver' }: DriverSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {drivers.slice(0, 10).map((driver) => {
          const isSelected = selectedDriver === driver.driver_number;
          const teamColor = getTeamColor(driver.team_colour);

          return (
            <button
              key={driver.driver_number}
              onClick={() => onSelect(driver.driver_number)}
              className={`
                relative overflow-hidden rounded-md px-3 py-2 text-left transition-all duration-200
                border border-border hover:border-primary/50
                ${isSelected ? 'ring-1 ring-primary bg-secondary' : 'bg-card'}
              `}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: teamColor }}
              />
              <div className="pl-2">
                <div className="text-xs font-mono font-semibold text-foreground">
                  {driver.name_acronym}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {driver.team_name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
