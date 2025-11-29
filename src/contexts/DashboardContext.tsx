import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BandwidthData, ProcessedData, DashboardFilters, GlobalMetrics } from '@/types/bandwidth';
import {
  loadCSVData,
  calculateYoYGrowth,
  getAvailableYears,
  getAvailableCountries,
  getAvailableRegions,
  calculateGlobalMetrics,
} from '@/utils/dataLoader';

interface DashboardContextType {
  rawData: BandwidthData[];
  processedData: ProcessedData[];
  filters: DashboardFilters;
  availableYears: number[];
  availableCountries: string[];
  availableRegions: string[];
  globalMetrics: GlobalMetrics | null;
  loading: boolean;
  error: string | null;
  updateFilters: (updates: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
  filteredData: ProcessedData[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<BandwidthData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);

  const [filters, setFilters] = useState<DashboardFilters>({
    selectedCountries: [],
    selectedYear: 2020,
    selectedRegions: [],
    logScale: false,
  });

  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetrics | null>(null);

  // Load and process data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await loadCSVData();
        const processed = calculateYoYGrowth(data);

        setRawData(data);
        setProcessedData(processed);

        const years = getAvailableYears(data);
        const countries = getAvailableCountries(data);
        const regions = getAvailableRegions(data);

        setAvailableYears(years);
        setAvailableCountries(countries);
        setAvailableRegions(regions);

        // Set initial year to the most recent
        const latestYear = years[years.length - 1] || 2020;
        setFilters((prev) => ({ ...prev, selectedYear: latestYear }));

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Update global metrics when year changes
  useEffect(() => {
    if (processedData.length > 0) {
      const metrics = calculateGlobalMetrics(processedData, filters.selectedYear);
      setGlobalMetrics(metrics);
    }
  }, [processedData, filters.selectedYear]);

  const updateFilters = (updates: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters({
      selectedCountries: [],
      selectedYear: availableYears[availableYears.length - 1] || 2020,
      selectedRegions: [],
      logScale: false,
    });
  };

  // Calculate filtered data based on current filters
  const filteredData = React.useMemo(() => {
    let filtered = processedData;

    if (filters.selectedCountries.length > 0) {
      filtered = filtered.filter((d) =>
        filters.selectedCountries.includes(d.country)
      );
    }

    if (filters.selectedRegions.length > 0) {
      filtered = filtered.filter(
        (d) => d.region && filters.selectedRegions.includes(d.region)
      );
    }

    return filtered;
  }, [processedData, filters.selectedCountries, filters.selectedRegions]);

  return (
    <DashboardContext.Provider
      value={{
        rawData,
        processedData,
        filters,
        availableYears,
        availableCountries,
        availableRegions,
        globalMetrics,
        loading,
        error,
        updateFilters,
        resetFilters,
        filteredData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
