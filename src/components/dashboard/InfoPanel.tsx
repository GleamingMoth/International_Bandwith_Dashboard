import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, HelpCircle, BarChart } from 'lucide-react';

export function InfoPanel() {
  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Dashboard Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="usecase" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usecase" className="gap-2">
              <Target className="h-4 w-4" />
              Use Case
            </TabsTrigger>
            <TabsTrigger value="kpi" className="gap-2">
              <BarChart className="h-4 w-4" />
              KPIs
            </TabsTrigger>
            <TabsTrigger value="questions" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usecase" className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Kasus Penggunaan (Use Case)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Bandwidth internasional per kapita menjadi indikator fundamental daya saing 
                ekonomi digital. Sistem dashboard ini dibangun oleh Global Digital Access 
                Observatory (GDAO) untuk:
              </p>
              <div className="space-y-3">
                <div className="pl-4 border-l-2 border-primary">
                  <h4 className="font-medium text-sm text-foreground">
                    1. Memetakan Disparitas Nyata
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Menganalisis perbedaan tingkat bandwidth antar-wilayah dan negara untuk 
                    memahami kesenjangan digital global.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-secondary">
                  <h4 className="font-medium text-sm text-foreground">
                    2. Mengarahkan Kebijakan Investasi
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mengidentifikasi negara Critical Lagging (stagnasi &gt;3 tahun) yang 
                    memerlukan intervensi kebijakan dan investasi infrastruktur.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-accent">
                  <h4 className="font-medium text-sm text-foreground">
                    3. Audit Kemajuan SDGs
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mengukur progres tujuan akses internet universal sesuai dengan Sustainable 
                    Development Goals (SDGs).
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kpi" className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Key Performance Indicators (KPIs)
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    International Bandwidth per Capita
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    <strong>Definition:</strong> Total international bandwidth (Kbps) divided by 
                    population. Primary metric for digital infrastructure capacity.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    Global Mean per Year
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    <strong>Definition:</strong> Average bandwidth across all countries for a 
                    given year. Benchmark for global progress.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    Year-over-Year Growth (YoY)
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>Formula:</strong> ((OBS_VALUE_t – OBS_VALUE_t-1) / OBS_VALUE_t-1) × 100%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Measures annual infrastructure growth rate. Critical for identifying investment trends.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    Ranking per Country
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    <strong>Definition:</strong> Relative position of countries based on bandwidth 
                    per capita for selected year. Used for competitive benchmarking.
                  </p>
                </div>

                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    Critical Lagging Countries
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    <strong>Definition:</strong> Countries with YoY growth ≤5% for 3+ consecutive 
                    years. Indicates stagnant infrastructure requiring urgent intervention.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Analytical Questions
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                This dashboard is designed to answer the following critical questions:
              </p>
              <div className="space-y-2">
                <div className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg transition-[var(--transition-smooth)]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    1
                  </div>
                  <p className="text-sm text-foreground flex-1">
                    Bagaimana tren global bandwidth per tahun?
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      (How does global bandwidth trend over time?)
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg transition-[var(--transition-smooth)]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
                    2
                  </div>
                  <p className="text-sm text-foreground flex-1">
                    Negara mana yang tertinggi dan terendah pada tahun terbaru?
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      (Which countries have the highest and lowest bandwidth in the latest year?)
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg transition-[var(--transition-smooth)]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                    3
                  </div>
                  <p className="text-sm text-foreground flex-1">
                    Negara mana dengan YoY Growth tertinggi?
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      (Which countries show the fastest YoY growth?)
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg transition-[var(--transition-smooth)]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    4
                  </div>
                  <p className="text-sm text-foreground flex-1">
                    Adakah perbedaan antar regional?
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      (Are there significant regional disparities?)
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg transition-[var(--transition-smooth)]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center text-xs font-bold text-destructive">
                    5
                  </div>
                  <p className="text-sm text-foreground flex-1">
                    Negara mana yang memerlukan intervensi kebijakan?
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      (Which countries require policy intervention?)
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Dashboard Capability:</strong> All questions 
                  above can be answered through interactive exploration of the KPI cards, time-series 
                  chart, rankings, and automated insights panel.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
