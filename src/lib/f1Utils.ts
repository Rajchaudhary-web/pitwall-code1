import type { TyreCompound } from '@/types/f1';

const COMPOUND_COLORS: Record<TyreCompound, string> = {
  SOFT: '#E8002D',
  MEDIUM: '#FFC700',
  HARD: '#EBEBEB',
  INTERMEDIATE: '#43B02A',
  WET: '#0072C6',
};

export function getTyreColor(compound: TyreCompound): string {
  return COMPOUND_COLORS[compound] || '#888';
}

export function getTeamColor(teamColour: string): string {
  return `#${teamColour}`;
}

export function formatLapTime(seconds: number | null): string {
  if (!seconds) return '--.---';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
  }
  return secs.toFixed(3);
}

export function formatDelta(delta: number): string {
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta.toFixed(3)}`;
}
