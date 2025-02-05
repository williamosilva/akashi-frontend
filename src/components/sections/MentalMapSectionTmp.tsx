"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUpVariants } from "@/animations/variation";
import { jetbrainsMono, montserrat } from "@/styles/fonts";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
  type: "computer" | "hub" | "cloud";
}

const MindMapSection = () => {
  const [isMobile, setIsMobile] = useState(false);
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

  const desktopNodes: Node[] = [
    {
      id: "comp1",
      label: "API",
      x: 30,
      y: 35,
      connections: ["hub"],
      type: "computer",
    },
    {
      id: "comp2",
      label: "Database",
      x: 30,
      y: 50,
      connections: ["hub"],
      type: "computer",
    },
    {
      id: "comp3",
      label: "Blog",
      x: 30,
      y: 65,
      connections: ["hub"],
      type: "computer",
    },
    {
      id: "hub",
      label: "Akashi",
      x: 50,
      y: 50,
      connections: ["comp4", "comp5", "comp6"],
      type: "hub",
    },
    {
      id: "comp5",
      label: "WebSite",
      x: 70,
      y: 50,
      connections: [],
      type: "computer",
    },
  ];

  const mobileNodes: Node[] = [
    {
      id: "comp1",
      label: "API",
      x: 12,
      y: 35,
      connections: ["hub"],
      type: "computer",
    },
    {
      id: "comp2",
      label: "Database",
      x: 12,
      y: 55,
      connections: ["hub"],
      type: "computer",
    },
    {
      id: "comp3",
      label: "Blog",
      x: 12,
      y: 75,
      connections: ["hub"],
      type: "computer",
    },
    {
      id: "hub",
      label: "Akashi",
      x: 50,
      y: 55,
      connections: ["comp4", "comp5", "comp6"],
      type: "hub",
    },
    {
      id: "comp5",
      label: "WebSite",
      x: 88,
      y: 55,
      connections: [],
      type: "computer",
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles(mobile);
    };

    const initializeParticles = (mobile: boolean) => {
      const nodes = mobile ? mobileNodes : desktopNodes;
      particlesRef.current = [];
      nodes.forEach((node) => {
        node.connections.forEach((connId) => {
          const connNode = nodes.find((n) => n.id === connId);
          if (connNode) {
            const particleCount = mobile ? 1 : 2;
            for (let i = 0; i < particleCount; i++) {
              particlesRef.current.push({
                x: node.x,
                y: node.y,
                progress: i * 0.5,
                path: [node, connNode],
                speed: mobile
                  ? 0.0005 + Math.random() * 0.0003
                  : 0.0003 + Math.random() * 0.0002,
                tailLength: mobile ? 0.05 : 0.1,
              });
            }
          }
        });
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

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
      const scale =
        Math.min(canvas.width, canvas.height) / (isMobile ? 500 : 1000);
      switch (node.type) {
        case "computer":
          ctx.beginPath();
          ctx.arc(x, y, 10 * scale, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(52, 211, 153, 0.8)";
          ctx.fill();
          const computerGlow = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            40 * scale
          );
          computerGlow.addColorStop(0, "rgba(52, 211, 153, 0.2)");
          computerGlow.addColorStop(1, "rgba(52, 211, 153, 0)");
          ctx.fillStyle = computerGlow;
          ctx.beginPath();
          ctx.arc(x, y, 100 * scale, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "hub":
          const time = performance.now() * 0.001;
          const pulseSize = Math.sin(time * 2) * 2 + 20 * scale;
          const hubGlow = ctx.createRadialGradient(x, y, 0, x, y, 50 * scale);
          hubGlow.addColorStop(0, "rgba(52, 211, 153, 0.5)");
          hubGlow.addColorStop(1, "rgba(52, 211, 153, 0)");
          ctx.fillStyle = hubGlow;
          ctx.beginPath();
          ctx.arc(x, y, 50 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(52, 211, 153, 1)";
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
          ctx.lineWidth = 0.5 * scale;
          ctx.beginPath();
          ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);
          ctx.stroke();
          break;
      }
      ctx.font = `${node.type === "hub" ? "bold " : ""}${13 * scale}px ${
        jetbrainsMono.style.fontFamily
      }`;
      ctx.fillStyle = "rgba(52, 211, 153, 0.9)";
      ctx.textAlign = "center";
      const labelOffset = node.type === "hub" ? 60 * scale : 35 * scale;
      ctx.fillText(node.label, x, y + labelOffset);
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = isMobile ? mobileNodes : desktopNodes;
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
            ctx.lineWidth = (2 * Math.min(canvas.width, canvas.height)) / 1000;
            ctx.stroke(path);
          }
        });
      });

      particlesRef.current.forEach((particle) => {
        particle.progress += particle.speed;
        if (particle.progress >= 1) particle.progress = 0;

        const [startNode, endNode] = particle.path;
        const startX = (startNode.x / 100) * canvas.width;
        const startY = (startNode.y / 100) * canvas.height;
        const endX = (endNode.x / 100) * canvas.width;
        const endY = (endNode.y / 100) * canvas.height;

        ctx.beginPath();
        const fadeDistance = 0.15;
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

            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
        }

        const baseOpacity = 0.8 - particle.progress * 0.5;
        const startFade = Math.min(particle.progress / fadeDistance, 1);
        const endFade = Math.min((1 - particle.progress) / fadeDistance, 1);
        const finalOpacity = baseOpacity * Math.min(startFade, endFade);

        ctx.strokeStyle = `rgba(52, 211, 153, ${finalOpacity})`;
        ctx.lineWidth =
          ((isMobile ? 3 : 2) * Math.min(canvas.width, canvas.height)) /
          (isMobile ? 500 : 1000);
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.shadowColor = `rgba(52, 211, 153, ${finalOpacity * 0.6})`;
        ctx.shadowBlur = (10 * Math.min(canvas.width, canvas.height)) / 1000;
        ctx.strokeStyle = `rgba(52, 211, 153, ${finalOpacity})`;
        ctx.lineWidth = (1 * Math.min(canvas.width, canvas.height)) / 1000;
        ctx.stroke();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      });

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
  }, [isMobile]);

  return (
    <section className="relative w-full h-screen flex flex-col mt-4">
      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center text-center mt-24 px-4">
        <motion.div
          custom={0}
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl w-full"
        >
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold mb-4 tracking-tighter",
              jetbrainsMono.className
            )}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
              Akashi Data Flow
            </span>
          </h2>

          <p
            className={cn(
              "text-zinc-400 text-base md:text-lg",
              montserrat.className
            )}
          >
            Seamlessly connect and transform data through our akashi cloud hub,
            enabling efficient communication between customers and services.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MindMapSection;
