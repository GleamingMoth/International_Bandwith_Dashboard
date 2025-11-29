import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function TimeSeriesChart() {
  const { filteredData, filters, processedData } = useDashboard();

  const chartData = useMemo(() => {
    // Use filtered data if countries are selected, otherwise show top 5
    const dataToUse =
      filters.selectedCountries.length > 0
        ? filteredData
        : processedData
            .filter((d) => d.year === filters.selectedYear)
            .sort((a, b) => b.bandwidth - a.bandwidth)
            .slice(0, 5)
            .map((d) => d.country);

    const countries =
      filters.selectedCountries.length > 0
        ? filters.selectedCountries
        : (dataToUse as string[]);

    // Group data by year
    const yearMap = new Map<number, Record<string, number>>();

    const relevantData =
      filters.selectedCountries.length > 0 ? filteredData : processedData;

    relevantData.forEach((d) => {
      if (countries.includes(d.country)) {
        if (!yearMap.has(d.year)) {
          yearMap.set(d.year, {});
        }
        yearMap.get(d.year)![d.country] = filters.logScale
          ? Math.log10(d.bandwidth + 1)
          : d.bandwidth;
      }
    });

    return Array.from(yearMap.entries())
      .map(([year, values]) => ({
        year,
        ...values,
      }))
      .sort((a, b) => a.year - b.year);
  }, [filteredData, filters, processedData]);

  const countries = useMemo(() => {
    if (filters.selectedCountries.length > 0) {
      return filters.selectedCountries;
    }
    // Get top 5 countries for the selected year
    return processedData
      .filter((d) => d.year === filters.selectedYear)
      .sort((a, b) => b.bandwidth - a.bandwidth)
      .slice(0, 5)
      .map((d) => d.country);
  }, [filters.selectedCountries, processedData, filters.selectedYear]);

  const formatYAxis = (value: number) => {
    if (filters.logScale) {
      return `10^${value.toFixed(1)}`;
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Bandwidth Over Time
          {filters.selectedCountries.length === 0 && ' (Top 5 Countries)'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              tickFormatter={formatYAxis}
              label={{
                value: filters.logScale
                  ? 'Bandwidth (log scale)'
                  : 'Bandwidth (Kbps)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => {
                if (filters.logScale) {
                  const actual = Math.pow(10, value) - 1;
                  return actual >= 1000
                    ? `${(actual / 1000).toFixed(2)}K Kbps`
                    : `${actual.toFixed(2)} Kbps`;
                }
                return value >= 1000
                  ? `${(value / 1000).toFixed(2)}K Kbps`
                  : `${value.toFixed(2)} Kbps`;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
              formatter={(value) => (
                <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
              )}
            />
            {countries.map((country, index) => (
              <Line
                key={country}
                type="monotone"
                dataKey={country}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
