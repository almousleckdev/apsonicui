"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { KeyFeatureItem } from "@/lib/data/product-detail";

interface ProductKeyFeaturesProps {
  content?: KeyFeatureItem[];
}

export const ProductKeyFeatures: React.FC<ProductKeyFeaturesProps> = ({ content }) => {
  const reduceMotion = useReducedMotion();
  // The page puts the admin-uploaded performance image in the first key-feature item.
  const perfSrc = content?.[0]?.image || "/products/details/performance.jpg";

  return (
    <section className="isolate relative z-0 overflow-hidden bg-zinc-950 select-none border-t border-zinc-900 w-full">
      {/* Full width screen-spanning edge-to-edge layout with smooth scroll fade-up entrance */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-auto block"
      >
        <Image
          src={perfSrc}
          alt="APSONIC Performance Features"
          width={2000}
          height={1146}
          priority={false}
          className="w-full h-auto block object-contain"
          sizes="100vw"
        />
      </motion.div>
    </section>
  );
};
