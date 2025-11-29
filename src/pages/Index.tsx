import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { KPICards } from '@/components/dashboard/KPICards';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { TopCountriesChart } from '@/components/dashboard/TopCountriesChart';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { InfoPanel } from '@/components/dashboard/InfoPanel';
import { BarChart3 } from 'lucide-react';

function DashboardContent() {
  const { loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-lg text-muted-foreground">Loading bandwidth data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-destructive">Error Loading Data</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                International Bandwidth Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Global Digital Access Observatory (GDAO)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Info Panel - Use Case, KPIs, Analytical Questions */}
        <section>
          <InfoPanel />
        </section>

        {/* KPIs */}
        <section>
          <KPICards />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Filters */}
          <aside className="lg:col-span-1">
            <FilterPanel />
          </aside>

          {/* Right Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <TimeSeriesChart />
            <TopCountriesChart />
          </div>
        </div>

        {/* Insights */}
        <section>
          <InsightsPanel />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-6 border-t border-border">
          <p>
            Data Source: ITU ICT Indicators Database | Dashboard by GDAO
          </p>
          <p className="mt-1">
            Measuring global progress toward universal internet access (SDGs)
          </p>
        </footer>
      </main>
    </div>
  );
}

const Index = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Index;
