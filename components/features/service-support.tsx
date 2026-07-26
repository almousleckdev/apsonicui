"use client";

import React from "react";
import { useLocale } from "next-intl";
import { StoreQueryPanel } from "../service/StoreQueryPanel";
import { StoreListPanel } from "../service/StoreListPanel";
import { AfricaMapPanel } from "../service/AfricaMapPanel";
import { useServiceSupport } from "@/hooks/useServiceSupport";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

interface ServiceSupportProps {
  className?: string;
}

export const ServiceSupport: React.FC<ServiceSupportProps> = ({ className }) => {
  const locale = useLocale();
  const {
    queryType,
    setQueryType,
    searchTerm,
    selectedStore,
    setSelectedStore,
    selectedCountry,
    userLocation,
    userAddress,
    isLoadingLocation,
    locationError,
    filteredStores,
    handleSearchChange,
    handleCountrySelect,
  } = useServiceSupport();

  return (
    <section className={cn("w-full py-20 bg-white border-b border-zinc-100 relative z-10", className)}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-extrabold text-xs uppercase tracking-[0.25em] text-brand-green">
            {locale === "zh" ? "服务支持" : "Service & Support"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-zinc-950">
            {locale === "zh" ? "售后与网点查询" : "Find Service & Dealers"}
          </h2>
        </div>

        {/* Flat Map/Overlays Container */}
        <div className="relative w-full h-auto min-h-[580px] lg:h-[650px] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
          
          {/* 1. Map Panel (Full Background, hidden on mobile) */}
          <div className="absolute inset-0 z-0 hidden lg:block">
            <AfricaMapPanel
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
              userLocation={queryType === "nearby" ? userLocation : null}
              showOnlyUserLocation={queryType === "nearby"}
              className="w-full h-full"
              padding={{ left: 680, top: 40, bottom: 40, right: 40 }}
            />
          </div>

          {/* 2. Apple-like Vignette Shadow Over Map */}
          <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block bg-gradient-to-r from-zinc-950/40 via-transparent to-zinc-950/20" />

          {/* 3. Floating Overlays (Glassmorphic Sidebar stacked side-by-side) */}
          <div className="relative lg:absolute inset-y-0 left-0 z-20 flex flex-col md:flex-row h-full w-full lg:w-auto">
            
            {/* Panel 1: Query Options (Left sidebar) */}
            <div className="w-full md:w-[280px] shrink-0 bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-900/60 p-6 flex flex-col justify-between">
              <StoreQueryPanel
                queryType={queryType}
                onQueryTypeChange={setQueryType}
                className="bg-transparent text-white"
                variant="dark"
              />
            </div>

            {/* Panel 2: List Results (Middle sidebar) */}
            <div className="w-full md:w-[360px] shrink-0 bg-zinc-900/75 backdrop-blur-xl border-r border-zinc-900/60 p-6 flex flex-col max-h-[580px] lg:max-h-none overflow-y-auto">
              <StoreListPanel
                stores={filteredStores}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                selectedStoreId={selectedStore?.id}
                onStoreSelect={setSelectedStore}
                onCountrySearch={handleCountrySelect}
                selectedCountry={selectedCountry}
                queryType={queryType}
                userLocation={userLocation}
                userAddress={userAddress}
                isLoadingLocation={isLoadingLocation}
                locationError={locationError}
                className="bg-transparent text-white"
                variant="dark"
              />
            </div>

          </div>

          {/* Mobile Fallback Map Indicator */}
          <div className="lg:hidden w-full h-[300px] relative border-t border-zinc-800 bg-zinc-950">
            <AfricaMapPanel
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
              userLocation={queryType === "nearby" ? userLocation : null}
              showOnlyUserLocation={queryType === "nearby"}
              className="w-full h-full"
            />
          </div>

        </div>

        {/* Bottom Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-zinc-200 hover:border-brand-green hover:text-brand-green bg-white text-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            {locale === "zh" ? "了解售后服务" : "Learn More Services"}
          </Link>
        </div>

      </div>
    </section>
  );
};
