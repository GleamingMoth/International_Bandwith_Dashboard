export interface BandwidthData {
  country: string;
  countryCode: string;
  year: number;
  bandwidth: number;
  region?: string;
}

export interface ProcessedData {
  country: string;
  countryCode: string;
  year: number;
  bandwidth: number;
  yoyGrowth?: number;
  region?: string;
}

export interface CountryTimeSeries {
  country: string;
  countryCode: string;
  data: Array<{
    year: number;
    bandwidth: number;
    yoyGrowth?: number;
  }>;
}

export interface GlobalMetrics {
  year: number;
  globalAverage: number;
  yoyGrowth?: number;
  topCountries: Array<{ country: string; bandwidth: number }>;
  fastestGrowing: Array<{ country: string; growth: number }>;
  criticalLagging: Array<{ country: string; years: number }>;
}

export interface DashboardFilters {
  selectedCountries: string[];
  selectedYear: number;
  selectedRegions: string[];
  logScale: boolean;
}
