import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Globe, AlertTriangle } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';

export function KPICards() {
  const { globalMetrics, filters } = useDashboard();

  if (!globalMetrics) return null;

  const formatBandwidth = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toFixed(2);
  };

  const formatGrowth = (growth?: number) => {
    if (growth === undefined) return 'N/A';
    return `${growth > 0 ? '+' : ''}${growth.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Global Average
          </CardTitle>
          <Globe className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatBandwidth(globalMetrics.globalAverage)} Kbps
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Year {filters.selectedYear}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            YoY Growth
          </CardTitle>
          {globalMetrics.yoyGrowth && globalMetrics.yoyGrowth > 0 ? (
            <TrendingUp className="h-4 w-4 text-secondary" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              globalMetrics.yoyGrowth && globalMetrics.yoyGrowth > 0
                ? 'text-secondary'
                : 'text-destructive'
            }`}
          >
            {formatGrowth(globalMetrics.yoyGrowth)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {filters.selectedYear - 1} → {filters.selectedYear}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Performer
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-foreground truncate">
            {globalMetrics.topCountries[0]?.country || 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatBandwidth(globalMetrics.topCountries[0]?.bandwidth || 0)} Kbps
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Critical Lagging
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {globalMetrics.criticalLagging.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Countries with stagnant growth
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
