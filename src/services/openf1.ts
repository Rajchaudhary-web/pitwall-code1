import type { Driver, LapData, PositionData, StintData, WeatherData, SessionInfo } from '@/types/f1';

const BASE_URL = 'https://api.openf1.org/v1';

async function fetchApi<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T[]> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`OpenF1 API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`OpenF1 fetch failed for ${endpoint}, using fallback data`, err);
    return [];
  }
}

export async function getLatestSession(): Promise<SessionInfo | null> {
  const sessions = await fetchApi<SessionInfo>('/sessions', {
    session_type: 'Race',
    year: 2024,
  });
  return sessions.length > 0 ? sessions[sessions.length - 1] : null;
}

export async function getSessions(year: number): Promise<SessionInfo[]> {
  return fetchApi<SessionInfo>('/sessions', { session_type: 'Race', year });
}

export async function getDrivers(sessionKey: number): Promise<Driver[]> {
  return fetchApi<Driver>('/drivers', { session_key: sessionKey });
}

export async function getLaps(sessionKey: number, driverNumber?: number): Promise<LapData[]> {
  const params: Record<string, string | number> = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;
  return fetchApi<LapData>('/laps', params);
}

export async function getPositions(sessionKey: number, driverNumber?: number): Promise<PositionData[]> {
  const params: Record<string, string | number> = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;
  return fetchApi<PositionData>('/position', params);
}

export async function getStints(sessionKey: number, driverNumber?: number): Promise<StintData[]> {
  const params: Record<string, string | number> = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;
  return fetchApi<StintData>('/stints', params);
}

export async function getWeather(sessionKey: number): Promise<WeatherData[]> {
  return fetchApi<WeatherData>('/weather', { session_key: sessionKey });
}
