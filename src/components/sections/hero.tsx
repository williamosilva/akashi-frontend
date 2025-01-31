"use client";

import { motion } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
});

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMouseInCanvas = useRef(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { offsetWidth, offsetHeight } = canvasRef.current.parentElement!;
        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        });
        canvasRef.current.width = offsetWidth;
        canvasRef.current.height = offsetHeight;
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d")!;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      originalRadius: number;
    }> = [];

    const numNodes = 30;
    const connectionRadius = 150;
    const mouseRadius = 200;
    const mouseForce = 0.1;
    const nodeBaseRadius = 2;

    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: nodeBaseRadius,
        originalRadius: nodeBaseRadius,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => {
      isMouseInCanvas.current = true;
    };

    const handleMouseLeave = () => {
      isMouseInCanvas.current = false;
    };

    canvasRef.current.addEventListener("mousemove", handleMouseMove);
    canvasRef.current.addEventListener("mouseenter", handleMouseEnter);
    canvasRef.current.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update and draw nodes
      nodes.forEach((node) => {
        if (isMouseInCanvas.current) {
          // Calculate distance from mouse
          const dx = mousePosition.current.x - node.x;
          const dy = mousePosition.current.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Mouse interaction
          if (distance < mouseRadius) {
            // Increase node size when near mouse
            node.radius =
              node.originalRadius * (1 + (1 - distance / mouseRadius) * 1.2);

            // Add mouse force
            const angle = Math.atan2(dy, dx);
            const force = ((mouseRadius - distance) / mouseRadius) * mouseForce;
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
          } else {
            node.radius = node.originalRadius;
          }
        }

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;

        // Add slight friction
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Bounce off walls
        if (node.x <= 0 || node.x >= dimensions.width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(dimensions.width, node.x));
        }
        if (node.y <= 0 || node.y >= dimensions.height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(dimensions.height, node.y));
        }

        // Draw node with glow effect
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(52, 211, 153, 0.8)";
        ctx.fill();

        // Add glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          node.radius,
          node.x,
          node.y,
          node.radius * 2
        );
        gradient.addColorStop(0, "rgba(52, 211, 153, 0.3)");
        gradient.addColorStop(1, "rgba(52, 211, 153, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw connections
      nodes.forEach((nodeA, i) => {
        nodes.slice(i + 1).forEach((nodeB) => {
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            const opacity = 1 - distance / connectionRadius;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);

            // Create gradient for connection
            const gradient = ctx.createLinearGradient(
              nodeA.x,
              nodeA.y,
              nodeB.x,
              nodeB.y
            );
            gradient.addColorStop(0, `rgba(52, 211, 153, ${opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(52, 211, 153, ${opacity * 0.1})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = opacity * 1.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvasRef.current?.removeEventListener("mousemove", handleMouseMove);
      canvasRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      canvasRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dimensions]);

  return <canvas ref={canvasRef} className="absolute inset-0 " />;
}

function Geometric3DShape({
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
        {/* Main shape with enhanced gradient and glow */}
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

export default function AkashiHero() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-900">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-zinc-800/[0.1] blur-3xl" />
      <div className="absolute inset-0 overflow-hidden Z-[1]">
        <Geometric3DShape
          // delay={0.3}
          width={600}
          height={140}
          rotate={12}
          // gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          // lineCount={6}
          // lineSpacing={2}
          // lineThickness={2}
        />
        <Geometric3DShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          // gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          // lineCount={6}
          // lineSpacing={2}
          // lineThickness={2}
        />
        <Geometric3DShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          // gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          // lineCount={6}
          // lineSpacing={2}
          // lineThickness={2}
        />
        <Geometric3DShape
          delay={0.7}
          width={200}
          height={60}
          rotate={25}
          // gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          // lineCount={6}
          // lineSpacing={2}
          // lineThickness={2}
        />
        <Geometric3DShape
          delay={0.2}
          width={150}
          height={40}
          rotate={-45}
          // gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          // lineCount={6}
          // lineSpacing={2}
          // lineThickness={2}
        />
      </div>

      {/* Rest of the hero section remains the same */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.04),transparent_70%)]" />
      <div className="absolute inset-0 Z-0">
        <NetworkCanvas />
      </div>
      <div className="flex flex-col m-auto">
        <div className="relative z-10 container mx-auto px-4 md:px-6 pointer-events-none">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 border border-emerald-500/20 mb-8"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span
                className={cn(
                  "text-sm text-emerald-300/80 tracking-wide",
                  jetbrainsMono.className
                )}
              >
                Build • Connect • Transform
              </span>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1
                className={cn(
                  "text-5xl sm:text-7xl font-bold mb-6 tracking-tighter",
                  jetbrainsMono.className
                )}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-400">
                  Transform Your
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
                  Personal Projects
                </span>
              </h1>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-base sm:text-lg text-zinc-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                Connect and manage your project data dynamically. Update content
                seamlessly through our intuitive API, without touching your
                original codebase.
              </p>
            </motion.div>
          </div>
        </div>
        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex  z-10 relative flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="px-6 py-3 rounded-lg bg-emerald-500 text-zinc-900 font-medium hover:bg-emerald-400 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-lg bg-zinc-800 text-emerald-300 border border-emerald-500/20 hover:bg-zinc-700 transition-colors">
            View Documentation
          </button>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/90 pointer-events-none" />
    </div>
  );
}
