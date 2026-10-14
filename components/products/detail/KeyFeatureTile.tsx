'use client';

import React from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import {
  ANIMATION_VARIANTS,
  ENTERPRISE_EASE,
  PREMIUM_SPRING,
  TILT_SPRING,
} from '@/lib/constants/animations';
import { cn } from '@/lib/utils';
import type { KeyFeatureItem } from '@/lib/data/product-detail';
import { FeatureValueBlock } from './FeatureTileCard';
import type { Align } from './FeatureTileCard';

interface KeyFeatureTileProps {
  item: KeyFeatureItem;
  index?: number;
  className?: string;
}

export const KeyFeatureTile: React.FC<KeyFeatureTileProps> = ({
  item,
  index = 0,
  className,
}) => {
  const reduceMotion = useReducedMotion();
  const { title, image, tall, layout, label, metric, text, highlight } = item;

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, TILT_SPRING);
  const rotateY = useSpring(rotateYRaw, TILT_SPRING);
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(255,255,255,0.06), transparent 60%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateYRaw.set((px - 0.5) * 5);
    rotateXRaw.set((py - 0.5) * -5);
    spotlightX.set(px * 100);
    spotlightY.set(py * 100);
  };

  const handlePointerLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  const titleLower = title.toLowerCase();
  const isEngine = titleLower === 'engine';
  const isFrame = titleLower === 'frame';
  const isHeadlights = titleLower === 'headlights';
  const isAbsorber = titleLower.includes('absorber');
  const isPedal = titleLower === 'pedal';

  const bottomAlign: Align = layout === 'bottom-right' ? 'right' : 'left';

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeUp}
      whileHover={reduceMotion ? {} : { y: -5, transition: PREMIUM_SPRING }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.08 },
        y: { ...PREMIUM_SPRING, delay: index * 0.08 },
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black transition-colors duration-500 hover:border-[#8DE029]/30 min-h-[190px] font-sans',
        tall ? 'aspect-auto sm:aspect-[467/635] sm:min-h-[420px]' : 'aspect-[1.58 / 1]',
        className
      )}
    >
      <motion.div
        aria-hidden
        style={{ background: spotlightBackground }}
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: ENTERPRISE_EASE, delay: index * 0.07 + 0.12 }}
        className="absolute inset-0 z-0 select-none pointer-events-none"
      >
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt={title}
            fill
            className={cn(
              'object-contain transition-transform duration-700 ease-out group-hover:scale-105',
              isEngine && 'p-0 translate-x-[5%] translate-y-[2%] scale-[1.35] sm:scale-[1.4]',
              isFrame && 'p-2 -translate-x-[2%] translate-y-[8%] scale-[1.35] sm:scale-[1.45]',
              isHeadlights && 'p-0 translate-x-[4%] translate-y-[4%] scale-[1.3] sm:scale-[1.35]',
              isAbsorber && 'p-0 translate-x-[2%] -translate-y-[2%] scale-[1.35] sm:scale-[1.4]',
              isPedal && 'p-1 translate-x-[4%] translate-y-[6%] scale-[1.3] sm:scale-[1.4]',
              !isEngine && !isFrame && !isHeadlights && !isAbsorber && !isPedal && 'p-4 scale-110 sm:scale-125'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </motion.div>

      <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 lg:p-6 pointer-events-none">
        {layout === 'inline-top' ? (
          <>
            <div>
              <FeatureValueBlock size="lg" metric={metric} text={text} highlight={highlight} />
              {label && (
                <span className="mt-1 block text-xs font-black uppercase text-white tracking-widest font-mono">
                  {label}
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider sm:text-base">
                {title}
              </h4>
            </div>
          </>
        ) : (
          <>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider sm:text-base">
                {title}
              </h4>
            </div>

            <div className={cn('flex flex-col', bottomAlign === 'right' && 'items-end')}>
              {label && (
                <span className="mb-1 block text-xs font-black uppercase text-white tracking-widest font-mono">
                  {label}
                </span>
              )}
              <FeatureValueBlock size="md" align={bottomAlign} metric={metric} text={text} highlight={highlight} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
