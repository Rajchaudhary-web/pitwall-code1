import { type StrategyRecommendation } from '@/types/f1';
import { getTyreColor } from '@/lib/f1Utils';

interface StrategyPanelProps {
  strategy: StrategyRecommendation | null;
  loading?: boolean;
}

export function StrategyPanel({ strategy, loading }: StrategyPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
        <div className="h-4 bg-secondary rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-3 bg-secondary rounded w-full" />
          <div className="h-3 bg-secondary rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-sm font-display text-muted-foreground">Strategy Engine</h3>
        <p className="text-xs text-muted-foreground mt-2">Select a driver to generate strategy</p>
      </div>
    );
  }

  const strategyLabels = {
    undercut: { label: 'UNDERCUT', color: 'text-pitwall-orange' },
    overcut: { label: 'OVERCUT', color: 'text-pitwall-blue' },
    standard: { label: 'STANDARD', color: 'text-pitwall-green' },
    'wet-switch': { label: 'WET SWITCH', color: 'text-pitwall-cyan' },
  };

  const st = strategyLabels[strategy.strategy];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-display tracking-wider text-foreground">AI Strategy</h3>
        <span className={`text-xs font-display font-bold ${st.color}`}>{st.label}</span>
      </div>

      {/* Main recommendation */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <StatBlock label="Pit Lap" value={`L${strategy.recommendedPitLap}`} highlight />
          <StatBlock
            label="Next Tyre"
            value={strategy.tyreChoice}
            dotColor={getTyreColor(strategy.tyreChoice)}
          />
          <StatBlock
            label="Confidence"
            value={`${(strategy.confidence * 100).toFixed(0)}%`}
          />
        </div>

        {/* Explanation */}
        <p className="text-xs text-muted-foreground leading-relaxed font-body">
          {strategy.explanation}
        </p>

        {/* Degradation bar */}
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Degradation Rate</span>
            <span className="font-mono">+{strategy.degradationRate.toFixed(3)}s/lap</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, strategy.degradationRate * 500)}%`,
                background: `linear-gradient(90deg, hsl(var(--pitwall-green)), hsl(var(--pitwall-yellow)), hsl(var(--pitwall-red)))`,
              }}
            />
          </div>
        </div>

        {/* Alternatives */}
        {strategy.alternativeStrategies.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-display">
              Alternatives
            </div>
            <div className="space-y-1.5">
              {strategy.alternativeStrategies.map((alt) => (
                <div
                  key={alt.name}
                  className="flex items-center justify-between text-xs bg-secondary/50 rounded px-3 py-1.5"
                >
                  <span className="text-foreground">{alt.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground">L{alt.pitLap}</span>
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: getTyreColor(alt.tyre) }}
                    />
                    <span className={`font-mono ${alt.estimatedDelta < 0 ? 'text-pitwall-green' : 'text-pitwall-red'}`}>
                      {alt.estimatedDelta > 0 ? '+' : ''}{alt.estimatedDelta.toFixed(1)}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBlock({ label, value, highlight, dotColor }: {
  label: string;
  value: string;
  highlight?: boolean;
  dotColor?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-1">
        {label}
      </div>
      <div className="flex items-center justify-center gap-1.5">
        {dotColor && (
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotColor }} />
        )}
        <span className={`text-lg font-mono font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
