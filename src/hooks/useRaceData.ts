import { useState, useEffect, useCallback } from 'react';
import type { Driver, LapData, StintData, WeatherData, PositionData, SessionInfo } from '@/types/f1';
import * as openf1 from '@/services/openf1';
import { SAMPLE_DRIVERS, getSampleLaps, getSampleStints, getSamplePositions, getSampleWeather } from '@/services/sampleData';

interface UseRaceDataReturn {
  session: SessionInfo | null;
  drivers: Driver[];
  laps: Map<number, LapData[]>;
  positions: Map<number, PositionData[]>;
  stints: Map<number, StintData[]>;
  weather: WeatherData;
  loading: boolean;
  error: string | null;
  currentLap: number;
  totalLaps: number;
  refreshData: () => void;
  isLive: boolean;
}

export function useRaceData(): UseRaceDataReturn {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>(SAMPLE_DRIVERS);
  const [laps, setLaps] = useState<Map<number, LapData[]>>(new Map());
  const [positions, setPositions] = useState<Map<number, PositionData[]>>(new Map());
  const [stints, setStints] = useState<Map<number, StintData[]>>(new Map());
  const [weather, setWeather] = useState<WeatherData>(getSampleWeather());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sess = await openf1.getLatestSession();
      if (sess) {
        setSession(sess);
        const [drv, wth] = await Promise.all([
          openf1.getDrivers(sess.session_key),
          openf1.getWeather(sess.session_key),
        ]);

        if (drv.length > 0) {
          // Deduplicate drivers by driver_number
          const unique = Array.from(new Map(drv.map(d => [d.driver_number, d])).values());
          setDrivers(unique);
          setIsLive(true);

          // Fetch laps and stints for all drivers in parallel
          const [allLaps, allStints, allPositions] = await Promise.all([
            openf1.getLaps(sess.session_key),
            openf1.getStints(sess.session_key),
            openf1.getPositions(sess.session_key),
          ]);

          const lapMap = new Map<number, LapData[]>();
          allLaps.forEach(l => {
            if (!lapMap.has(l.driver_number)) lapMap.set(l.driver_number, []);
            lapMap.get(l.driver_number)!.push(l);
          });
          setLaps(lapMap);

          const stintMap = new Map<number, StintData[]>();
          allStints.forEach(s => {
            if (!stintMap.has(s.driver_number)) stintMap.set(s.driver_number, []);
            stintMap.get(s.driver_number)!.push(s);
          });
          setStints(stintMap);

          const posMap = new Map<number, PositionData[]>();
          allPositions.forEach(p => {
            if (!posMap.has(p.driver_number)) posMap.set(p.driver_number, []);
            posMap.get(p.driver_number)!.push(p);
          });
          setPositions(posMap);

          if (wth.length > 0) setWeather(wth[wth.length - 1]);
          return;
        }
      }
      // Fallback to sample data
      useSampleData();
    } catch (e) {
      console.warn('Falling back to sample data:', e);
      useSampleData();
    } finally {
      setLoading(false);
    }
  }, []);

  const useSampleData = () => {
    setDrivers(SAMPLE_DRIVERS);
    setLaps(getSampleLaps());
    setPositions(getSamplePositions());
    const stintMap = new Map<number, StintData[]>();
    SAMPLE_DRIVERS.forEach(d => stintMap.set(d.driver_number, getSampleStints(d.driver_number)));
    setStints(stintMap);
    setWeather(getSampleWeather());
    setIsLive(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const allLaps = Array.from(laps.values()).flat();
  const maxLap = allLaps.length > 0 ? Math.max(...allLaps.map(l => l.lap_number)) : 57;

  return {
    session,
    drivers,
    laps,
    positions,
    stints,
    weather,
    loading,
    error,
    currentLap: maxLap,
    totalLaps: maxLap,
    refreshData: loadData,
    isLive,
  };
}
