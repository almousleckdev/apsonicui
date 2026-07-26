"use client";

import React from "react";
import { useLocale } from "next-intl";
import type { Store } from "@/lib/types/store";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { StoreContactInfo } from "./StoreContactInfo";
import { formatDistance } from "@/lib/utils/geolocation";
import { getCountryFlag } from "@/lib/utils/country-flags";
import { cn } from "@/lib/utils";

export interface NearbyStoresProps {
  stores: Store[];
  country?: string;
  className?: string;
  variant?: "default" | "dark";
}

export const NearbyStores: React.FC<NearbyStoresProps> = ({
  stores,
  country,
  className,
  variant = "default",
}) => {
  const locale = useLocale();
  const isDark = variant === "dark";

  // Localization map
  const labels: Record<string, Record<string, string>> = {
    zh: {
      nearby: "附近商店",
      noStores: "未找到商店",
      official: "官方中心",
      nav: "开始导航"
    },
    en: {
      nearby: "Nearby Stores",
      noStores: "No stores found",
      official: "Official Hub",
      nav: "Navigate"
    },
    fr: {
      nearby: "Magasins Proches",
      noStores: "Aucun magasin trouvé",
      official: "Centre Officiel",
      nav: "S'y Rendre"
    }
  };

  const t = labels[locale] || labels.en;

  if (stores.length === 0) {
    return (
      <div className={className}>
        <h3 className={cn("font-bold mb-4 text-lg", isDark ? "text-white" : "text-zinc-950")}>
          {t.nearby}
        </h3>
        <p className={isDark ? "text-zinc-400 text-sm" : "text-zinc-500 text-sm"}>
          {country ? `${t.noStores} ( ${country} )` : t.noStores}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {country && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="text-xl">{getCountryFlag(country)}</span>
          <h3 className={cn("text-sm font-black uppercase tracking-wider", isDark ? "text-zinc-200" : "text-zinc-800")}>
            {country} {t.official}
          </h3>
        </div>
      )}

      <div className="space-y-4">
        {stores.map((store) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "p-5 rounded-2xl border transition-all duration-300 group flex flex-col gap-4",
              isDark
                ? "bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900/60"
                : "bg-white border-zinc-100 shadow-sm hover:shadow-md"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4.5 h-4.5 text-brand-green" />
                </div>
                <div>
                  <h4 className={cn("font-bold text-sm", isDark ? "text-zinc-100" : "text-zinc-900")}>
                    {store.name}
                  </h4>
                  <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/40 mt-1 inline-block">
                    {store.type === "dealer" ? "Dealer" : "Service"}
                  </span>
                </div>
              </div>
              {store.distance !== undefined && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 uppercase tracking-wider shrink-0">
                  {formatDistance(store.distance)}
                </span>
              )}
            </div>

            <p className={cn("text-xs leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>
              {store.address}
            </p>

            <div className={cn("pt-3 border-t", isDark ? "border-zinc-800/50" : "border-zinc-100")}>
              <StoreContactInfo store={store} />
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-bold text-[10px] uppercase tracking-widest text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 h-9 px-4 rounded-xl transition-all duration-200"
            >
              <Navigation className="w-3.5 h-3.5 mr-2 transform rotate-45" />
              {t.nav}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
