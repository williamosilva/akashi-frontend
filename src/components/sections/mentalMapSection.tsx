"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
}

const nodes: Node[] = [
  // Data Sources (Left)
  { id: "api", label: "API Integration", x: 20, y: 30, connections: ["hub"] },
  { id: "data", label: "Data Sources", x: 20, y: 50, connections: ["hub"] },
  { id: "blog", label: "Blog Engine", x: 20, y: 70, connections: ["hub"] },

  // Central Hub (Center)
  { id: "hub", label: "Akashi", x: 50, y: 50, connections: ["final"] },

  // Final Target (Right)
  { id: "final", label: "Final Application", x: 80, y: 50, connections: [] },
];

const MindMapSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    Array<{ x: number; y: number; progress: number; path: [Node, Node] }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles with fewer particles for slower appearance
    nodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const connNode = nodes.find((n) => n.id === connId);
        if (connNode) {
          // Create fewer particles with more spacing
          for (let i = 0; i < 2; i++) {
            particlesRef.current.push({
              x: node.x,
              y: node.y,
              progress: i * 0.5, // More spread out initial positions
              path: [node, connNode],
            });
          }
        }
      });
    });

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections with bezier curves
      nodes.forEach((node) => {
        node.connections.forEach((connId) => {
          const connNode = nodes.find((n) => n.id === connId);
          if (connNode) {
            const startX = (node.x / 100) * canvas.width;
            const startY = (node.y / 100) * canvas.height;
            const endX = (connNode.x / 100) * canvas.width;
            const endY = (connNode.y / 100) * canvas.height;

            // Draw smooth bezier curve
            ctx.beginPath();
            ctx.moveTo(startX, startY);

            // Control points for smooth curve
            const controlX1 = startX + (endX - startX) * 0.5;
            const controlY1 = startY;
            const controlX2 = startX + (endX - startX) * 0.5;
            const controlY2 = endY;

            ctx.bezierCurveTo(
              controlX1,
              controlY1,
              controlX2,
              controlY2,
              endX,
              endY
            );
            ctx.strokeStyle = "rgba(52, 211, 153, 0.15)";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Slower particle movement
        particle.progress += 0.0008;
        if (particle.progress >= 1) particle.progress = 0;

        const [startNode, endNode] = particle.path;
        const startX = (startNode.x / 100) * canvas.width;
        const startY = (startNode.y / 100) * canvas.height;
        const endX = (endNode.x / 100) * canvas.width;
        const endY = (endNode.y / 100) * canvas.height;

        // Calculate position along bezier curve
        const t = particle.progress;
        const controlX1 = startX + (endX - startX) * 0.5;
        const controlY1 = startY;
        const controlX2 = startX + (endX - startX) * 0.5;
        const controlY2 = endY;

        // Bezier curve formula
        const cx =
          Math.pow(1 - t, 3) * startX +
          3 * Math.pow(1 - t, 2) * t * controlX1 +
          3 * (1 - t) * Math.pow(t, 2) * controlX2 +
          Math.pow(t, 3) * endX;
        const cy =
          Math.pow(1 - t, 3) * startY +
          3 * Math.pow(1 - t, 2) * t * controlY1 +
          3 * (1 - t) * Math.pow(t, 2) * controlY2 +
          Math.pow(t, 3) * endY;

        // Larger, softer particles
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(52, 211, 153, 0.6)";
        ctx.fill();

        // Enhanced glow effect
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6);
        gradient.addColorStop(0, "rgba(52, 211, 153, 0.4)");
        gradient.addColorStop(1, "rgba(52, 211, 153, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes with enhanced glow
      nodes.forEach((node) => {
        const x = (node.x / 100) * canvas.width;
        const y = (node.y / 100) * canvas.height;

        // Enhanced node glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
        gradient.addColorStop(0, "rgba(52, 211, 153, 0.25)");
        gradient.addColorStop(1, "rgba(52, 211, 153, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();

        // Special treatment for hub node (Akashi)
        if (node.id === "hub") {
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(52, 211, 153, 0.9)";
          ctx.fill();

          const hubGradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
          hubGradient.addColorStop(0, "rgba(52, 211, 153, 0.5)");
          hubGradient.addColorStop(1, "rgba(52, 211, 153, 0)");
          ctx.fillStyle = hubGradient;
          ctx.beginPath();
          ctx.arc(x, y, 50, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(52, 211, 153, 0.8)";
          ctx.fill();
        }

        // Enhanced node label
        ctx.font = `${node.id === "hub" ? "bold " : ""}13px system-ui`;
        ctx.fillStyle = "rgba(52, 211, 153, 0.9)";
        ctx.textAlign = "center";
        ctx.fillText(node.label, x, y + 30);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-zinc-800/[0.15] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-16 z-10"
      >
        <h2 className="text-4xl font-bold mb-4 tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
            Unified Data Flow
          </span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto px-4">
          Connect and transform data from multiple sources through our central
          hub, delivering seamlessly formatted outputs for your frontend
          applications.
        </p>
      </motion.div>

      <div className="relative w-full h-[600px]">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/90 pointer-events-none" />
    </section>
  );
};

export default MindMapSection;
