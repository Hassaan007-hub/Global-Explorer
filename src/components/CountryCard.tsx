import * as React from "react";
import { Country } from "@/src/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "motion/react";

interface CountryCardProps {
  country: Country;
  onClick: (country: Country) => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-none bg-white/50 backdrop-blur-sm"
        onClick={() => onClick(country)}
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={country.flags?.svg}
            alt={country.flags?.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <CardHeader className="p-6 pb-2">
          <h3 className="font-bold text-lg leading-tight truncate">
            {country.name.common}
          </h3>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Population:</span>{" "}
            {country.population?.toLocaleString() ?? "N/A"}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Region:</span>{" "}
            {country.region}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Capital:</span>{" "}
            {country.capital?.[0] || "N/A"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
