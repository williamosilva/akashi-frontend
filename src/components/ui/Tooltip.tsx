"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  tooltipClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className,
  tooltipClassName,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newPosition = position;
      let top = 0;
      let left = 0;

      if (position === "left" && triggerRect.left < tooltipRect.width) {
        newPosition = "right";
      } else if (
        position === "right" &&
        triggerRect.right + tooltipRect.width > viewportWidth
      ) {
        newPosition = "left";
      } else if (position === "top" && triggerRect.top < tooltipRect.height) {
        newPosition = "bottom";
      } else if (
        position === "bottom" &&
        triggerRect.bottom + tooltipRect.height > viewportHeight
      ) {
        newPosition = "top";
      }

      switch (newPosition) {
        case "top":
          top = triggerRect.top - tooltipRect.height - 8;
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + 8;
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - 16; // Aumentado de 8 para 16
          break;
        case "right":
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + 8;
          break;
      }

      // Adjust if tooltip is going off-screen
      if (left < 0) left = 8;
      if (left + tooltipRect.width > viewportWidth)
        left = viewportWidth - tooltipRect.width - 8;
      if (top < 0) top = 8;
      if (top + tooltipRect.height > viewportHeight)
        top = viewportHeight - tooltipRect.height - 8;

      setTooltipPosition({ top, left });
      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={tooltipRef}
              className={cn(
                "fixed z-50 px-2 py-1 text-xs text-zinc-100 bg-zinc-800 rounded-md shadow-lg max-w-xs break-words",
                tooltipClassName
              )}
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                {content}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-500/0 to-transparent rounded-md" />
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export const TooltipRoot = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const TooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};
