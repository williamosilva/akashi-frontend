"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Geometric3DShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-emerald-500/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -100,
        rotate: rotate - 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.5 },
      }}
      className={cn("absolute perspective-1000", className)}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        animate={{
          rotateX: [0, 10, 0],
          rotateY: [0, 15, 0],
          rotateZ: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[1000px] border-2 border-emerald-500/10",
            "shadow-[0_8px_32px_0_rgba(52,211,153,0.1)]",
            "after:absolute after:inset-0",
            "after:bg-[radial-gradient(circle_at_80%_80%,rgba(52,211,153,0.2),transparent_70%)]",
            "clip-path-polygon"
          )}
          style={{
            transform: "translateZ(0px)",
          }}
        />

        {/* Additional front face glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(52,211,153,0.1) 0%, transparent 70%)",
            transform: "translateZ(2px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
