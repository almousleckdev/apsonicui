"use client";

import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  once?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  duration = 1.5,
  suffix = "",
  prefix = "",
  className,
  once = true,
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once, amount: 0.5 });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const node = nodeRef.current;
      
      // Initialize with start value
      node.textContent = `${prefix}${from.toLocaleString()}${suffix}`;

      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          const formatted = Math.floor(value).toLocaleString();
          node.textContent = `${prefix}${formatted}${suffix}`;
        },
      });

      return () => controls.stop();
    }
  }, [isInView, from, to, duration, prefix, suffix]);

  return (
    <span className={`inline-grid ${className || ""}`}>
      {/* Invisible spacer to reserve the maximum layout width */}
      <span
        className="invisible col-start-1 row-start-1 font-mono tabular-nums whitespace-nowrap"
        aria-hidden="true"
      >
        {prefix}
        {to.toLocaleString()}
        {suffix}
      </span>
      {/* Visible animated counter */}
      <span
        ref={nodeRef}
        className="col-start-1 row-start-1 font-mono tabular-nums whitespace-nowrap"
      >
        {prefix}
        {from.toLocaleString()}
        {suffix}
      </span>
    </span>
  );
};
