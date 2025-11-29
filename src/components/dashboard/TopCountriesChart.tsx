import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useMemo, useState } from 'react';

export function TopCountriesChart() {
  const { processedData, filters, updateFilters } = useDashboard();
  const [showBottom, setShowBottom] = useState(false);

  const chartData = useMemo(() => {
    const yearData = processedData.filter((d) => d.year === filters.selectedYear);
    const sorted = yearData.sort((a, b) =>
      showBottom ? a.bandwidth - b.bandwidth : b.bandwidth - a.bandwidth
    );

    return sorted.slice(0, 10).map((d) => ({
      country: d.country,
      bandwidth: d.bandwidth,
      yoyGrowth: d.yoyGrowth,
    }));
  }, [processedData, filters.selectedYear, showBottom]);

  const handleBarClick = (data: any) => {
    if (data && data.country) {
      const isSelected = filters.selectedCountries.includes(data.country);
      if (isSelected) {
        updateFilters({
          selectedCountries: filters.selectedCountries.filter(
            (c) => c !== data.country
          ),
        });
      } else {
        updateFilters({
          selectedCountries: [...filters.selectedCountries, data.country],
        });
      }
    }
  };

  const formatBandwidth = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          {showBottom ? 'Bottom 10' : 'Top 10'} Countries ({filters.selectedYear})
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBottom(!showBottom)}
        >
          Show {showBottom ? 'Top' : 'Bottom'} 10
        </Button>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 80, right: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              tickFormatter={formatBandwidth}
            />
            <YAxis
              type="category"
              dataKey="country"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '11px' }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'bandwidth') {
                  return [`${formatBandwidth(value)} Kbps`, 'Bandwidth'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Country: ${label}`}
            />
            <Bar
              dataKey="bandwidth"
              onClick={handleBarClick}
              cursor="pointer"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    filters.selectedCountries.includes(entry.country)
                      ? 'hsl(var(--accent))'
                      : showBottom
                      ? 'hsl(var(--destructive))'
                      : 'hsl(var(--primary))'
                  }
                  opacity={
                    filters.selectedCountries.length === 0 ||
                    filters.selectedCountries.includes(entry.country)
                      ? 1
                      : 0.3
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Click on a bar to filter other charts
        </p>
      </CardContent>
    </Card>
  );
}
