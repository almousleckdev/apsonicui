"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Coordinates, Address } from "@/lib/utils/geolocation";
import { MapPin } from "lucide-react";

interface UserLocationDisplayProps {
  location: Coordinates;
  address: Address;
  className?: string;
}

export const UserLocationDisplay: React.FC<UserLocationDisplayProps> = ({
  location,
  address,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`mb-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 ${className || ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-brand-green" />
        <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">
          Your Location:
        </span>
      </div>
      {address.address && address.address !== address.fullAddress && (
        <p className="text-xs text-zinc-300 font-medium mb-1 pl-6">
          {address.address}
        </p>
      )}
      <p className="text-xs text-zinc-300 font-medium pl-6">
        {address.city !== "Unknown" && address.city}, {address.country}
      </p>
      <p className="text-[10px] text-zinc-500 font-bold font-mono pl-6 mt-1">
        {location.lat.toFixed(4)}&deg;N, {location.lng.toFixed(4)}&deg;E
      </p>
    </motion.div>
  );
};
