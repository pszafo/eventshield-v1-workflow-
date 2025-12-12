export type WeatherRisk = "LOW" | "MEDIUM" | "HIGH";

export async function getWeatherRiskForEvent(
  lat: number,
  lon: number,
  eventDate: string // format: "2025-02-28"
): Promise<WeatherRisk> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation,windspeed_10m&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data");

  const data = await res.json();

  const hours = data.hourly.time as string[];
  const precip = data.hourly.precipitation as number[];
  const wind = data.hourly.windspeed_10m as number[];

  // Filter the specific date's weather (midnight → 23:00)
  const dayIndices = hours
    .map((t, i) => (t.startsWith(eventDate) ? i : -1))
    .filter(i => i !== -1);

  if (dayIndices.length === 0) {
    console.warn("No weather data available for this date");
    return "LOW";
  }

  // Calculate daily metrics
  const dailyPrecip = Math.max(...dayIndices.map(i => precip[i] ?? 0));  // mm/hr
  const dailyWind = Math.max(...dayIndices.map(i => wind[i] ?? 0));      // km/h

  // Risk rules
  if (dailyPrecip > 7 || dailyWind > 40) {
    return "HIGH";
  } else if (dailyPrecip > 3 || dailyWind > 25) {
    return "MEDIUM";
  } else {
    return "LOW";
  }
}

