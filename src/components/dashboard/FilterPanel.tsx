import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, RefreshCw } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useState } from 'react';

export function FilterPanel() {
  const {
    filters,
    updateFilters,
    resetFilters,
    availableYears,
    availableCountries,
  } = useDashboard();

  const [countrySearch, setCountrySearch] = useState('');

  const handleYearChange = (value: number[]) => {
    updateFilters({ selectedYear: value[0] });
  };

  const handleCountryToggle = (country: string) => {
    const selected = filters.selectedCountries.includes(country);
    if (selected) {
      updateFilters({
        selectedCountries: filters.selectedCountries.filter((c) => c !== country),
      });
    } else {
      updateFilters({
        selectedCountries: [...filters.selectedCountries, country],
      });
    }
  };

  const filteredCountries = availableCountries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Filters & Controls</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Year Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Year: {filters.selectedYear}</Label>
          </div>
          <Slider
            value={[filters.selectedYear]}
            onValueChange={handleYearChange}
            min={availableYears[0] || 2000}
            max={availableYears[availableYears.length - 1] || 2023}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{availableYears[0]}</span>
            <span>{availableYears[availableYears.length - 1]}</span>
          </div>
        </div>

        {/* Log Scale Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="log-scale" className="text-sm font-medium">
            Logarithmic Scale
          </Label>
          <Switch
            id="log-scale"
            checked={filters.logScale}
            onCheckedChange={(checked) => updateFilters({ logScale: checked })}
          />
        </div>

        {/* Selected Countries */}
        {filters.selectedCountries.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Selected Countries ({filters.selectedCountries.length})
            </Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filters.selectedCountries.map((country) => (
                <Badge
                  key={country}
                  variant="secondary"
                  className="gap-1 pr-1.5"
                >
                  {country}
                  <button
                    onClick={() => handleCountryToggle(country)}
                    className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Country Search */}
        <div className="space-y-2">
          <Label htmlFor="country-search" className="text-sm font-medium">
            Add Countries
          </Label>
          <input
            id="country-search"
            type="text"
            placeholder="Search countries..."
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="max-h-48 overflow-y-auto border border-border rounded-md">
            {filteredCountries.map((country) => (
              <button
                key={country}
                onClick={() => handleCountryToggle(country)}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${
                  filters.selectedCountries.includes(country)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
