"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const SiteLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(10);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  // 1. Initial page load loading (kept for a bit longer: 1.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 8;
      });
    }, 100);

    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        isInitialMount.current = false;
      }, 250);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // 2. Hide loader once language changes/route transitions finish (no loading on standard page links)
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    setProgress(100);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // 3. Custom Event Listeners for manual loader triggers (e.g. language selection click)
  useEffect(() => {
    const handleShow = () => {
      setIsLoading(true);
      setProgress(15);
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 12, 95));
      }, 60);
      return () => clearInterval(interval);
    };

    window.addEventListener("show-site-loader", handleShow);

    return () => {
      window.removeEventListener("show-site-loader", handleShow);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center pointer-events-auto select-none"
        >
          {/* Top Progress bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900">
            <motion.div
              className="h-full bg-brand-green shadow-[0_0_8px_#1fa84f]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* Pulsing Logo */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{
                scale: [0.95, 1.02, 0.95],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-[180px] h-[30px]"
            >
              <Image
                src="/images/logo/apsoniclogo.png"
                alt="APSONIC"
                fill
                sizes="(max-width: 768px) 180px, 180px"
                className="object-contain filter brightness-[10]"
                priority
              />
            </motion.div>

            {/* Glowing micro-indicator */}
            <div className="flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-brand-green"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
