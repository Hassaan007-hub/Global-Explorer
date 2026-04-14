import { Country } from "@/src/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, MapPin, Users, Languages, Landmark, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { getCountriesByCodes } from "@/src/lib/api";

interface CountryDialogProps {
  country: Country | null;
  isOpen: boolean;
  onClose: () => void;
  onBorderClick: (country: Country) => void;
}

export function CountryDialog({ country, isOpen, onClose, onBorderClick }: CountryDialogProps) {
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);

  useEffect(() => {
    if (country?.borders && country.borders.length > 0) {
      getCountriesByCodes(country.borders).then((countries) => {
        setBorderCountries(countries);
        // Preload flags for border countries
        countries.forEach((border) => {
          if (border.flags?.svg) {
            const img = new Image();
            img.src = border.flags.svg;
          }
        });
      });
    } else {
      setBorderCountries([]);
    }
  }, [country]);

  if (!country) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden border-none bg-white/95 backdrop-blur-md">
        <ScrollArea className="h-full max-h-[90vh]">
          <div className="relative">
            <img
              src={country.flags?.svg}
              alt={country.flags?.alt}
              className="w-full aspect-video object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <DialogHeader>
                <DialogTitle className="text-3xl md:text-4xl font-bold mb-2">
                  {country.name.common}
                </DialogTitle>
                <p className="text-lg opacity-90 font-medium">
                  {country.name.official}
                </p>
              </DialogHeader>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold">Region</p>
                    <p className="text-foreground font-medium">{country.region} ({country.subregion})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Landmark className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold">Capital</p>
                    <p className="text-foreground font-medium">{country.capital?.[0] || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold">Population</p>
                    <p className="text-foreground font-medium">{country.population?.toLocaleString() ?? "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Languages className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold">Languages</p>
                    <p className="text-foreground font-medium">
                      {Object.values(country.languages || {}).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Coins className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold">Currencies</p>
                    <p className="text-foreground font-medium">
                      {Object.values(country.currencies || {})
                        .map((c) => `${c.name} (${c.symbol})`)
                        .join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold">Top Level Domain</p>
                    <p className="text-foreground font-medium">{country.tld?.join(", ") || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {borderCountries.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  Border Countries
                </p>
                <div className="flex flex-wrap gap-2">
                  {borderCountries.map((border) => (
                    <Badge
                      key={border.cca3}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
                      onClick={() => onBorderClick(border)}
                    >
                      {border.name.common}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-4">
              {country.maps?.googleMaps && (
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View on Google Maps
                </a>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
