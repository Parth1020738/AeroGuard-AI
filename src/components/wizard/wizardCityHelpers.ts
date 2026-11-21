import { HouseholdProfile } from '../../types/airQuality';

/**
 * Generates quick Indian city preset pill models with active selection indicators.
 * @param currentCity - Active city name in profile.
 * @param onSelect - Callback triggered when city pill is selected.
 * @returns Array of quick city button models.
 */
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

/**
 * Formats live telemetry metadata into headline and subline strings for UI presentation.
 * @param profile - Current household profile containing optional live telemetry.
 * @returns Formatted headline and subline strings, or null if telemetry is absent.
 */
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
