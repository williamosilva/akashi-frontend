"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Atom } from "lucide-react";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
  type: "computer" | "hub" | "cloud";
}

const nodes: Node[] = [
  // Computers (Left and Right)
  {
    id: "comp1",
    label: "API",
    x: 15,
    y: 20,
    connections: ["hub"],
    type: "computer",
  },
  {
    id: "comp2",
    label: "Database",
    x: 15,
    y: 50,
    connections: ["hub"],
    type: "computer",
  },
  {
    id: "comp3",
    label: "Blog",
    x: 15,
    y: 80,
    connections: ["hub"],
    type: "computer",
  },
  // Central Hub
  {
    id: "hub",
    label: "Akashi",
    x: 50,
    y: 50,
    connections: ["comp4", "comp5", "comp6"],
    type: "hub",
  },
  // Right side computers

  {
    id: "comp5",
    label: "WebSite",
    x: 85,
    y: 50,
    connections: [],
    type: "computer",
  },
];

const MindMapSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      progress: number;
      path: [Node, Node];
      speed: number;
      tailLength: number;
    }>
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

    // Initialize particles with tail length
    nodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const connNode = nodes.find((n) => n.id === connId);
        if (connNode) {
          for (let i = 0; i < 2; i++) {
            particlesRef.current.push({
              x: node.x,
              y: node.y,
              progress: i * 0.5,
              path: [node, connNode],
              speed: 0.0003 + Math.random() * 0.0002,
              tailLength: 0.1, // Length of the trailing effect (0-1)
            });
          }
        }
      });
    });

    // Helper function to create curved path
    const createCurvedPath = (
      startX: number,
      startY: number,
      endX: number,
      endY: number
    ) => {
      const path = new Path2D();
      const controlPointOffset = Math.abs(endX - startX) * 0.5;

      path.moveTo(startX, startY);
      path.bezierCurveTo(
        startX + controlPointOffset,
        startY,
        endX - controlPointOffset,
        endY,
        endX,
        endY
      );

      return path;
    };

    // Helper function to get point along curved path
    const getPointOnCurve = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      progress: number
    ) => {
      const t = progress;
      const controlPointOffset = Math.abs(endX - startX) * 0.5;

      const x =
        Math.pow(1 - t, 3) * startX +
        3 * Math.pow(1 - t, 2) * t * (startX + controlPointOffset) +
        3 * (1 - t) * Math.pow(t, 2) * (endX - controlPointOffset) +
        Math.pow(t, 3) * endX;

      const y =
        Math.pow(1 - t, 3) * startY +
        3 * Math.pow(1 - t, 2) * t * startY +
        3 * (1 - t) * Math.pow(t, 2) * endY +
        Math.pow(t, 3) * endY;

      return { x, y };
    };
    const drawNode = (x: number, y: number, node: Node) => {
      switch (node.type) {
        case "computer":
          // Computer node
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(52, 211, 153, 0.8)";
          ctx.fill();

          // Glow effect
          const computerGlow = ctx.createRadialGradient(x, y, 0, x, y, 40);
          computerGlow.addColorStop(0, "rgba(52, 211, 153, 0.3)");
          computerGlow.addColorStop(1, "rgba(52, 211, 153, 0)");
          ctx.fillStyle = computerGlow;
          ctx.beginPath();
          ctx.arc(x, y, 40, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "hub":
          const time = performance.now() * 0.001;
          const pulseSize = Math.sin(time * 2) * 2 + 20;

          // Fundo do hub com leve glow
          const hubGlow = ctx.createRadialGradient(x, y, 0, x, y, 50);
          hubGlow.addColorStop(0, "rgba(52, 211, 153, 0.6)");
          hubGlow.addColorStop(1, "rgba(52, 211, 153, 0)");

          ctx.fillStyle = hubGlow;
          ctx.beginPath();
          ctx.arc(x, y, 50, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo do hub
          ctx.fillStyle = "rgba(52, 211, 153, 1)";
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fill();

          // Linha orbital discreta
          ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(x, y, 35, 0, Math.PI * 2);
          ctx.stroke();

          break;
      }

      // Node label
      // Node label
      ctx.font = `${node.type === "hub" ? "bold " : ""}13px system-ui`;
      ctx.fillStyle = "rgba(52, 211, 153, 0.9)";
      ctx.textAlign = "center";

      // Ajuste a posição apenas se for "hub"
      const labelOffset = node.type === "hub" ? 60 : 35;

      ctx.fillText(node.label, x, y + labelOffset);
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid background
      const gridSize = 80;
      ctx.strokeStyle = "rgba(52, 211, 153, 0.05)";
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw curved connections
      nodes.forEach((node) => {
        node.connections.forEach((connId) => {
          const connNode = nodes.find((n) => n.id === connId);
          if (connNode) {
            const startX = (node.x / 100) * canvas.width;
            const startY = (node.y / 100) * canvas.height;
            const endX = (connNode.x / 100) * canvas.width;
            const endY = (connNode.y / 100) * canvas.height;

            const path = createCurvedPath(startX, startY, endX, endY);
            ctx.strokeStyle = "rgba(52, 211, 153, 0.2)";
            ctx.lineWidth = 2;
            ctx.stroke(path);
          }
        });
      });

      // Update and draw particles with tail effect
      particlesRef.current.forEach((particle) => {
        particle.progress += particle.speed;
        if (particle.progress >= 1) particle.progress = 0;

        const [startNode, endNode] = particle.path;
        const startX = (startNode.x / 100) * canvas.width;
        const startY = (startNode.y / 100) * canvas.height;
        const endX = (endNode.x / 100) * canvas.width;
        const endY = (endNode.y / 100) * canvas.height;

        // Draw glowing trail with fade near nodes
        ctx.beginPath();
        const fadeDistance = 0.15; // Distance from nodes where fade starts

        for (let i = 0; i < 10; i++) {
          const trailProgress =
            particle.progress - i * (particle.tailLength / 10);
          if (trailProgress >= 0) {
            const point = getPointOnCurve(
              startX,
              startY,
              endX,
              endY,
              trailProgress
            );

            // Calculate fade based on proximity to start and end nodes
            const startFade = Math.min(trailProgress / fadeDistance, 1);
            const endFade = Math.min((1 - trailProgress) / fadeDistance, 1);
            const fadeOpacity = Math.min(startFade, endFade);

            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
        }

        // Apply the fade effect to the stroke
        const baseOpacity = 0.8 - particle.progress * 0.5;
        const startFade = Math.min(particle.progress / fadeDistance, 1);
        const endFade = Math.min((1 - particle.progress) / fadeDistance, 1);
        const finalOpacity = baseOpacity * Math.min(startFade, endFade);

        ctx.strokeStyle = `rgba(52, 211, 153, ${finalOpacity})`;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Add glow effect with fade
        ctx.shadowColor = `rgba(52, 211, 153, ${finalOpacity * 0.6})`;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = `rgba(52, 211, 153, ${finalOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      });

      // Draw nodes last so they appear on top
      nodes.forEach((node) => {
        const x = (node.x / 100) * canvas.width;
        const y = (node.y / 100) * canvas.height;
        drawNode(x, y, node);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-zinc-900">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-zinc-800/[0.15] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-16 z-10"
      >
        <h2 className="text-4xl font-bold mb-4 tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
            Akashi Data Flow
          </span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto px-4">
          Seamlessly connect and transform data through our akashi cloud hub,
          enabling efficient communication between customers and services.
        </p>
      </motion.div>

      <div className="relative w-full h-[1000px]">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900/90 pointer-events-none" />
    </section>
  );
};

export default MindMapSection;
