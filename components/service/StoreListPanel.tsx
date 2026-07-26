"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import type { Store } from "@/lib/types/store";
import type { StoreQueryType } from "./StoreQueryPanel";
import type { Coordinates, Address } from "@/lib/utils/geolocation";
import { MapPin, Search } from "lucide-react";
import { NearbyStores } from "./NearbyStores";
import { UserLocationDisplay } from "./UserLocationDisplay";
import { cn } from "@/lib/utils";

export interface StoreListPanelProps {
  stores: Store[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStoreId?: string;
  onStoreSelect?: (store: Store) => void;
  onCountrySearch?: (country: string) => void;
  selectedCountry?: string;
  queryType?: StoreQueryType | null;
  userLocation?: Coordinates | null;
  userAddress?: Address | null;
  isLoadingLocation?: boolean;
  locationError?: string | null;
  className?: string;
  variant?: "default" | "dark";
}

export const StoreListPanel: React.FC<StoreListPanelProps> = ({
  stores,
  searchTerm,
  onSearchChange,
  selectedStoreId,
  onStoreSelect,
  onCountrySearch,
  selectedCountry,
  queryType = null,
  userLocation,
  userAddress,
  isLoadingLocation = false,
  locationError,
  className,
  variant = "default",
}) => {
  const locale = useLocale();
  const isNearbyQuery = queryType === "nearby";
  const hasSearch = searchTerm.trim().length > 0 || isNearbyQuery;
  const hasResults = stores.length > 0;
  const showNearbyResults = isNearbyQuery && !isLoadingLocation && !locationError;
  const isDark = variant === "dark";

  // Quick Translations Map
  const labels: Record<string, Record<string, string>> = {
    zh: {
      searchCenter: "搜索中心",
      placeholder: "输入城市或网点...",
      nearbyOutlets: "附近网点",
      allOutlets: "全部网点",
      unableLocate: "无法自动定位",
      gettingGps: "正在获取您的GPS定位...",
      noOutletsNearby: "附近未找到APSONIC服务中心",
      noOutletsFound: "未找到符合条件的网点",
      tip: "请开启浏览器的定位服务，或直接使用国家筛选与搜索。"
    },
    en: {
      searchCenter: "Search Center",
      placeholder: "Enter city or store name...",
      nearbyOutlets: "Nearby Outlets",
      allOutlets: "All Outlets",
      unableLocate: "Unable to Auto-Locate",
      gettingGps: "Getting your GPS location...",
      noOutletsNearby: "No APSONIC service center found nearby",
      noOutletsFound: "No stores match your search",
      tip: "Please enable location services, or select a country to search."
    },
    fr: {
      searchCenter: "Centre de Recherche",
      placeholder: "Entrez la ville ou le magasin...",
      nearbyOutlets: "Points de Vente Proches",
      allOutlets: "Tous les Points de Vente",
      unableLocate: "Localisation Impossible",
      gettingGps: "Obtention de votre position GPS...",
      noOutletsNearby: "Aucun centre de service APSONIC trouvé à proximité",
      noOutletsFound: "Aucun point de vente trouvé",
      tip: "Veuillez activer la géolocalisation ou sélectionner un pays."
    }
  };

  const t = labels[locale] || labels.en;

  return (
    <div className={cn("h-full flex flex-col gap-6", className)}>
      {/* Search Input */}
      <div>
        <p className={cn("text-[10px] font-extrabold uppercase tracking-widest mb-3", isDark ? "text-zinc-500" : "text-zinc-400")}>
          {t.searchCenter}
        </p>
        <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60 focus-within:ring-2 focus-within:ring-brand-green/30 transition-all">
          <input
            type="text"
            placeholder={t.placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-xs px-10 py-3 outline-none"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green" />
        </div>
      </div>

      {/* List Header */}
      <AnimatePresence>
        {(hasSearch || isNearbyQuery) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <MapPin className="w-5 h-5 text-brand-green" />
            <h3 className={cn("font-bold text-base", isDark ? "text-white" : "text-zinc-950")}>
              {selectedCountry ? t.nearbyOutlets : t.allOutlets}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Geolocation Info */}
      {isNearbyQuery && userLocation && userAddress && (
        <UserLocationDisplay location={userLocation} address={userAddress} />
      )}

      {/* List Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 pr-1 scrollbar-hide">
        <AnimatePresence mode="wait">
          {isLoadingLocation ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-green border-t-transparent mb-3" />
              <p className="text-xs text-zinc-400 font-medium">{t.gettingGps}</p>
            </motion.div>
          ) : locationError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-xs text-red-400 leading-relaxed"
            >
              <p className="font-bold mb-1">{t.unableLocate}</p>
              <p className="text-zinc-500 mb-2">{locationError}</p>
              <p className="text-[10px] text-zinc-500">{t.tip}</p>
            </motion.div>
          ) : showNearbyResults && hasResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <NearbyStores
                stores={stores}
                country={selectedCountry}
                variant={variant}
              />
            </motion.div>
          ) : showNearbyResults && !hasResults ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-400 text-center italic"
            >
              {t.noOutletsNearby}
            </motion.div>
          ) : hasSearch && hasResults ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <NearbyStores
                stores={stores}
                country={selectedCountry}
                variant={variant}
              />
            </motion.div>
          ) : hasSearch && !hasResults ? (
            <motion.p
              key="no-search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-zinc-500 italic text-center py-6"
            >
              {t.noOutletsFound}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
