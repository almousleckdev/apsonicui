"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <>
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
      <ScrollToTop />
    </>
  );
};
