"use client";

import { useEffect, useRef, useState } from "react";

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [numNodes, setNumNodes] = useState(30);
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

        setNumNodes(offsetWidth < 800 ? 10 : 30);
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

    const connectionRadius = 150;
    const mouseRadius = 200;
    const mouseForce = 0.1;
    const nodeBaseRadius = 2;

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

      nodes.forEach((node) => {
        if (isMouseInCanvas.current) {
          const dx = mousePosition.current.x - node.x;
          const dy = mousePosition.current.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            node.radius =
              node.originalRadius * (1 + (1 - distance / mouseRadius) * 1.2);

            const angle = Math.atan2(dy, dx);
            const force = ((mouseRadius - distance) / mouseRadius) * mouseForce;
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
          } else {
            node.radius = node.originalRadius;
          }
        }

        node.x += node.vx;
        node.y += node.vy;

        node.vx *= 0.99;
        node.vy *= 0.99;

        if (node.x <= 0 || node.x >= dimensions.width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(dimensions.width, node.x));
        }
        if (node.y <= 0 || node.y >= dimensions.height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(dimensions.height, node.y));
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(52, 211, 153, 0.8)";
        ctx.fill();

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
  }, [dimensions, numNodes]);

  return <canvas ref={canvasRef} className="absolute inset-0 " />;
}
