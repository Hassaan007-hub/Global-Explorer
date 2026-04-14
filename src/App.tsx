/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from "react";
import { Country } from "./types";
import { getAllCountries, getCountryByCode } from "./lib/api";
import { CountryCard } from "./components/CountryCard";
import { CountryDialog } from "./components/CountryDialog";
import { RegionFilter } from "./components/RegionFilter";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Globe2, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountryClick = async (country: Country) => {
    // Set the partial data immediately for a responsive feel
    setSelectedCountry(country);
    try {
      // Fetch full details including TLD and Maps which are not in the list view
      const fullCountry = await getCountryByCode(country.cca3);
      setSelectedCountry(fullCountry);
    } catch (err) {
      console.error("Failed to fetch full country details:", err);
    }
  };

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCountries();
      // Sort alphabetically by common name
      setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
    } catch (err) {
      setError("Failed to load countries. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        country.capital?.[0]?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === "All" || country.region === selectedRegion;
      
      return matchesSearch && matchesRegion;
    });
  }, [countries, searchQuery, selectedRegion]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <Globe2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              Global Explorer
            </h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span>{filteredCountries.length} Countries</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search for a country or capital..."
              className="pl-12 h-12 bg-white/50 backdrop-blur-sm border-none shadow-sm focus-visible:ring-primary text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <RegionFilter value={selectedRegion} onChange={setSelectedRegion} />
        </div>

        {/* Content */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-medium mb-4">{error}</p>
            <Button onClick={fetchCountries} variant="outline" className="gap-2">
              <RefreshCcw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))
              ) : filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <CountryCard
                    key={country.cca3}
                    country={country}
                    onClick={handleCountryClick}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <p className="text-xl font-medium text-muted-foreground">
                    No countries found matching your criteria.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Detail Dialog */}
      <CountryDialog
        country={selectedCountry}
        isOpen={!!selectedCountry}
        onClose={() => setSelectedCountry(null)}
        onBorderClick={handleCountryClick}
      />
    </div>
  );
}

