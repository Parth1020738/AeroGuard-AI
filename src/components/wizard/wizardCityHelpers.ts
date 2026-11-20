import { HouseholdProfile } from '../../types/airQuality';

export function getIndianQuickCities(
  currentCity: string,
  onSelect: (city: string) => void
): { name: string; isSelected: boolean; onClick: () => void }[] {
  const cities = ['Delhi', 'Noida', 'Mumbai', 'Kolkata', 'Bengaluru', 'Ahmedabad'];
  return cities.map((c) => ({
    name: c,
    isSelected: currentCity.toLowerCase() === c.toLowerCase(),
    onClick: () => onSelect(c),
  }));
}

export function formatTelemetryBadge(profile: HouseholdProfile): {
  headline: string;
  subline: string;
} | null {
  if (!profile.liveReading) return null;
  const { aqi, pm25, pm10, city, source, fetchedAt } = profile.liveReading;
  const timeStr = new Date(fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    headline: `Live ${city}: AQI ${aqi} • PM2.5: ${pm25} µg/m³ • PM10: ${pm10} µg/m³`,
    subline: `Verified via ${source} • ${timeStr}`,
  };
}
