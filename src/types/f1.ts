export interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string;
  headshot_url?: string;
}

export interface LapData {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  is_pit_out_lap: boolean;
  st_speed?: number | null;
}

export interface PositionData {
  driver_number: number;
  position: number;
  date: string;
}

export interface StintData {
  driver_number: number;
  stint_number: number;
  compound: TyreCompound;
  lap_start: number;
  lap_end: number;
  tyre_age_at_start: number;
}

export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';

export interface WeatherData {
  date: string;
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  rainfall: boolean;
  wind_speed: number;
  wind_direction: number;
}

export interface SessionInfo {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
  country_name: string;
  year: number;
}

export interface StrategyRecommendation {
  recommendedPitLap: number;
  currentLap: number;
  totalLaps: number;
  tyreChoice: TyreCompound;
  confidence: number;
  explanation: string;
  degradationRate: number;
  estimatedTimeGain: number;
  strategy: 'undercut' | 'overcut' | 'standard' | 'wet-switch';
  alternativeStrategies: {
    name: string;
    pitLap: number;
    tyre: TyreCompound;
    estimatedDelta: number;
  }[];
}

export interface RivalComparison {
  driver: Driver;
  rival: Driver;
  lapDeltas: { lap: number; delta: number }[];
  positionHistory: { lap: number; driverPos: number; rivalPos: number }[];
  driverStints: StintData[];
  rivalStints: StintData[];
}

export interface RaceState {
  currentLap: number;
  totalLaps: number;
  driverNumber: number;
  currentCompound: TyreCompound;
  tyreAge: number;
  position: number;
  weather: WeatherData;
  rivalPositions: { driverNumber: number; position: number; compound: TyreCompound }[];
}
