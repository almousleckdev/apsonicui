"use client";

import React from "react";
import type { Store } from "@/lib/types/store";
import { Phone, Mail, Clock } from "lucide-react";

interface StoreContactInfoProps {
  store: Store;
}

export const StoreContactInfo: React.FC<StoreContactInfoProps> = ({ store }) => {
  return (
    <div className="space-y-2 text-zinc-400 text-xs">
      {store.phone && (
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-zinc-500" />
          <a href={`tel:${store.phone}`} className="text-brand-green hover:underline font-medium">
            {store.phone}
          </a>
        </div>
      )}

      {store.email && (
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-zinc-500" />
          <a href={`mailto:${store.email}`} className="text-brand-green hover:underline font-medium">
            {store.email}
          </a>
        </div>
      )}

      {store.workingHours && (
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <p className="text-zinc-400">
            {store.workingHours}
          </p>
        </div>
      )}
    </div>
  );
};
