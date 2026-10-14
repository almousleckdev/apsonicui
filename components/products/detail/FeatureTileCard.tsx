'use client';

import React, { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export const CountUp: React.FC<{ to: number; className?: string }> = ({ to, className }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const node = nodeRef.current;
      node.textContent = '0';
      const controls = animate(0, to, {
        duration: 1.4,
        ease: 'easeOut',
        onUpdate(value) {
          node.textContent = Math.floor(value).toString();
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return (
    <span ref={nodeRef} className={className}>
      0
    </span>
  );
};

export type Align = 'left' | 'right';

interface RenderValueBlockProps {
  size: 'lg' | 'md';
  align?: Align;
  metric?: { value: number; unit: string; suffix?: string };
  text?: string;
  highlight?: { lines: string[]; trail: string };
}

export const FeatureValueBlock: React.FC<RenderValueBlockProps> = ({
  size,
  align = 'left',
  metric,
  text,
  highlight,
}) => {
  if (metric) {
    return (
      <div className={cn('flex items-baseline select-none leading-none font-sans', align === 'right' && 'justify-end')}>
        <CountUp
          to={metric.value}
          className={cn(
            'font-black leading-none text-[#8DE029] tracking-tight font-mono',
            size === 'lg' ? 'text-6xl sm:text-7xl lg:text-[80px]' : 'text-4xl sm:text-5xl lg:text-6xl'
          )}
        />
        <span
          className={cn(
            'font-extrabold leading-none text-[#8DE029] ml-0.5',
            size === 'lg' ? 'text-2xl sm:text-3xl lg:text-[34px]' : 'text-lg sm:text-xl lg:text-2xl'
          )}
        >
          {metric.unit}
        </span>
        {metric.suffix && (
          <span className="ml-1 text-lg font-bold leading-none text-[#8DE029] sm:text-xl lg:text-2xl select-none">
            {metric.suffix}
          </span>
        )}
      </div>
    );
  }

  if (text) {
    return (
      <span
        className={cn(
          'block text-2xl font-black text-[#8DE029] sm:text-3xl lg:text-4xl uppercase tracking-wider font-sans',
          align === 'right' && 'text-right'
        )}
      >
        {text}
      </span>
    );
  }

  if (highlight) {
    return (
      <div className={cn('leading-tight font-sans', align === 'right' && 'text-right')}>
        {highlight.lines.map((line) => (
          <p key={line} className="text-xl font-extrabold text-[#8DE029] sm:text-2xl lg:text-3xl uppercase leading-none pb-1">
            {line}
          </p>
        ))}
        <p className="mt-1 text-xs text-white/90 font-semibold sm:text-sm uppercase tracking-wide">
          {highlight.trail}
        </p>
      </div>
    );
  }

  return null;
};
