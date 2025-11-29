import Papa from 'papaparse';
import { BandwidthData, ProcessedData, CountryTimeSeries, GlobalMetrics } from '@/types/bandwidth';

// Region mapping for countries
const regionMap: Record<string, string> = {
  // Add region mappings as needed
  USA: 'Americas', CAN: 'Americas', MEX: 'Americas', BRA: 'Americas',
  GBR: 'Europe', FRA: 'Europe', DEU: 'Europe', ITA: 'Europe',
  CHN: 'Asia', JPN: 'Asia', IND: 'Asia', KOR: 'Asia',
  AUS: 'Oceania', NZL: 'Oceania',
  ZAF: 'Africa', EGY: 'Africa', NGA: 'Africa', KEN: 'Africa',
};

export async function loadCSVData(): Promise<BandwidthData[]> {
  const response = await fetch('/data/ITU_DH_INT_BAND_PER_CAP.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: BandwidthData[] = results.data
          .map((row: any) => ({
            country: row.REF_AREA_LABEL || row.REF_AREA,
            countryCode: row.REF_AREA,
            year: parseInt(row.TIME_PERIOD),
            bandwidth: parseFloat(row.OBS_VALUE),
            region: regionMap[row.REF_AREA] || 'Other',
          }))
          .filter((d) => !isNaN(d.year) && !isNaN(d.bandwidth));
        resolve(data);
      },
      error: (error) => reject(error),
    });
  });
}

export function calculateYoYGrowth(data: BandwidthData[]): ProcessedData[] {
  const sortedData = [...data].sort((a, b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    return a.year - b.year;
  });

  const processedData: ProcessedData[] = [];
  const countryData: Record<string, BandwidthData[]> = {};

  // Group by country
  sortedData.forEach((d) => {
    if (!countryData[d.country]) countryData[d.country] = [];
    countryData[d.country].push(d);
  });

  // Calculate YoY for each country
  Object.values(countryData).forEach((countryYears) => {
    countryYears.forEach((current, index) => {
      const previous = index > 0 ? countryYears[index - 1] : null;
      const yoyGrowth =
        previous && current.year === previous.year + 1
          ? ((current.bandwidth - previous.bandwidth) / previous.bandwidth) * 100
          : undefined;

      processedData.push({
        ...current,
        yoyGrowth,
      });
    });
  });

  return processedData;
}

export function getCountryTimeSeries(data: ProcessedData[]): CountryTimeSeries[] {
  const countryMap = new Map<string, ProcessedData[]>();

  data.forEach((d) => {
    if (!countryMap.has(d.country)) {
      countryMap.set(d.country, []);
    }
    countryMap.get(d.country)!.push(d);
  });

  return Array.from(countryMap.entries()).map(([country, countryData]) => ({
    country,
    countryCode: countryData[0].countryCode,
    data: countryData
      .sort((a, b) => a.year - b.year)
      .map((d) => ({
        year: d.year,
        bandwidth: d.bandwidth,
        yoyGrowth: d.yoyGrowth,
      })),
  }));
}

export function calculateGlobalMetrics(
  data: ProcessedData[],
  year: number
): GlobalMetrics {
  const yearData = data.filter((d) => d.year === year);
  const previousYearData = data.filter((d) => d.year === year - 1);

  const globalAverage =
    yearData.reduce((sum, d) => sum + d.bandwidth, 0) / yearData.length;

  const previousGlobalAverage =
    previousYearData.length > 0
      ? previousYearData.reduce((sum, d) => sum + d.bandwidth, 0) /
        previousYearData.length
      : 0;

  const yoyGrowth =
    previousGlobalAverage > 0
      ? ((globalAverage - previousGlobalAverage) / previousGlobalAverage) * 100
      : undefined;

  const topCountries = yearData
    .sort((a, b) => b.bandwidth - a.bandwidth)
    .slice(0, 10)
    .map((d) => ({ country: d.country, bandwidth: d.bandwidth }));

  const fastestGrowing = yearData
    .filter((d) => d.yoyGrowth !== undefined)
    .sort((a, b) => (b.yoyGrowth || 0) - (a.yoyGrowth || 0))
    .slice(0, 10)
    .map((d) => ({ country: d.country, growth: d.yoyGrowth || 0 }));

  // Find critical lagging countries (low growth for 3+ consecutive years)
  const criticalLagging = findCriticalLaggingCountries(data, year);

  return {
    year,
    globalAverage,
    yoyGrowth,
    topCountries,
    fastestGrowing,
    criticalLagging,
  };
}

function findCriticalLaggingCountries(
  data: ProcessedData[],
  currentYear: number
): Array<{ country: string; years: number }> {
  const threshold = 5; // 5% growth threshold
  const requiredYears = 3;

  const countryMap = new Map<string, ProcessedData[]>();
  data.forEach((d) => {
    if (!countryMap.has(d.country)) {
      countryMap.set(d.country, []);
    }
    countryMap.get(d.country)!.push(d);
  });

  const lagging: Array<{ country: string; years: number }> = [];

  countryMap.forEach((countryData, country) => {
    const sortedData = countryData.sort((a, b) => b.year - a.year);
    let consecutiveYears = 0;

    for (const d of sortedData) {
      if (d.year > currentYear) continue;
      if (d.yoyGrowth !== undefined && d.yoyGrowth <= threshold) {
        consecutiveYears++;
      } else {
        break;
      }
    }

    if (consecutiveYears >= requiredYears) {
      lagging.push({ country, years: consecutiveYears });
    }
  });

  return lagging.sort((a, b) => b.years - a.years);
}

export function getRankings(
  data: ProcessedData[],
  year: number,
  top: boolean = true,
  count: number = 10
): Array<{ country: string; bandwidth: number; rank: number }> {
  const yearData = data.filter((d) => d.year === year);
  const sorted = yearData.sort((a, b) =>
    top ? b.bandwidth - a.bandwidth : a.bandwidth - b.bandwidth
  );

  return sorted.slice(0, count).map((d, index) => ({
    country: d.country,
    bandwidth: d.bandwidth,
    rank: index + 1,
  }));
}

export function getAvailableYears(data: BandwidthData[]): number[] {
  const years = new Set(data.map((d) => d.year));
  return Array.from(years).sort((a, b) => a - b);
}

export function getAvailableCountries(data: BandwidthData[]): string[] {
  const countries = new Set(data.map((d) => d.country));
  return Array.from(countries).sort();
}

export function getAvailableRegions(data: BandwidthData[]): string[] {
  const regions = new Set(data.map((d) => d.region).filter(Boolean));
  return Array.from(regions as Set<string>).sort();
}
