import type { Driver, LapData, StintData, WeatherData, PositionData } from '@/types/f1';

export const SAMPLE_DRIVERS: Driver[] = [
  { driver_number: 1, broadcast_name: 'M VERSTAPPEN', full_name: 'Max Verstappen', name_acronym: 'VER', team_name: 'Red Bull Racing', team_colour: '3671C6', country_code: 'NED' },
  { driver_number: 11, broadcast_name: 'S PEREZ', full_name: 'Sergio Perez', name_acronym: 'PER', team_name: 'Red Bull Racing', team_colour: '3671C6', country_code: 'MEX' },
  { driver_number: 44, broadcast_name: 'L HAMILTON', full_name: 'Lewis Hamilton', name_acronym: 'HAM', team_name: 'Mercedes', team_colour: '27F4D2', country_code: 'GBR' },
  { driver_number: 63, broadcast_name: 'G RUSSELL', full_name: 'George Russell', name_acronym: 'RUS', team_name: 'Mercedes', team_colour: '27F4D2', country_code: 'GBR' },
  { driver_number: 16, broadcast_name: 'C LECLERC', full_name: 'Charles Leclerc', name_acronym: 'LEC', team_name: 'Ferrari', team_colour: 'E8002D', country_code: 'MON' },
  { driver_number: 55, broadcast_name: 'C SAINZ', full_name: 'Carlos Sainz', name_acronym: 'SAI', team_name: 'Ferrari', team_colour: 'E8002D', country_code: 'ESP' },
  { driver_number: 4, broadcast_name: 'L NORRIS', full_name: 'Lando Norris', name_acronym: 'NOR', team_name: 'McLaren', team_colour: 'FF8000', country_code: 'GBR' },
  { driver_number: 81, broadcast_name: 'O PIASTRI', full_name: 'Oscar Piastri', name_acronym: 'PIA', team_name: 'McLaren', team_colour: 'FF8000', country_code: 'AUS' },
  { driver_number: 14, broadcast_name: 'F ALONSO', full_name: 'Fernando Alonso', name_acronym: 'ALO', team_name: 'Aston Martin', team_colour: '229971', country_code: 'ESP' },
  { driver_number: 18, broadcast_name: 'L STROLL', full_name: 'Lance Stroll', name_acronym: 'STR', team_name: 'Aston Martin', team_colour: '229971', country_code: 'CAN' },
];

function generateLaps(driverNumber: number, basePace: number, totalLaps: number): LapData[] {
  const laps: LapData[] = [];
  for (let i = 1; i <= totalLaps; i++) {
    const degradation = (i % 20) * 0.05;
    const variation = (Math.random() - 0.5) * 0.8;
    const isPitLap = i === 18 || i === 38;
    laps.push({
      driver_number: driverNumber,
      lap_number: i,
      lap_duration: isPitLap ? basePace + 22 + variation : basePace + degradation + variation,
      duration_sector_1: (basePace / 3) + degradation / 3 + (Math.random() - 0.5) * 0.3,
      duration_sector_2: (basePace / 3) + degradation / 3 + (Math.random() - 0.5) * 0.3,
      duration_sector_3: (basePace / 3) + degradation / 3 + (Math.random() - 0.5) * 0.3,
      is_pit_out_lap: isPitLap,
    });
  }
  return laps;
}

export function getSampleLaps(totalLaps = 57): Map<number, LapData[]> {
  const map = new Map<number, LapData[]>();
  const paces = [83.2, 83.5, 83.4, 83.6, 83.3, 83.7, 83.5, 83.8, 84.0, 84.2];
  SAMPLE_DRIVERS.forEach((d, i) => {
    map.set(d.driver_number, generateLaps(d.driver_number, paces[i], totalLaps));
  });
  return map;
}

export function getSampleStints(driverNumber: number): StintData[] {
  return [
    { driver_number: driverNumber, stint_number: 1, compound: 'SOFT', lap_start: 1, lap_end: 17, tyre_age_at_start: 0 },
    { driver_number: driverNumber, stint_number: 2, compound: 'HARD', lap_start: 18, lap_end: 37, tyre_age_at_start: 0 },
    { driver_number: driverNumber, stint_number: 3, compound: 'MEDIUM', lap_start: 38, lap_end: 57, tyre_age_at_start: 0 },
  ];
}

export function getSamplePositions(totalLaps = 57): Map<number, PositionData[]> {
  const map = new Map<number, PositionData[]>();
  SAMPLE_DRIVERS.forEach((d, idx) => {
    const positions: PositionData[] = [];
    let pos = idx + 1;
    for (let lap = 1; lap <= totalLaps; lap++) {
      if (Math.random() < 0.05 && pos > 1) pos--;
      else if (Math.random() < 0.03 && pos < 10) pos++;
      positions.push({
        driver_number: d.driver_number,
        position: pos,
        date: new Date(Date.now() - (totalLaps - lap) * 90000).toISOString(),
      });
    }
    map.set(d.driver_number, positions);
  });
  return map;
}

export function getSampleWeather(): WeatherData {
  return {
    date: new Date().toISOString(),
    air_temperature: 28,
    track_temperature: 45,
    humidity: 42,
    rainfall: false,
    wind_speed: 12,
    wind_direction: 180,
  };
}
