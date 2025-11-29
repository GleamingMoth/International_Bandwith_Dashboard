import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';
import { Download, TrendingUp, AlertCircle, Globe } from 'lucide-react';
import { useMemo } from 'react';

export function InsightsPanel() {
  const { globalMetrics, filters, processedData } = useDashboard();

  const insights = useMemo(() => {
    if (!globalMetrics) return [];

    const insights: Array<{ icon: any; title: string; content: string }> = [];

    // Global trend insight
    if (globalMetrics.yoyGrowth !== undefined) {
      insights.push({
        icon: Globe,
        title: 'Global Trend',
        content: `Global bandwidth per capita ${
          globalMetrics.yoyGrowth > 0 ? 'increased' : 'decreased'
        } by ${Math.abs(globalMetrics.yoyGrowth).toFixed(2)}% in ${
          filters.selectedYear
        }. Average bandwidth reached ${globalMetrics.globalAverage.toFixed(
          2
        )} Kbps per capita.`,
      });
    }

    // Top performers
    if (globalMetrics.topCountries.length > 0) {
      const top3 = globalMetrics.topCountries.slice(0, 3);
      insights.push({
        icon: TrendingUp,
        title: 'Top Performers',
        content: `${top3
          .map(
            (c, i) =>
              `${i + 1}. ${c.country} (${(c.bandwidth / 1000).toFixed(1)}K Kbps)`
          )
          .join(', ')}. These countries lead in international bandwidth infrastructure.`,
      });
    }

    // Fastest growing
    if (globalMetrics.fastestGrowing.length > 0) {
      const fastest = globalMetrics.fastestGrowing.slice(0, 3);
      insights.push({
        icon: TrendingUp,
        title: 'Fastest Growing',
        content: `${fastest
          .map((c) => `${c.country} (+${c.growth.toFixed(1)}%)`)
          .join(', ')} showed remarkable YoY growth, indicating significant infrastructure investment.`,
      });
    }

    // Critical lagging countries
    if (globalMetrics.criticalLagging.length > 0) {
      const lagging = globalMetrics.criticalLagging.slice(0, 3);
      insights.push({
        icon: AlertCircle,
        title: 'Critical Lagging Countries',
        content: `${lagging.length} countries show stagnant growth (≤5% for 3+ years). Top concerns: ${lagging
          .slice(0, 3)
          .map((c) => c.country)
          .join(', ')}. These regions require urgent policy intervention.`,
      });
    }

    // Regional disparity
    const yearData = processedData.filter((d) => d.year === filters.selectedYear);
    if (yearData.length > 0) {
      const max = Math.max(...yearData.map((d) => d.bandwidth));
      const min = Math.min(...yearData.map((d) => d.bandwidth));
      const ratio = max / min;
      insights.push({
        icon: AlertCircle,
        title: 'Digital Divide',
        content: `The bandwidth gap between highest and lowest countries is ${ratio.toFixed(
          0
        )}x, highlighting significant digital inequality that impacts economic competitiveness.`,
      });
    }

    return insights;
  }, [globalMetrics, filters.selectedYear, processedData]);

  const handleExport = () => {
    const text = insights
      .map((insight) => `${insight.title}\n${insight.content}\n`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bandwidth-insights-${filters.selectedYear}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Automated Insights
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-[var(--transition-smooth)]"
            >
              <div className="flex-shrink-0 mt-0.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.content}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
