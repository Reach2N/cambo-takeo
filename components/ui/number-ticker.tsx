"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hasStarted, setHasStarted] = useState(false);

  const spring = useSpring(direction === "down" ? value : 0, {
    stiffness: 75,
    damping: 30,
    mass: 0.5,
  });

  const display = useTransform(spring, (current) =>
    `${prefix}${Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(current.toFixed(decimalPlaces)))}${suffix}`
  );

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(() => {
        spring.set(direction === "down" ? 0 : value);
        setHasStarted(true);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasStarted, delay, direction, spring, value]);

  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-block tabular-nums tracking-wider font-[family-name:var(--font-mono)]",
        className
      )}
    >
      {display}
    </motion.span>
  );
}
