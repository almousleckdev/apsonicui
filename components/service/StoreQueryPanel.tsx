"use client";

import React from "react";
import { useLocale } from "next-intl";
import { RadioOption } from "./RadioOption";
import { SERVICE_CONFIG } from "@/lib/constants/service";
import { cn } from "@/lib/utils";

export type StoreQueryType = "pickup" | "nearby";

export interface StoreQueryPanelProps {
  queryType: StoreQueryType | null;
  onQueryTypeChange: (type: StoreQueryType | null) => void;
  className?: string;
  variant?: "default" | "dark";
}

export const StoreQueryPanel: React.FC<StoreQueryPanelProps> = ({
  queryType,
  onQueryTypeChange,
  className,
  variant = "default",
}) => {
  const locale = useLocale();
  const isDark = variant === "dark";

  // Localization map
  const labels: Record<string, Record<string, string>> = {
    zh: {
      panelTitle: "门店查询",
      nearby: "附近门店"
    },
    en: {
      panelTitle: "Store Locator",
      nearby: "Show Nearby Stores"
    },
    fr: {
      panelTitle: "Localisateur",
      nearby: "Trouver points proches"
    }
  };

  const t = labels[locale] || labels.en;

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <h3 className={cn("mb-6 text-sm font-black uppercase tracking-[0.2em]", isDark ? "text-zinc-400" : "text-zinc-500")}>
        {t.panelTitle}
      </h3>

      <div className="flex flex-col gap-5">
        <RadioOption
          value={SERVICE_CONFIG.queryTypes.nearby}
          label={t.nearby}
          checked={queryType === SERVICE_CONFIG.queryTypes.nearby}
          onChange={() => {
            if (queryType === SERVICE_CONFIG.queryTypes.nearby) {
              onQueryTypeChange(null);
            } else {
              onQueryTypeChange(SERVICE_CONFIG.queryTypes.nearby);
            }
          }}
          name="queryType"
          textColor={isDark ? "rgba(255,255,255,0.85)" : undefined}
        />
      </div>
    </div>
  );
};
