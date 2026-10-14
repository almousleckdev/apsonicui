"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ProductHeroContent } from "@/lib/data/product-detail";

interface ProductHeroProps {
  content: ProductHeroContent;
  productId: string;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ content }) => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll parallax: background image drifts slowly on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  const heroSrc = (content as any)?.heroImageUrl || content?.middle || "/products/details/producdetailhero.jpg";

  return (
    <section
      ref={sectionRef}
      className="isolate relative z-0 w-full overflow-hidden bg-zinc-950 pt-20"
    >
      {/* Background Image with Premium Zoom-In Entrance and Parallax Scroll */}
      <motion.div
        initial={reduceMotion ? false : { scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: reduceMotion ? 0 : imageY, opacity: contentOpacity }}
        className="relative w-full h-auto block z-0"
      >
        <Image
          src={heroSrc}
          alt="APSONIC Product Hero"
          width={2000}
          height={1023}
          priority
          loading="eager"
          className="w-full h-auto block object-contain"
          sizes="100vw"
        />
      </motion.div>

      {/* Subtle overlays matching the layout */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
    </section>
  );
};
