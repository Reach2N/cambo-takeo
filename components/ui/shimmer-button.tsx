"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(212, 175, 55, 0.3)",
      shimmerSize = "0.1em",
      shimmerDuration = "2.5s",
      borderRadius = "0.75rem",
      background = "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 font-semibold text-warm-black transition-all duration-300 hover:shadow-xl hover:shadow-gold/30 active:scale-[0.97]",
          className
        )}
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            borderRadius: borderRadius,
            background: background,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Shimmer sweep */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius }}
        >
          <div className="absolute inset-0 animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
