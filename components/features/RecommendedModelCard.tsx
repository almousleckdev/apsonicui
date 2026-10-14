'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';

interface RecommendedModelCardProps {
  currentModel: {
    id: string;
    name: string;
    image: string;
    href?: string;
    tagline?: string;
    colors?: { name: string; hex: string; image: string }[];
  };
  activeImage: string;
  direction: number;
  bikeVariants: any;
}

export const RecommendedModelCard: React.FC<RecommendedModelCardProps> = ({
  currentModel,
  activeImage,
  direction,
  bikeVariants,
}) => {
  return (
    <Link
      href={currentModel.href || '/products'}
      className="flex-1 h-full relative flex items-center justify-center cursor-pointer z-10 overflow-visible font-sans"
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.04] sm:opacity-[0.06] select-none">
        <div className="relative w-full h-full transform scale-110 sm:scale-125">
          <Image
            src="/images/brand/ALOBA底图 (1).png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="relative w-[90%] h-[90%] z-10 flex items-center justify-center overflow-visible">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={`${currentModel.id}_${activeImage}`}
            custom={direction}
            variants={bikeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={activeImage}
              alt={currentModel.name}
              fill
              className="object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:drop-shadow-[0_20px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </Link>
  );
};
