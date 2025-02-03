"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { FileCode, ChevronRight, X, Minus, Square } from "lucide-react";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
});

const codeSnippet = `
import axios from 'axios';

async function getProjectData(projectId) {
  try {
    const response = await axios.get(\`https://api.yoursaas.com/projects/\${projectId}/data\`, {
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project data:', error);
    throw error;
  }
}

// Usage
const projectId = '12345';
getProjectData(projectId)
  .then(data => console.log('Project Data:', data))
  .catch(error => console.error('Error:', error.message));
`;

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

function Geometric3DShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
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
            "bg-gradient-to-r to-transparent from-emerald-500/[0.08]",
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

export default function DynamicVSCodeSection() {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = codeSnippet;
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-trainsparent to-zinc-800/[0.1] blur-3xl" />
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <Geometric3DShape
          width={600}
          height={140}
          rotate={12}
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <Geometric3DShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <Geometric3DShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
      </div> */}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          custom={0}
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <h2
            className={cn(
              "text-4xl sm:text-5xl font-bold mb-4 tracking-tighter",
              jetbrainsMono.className
            )}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
              Seamless Integration
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Transform your projects with our powerful API. Experience the
            simplicity of integration.
          </p>
        </motion.div>

        <motion.div
          custom={1}
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          <div className="bg-[#282a36] rounded-lg overflow-hidden shadow-2xl">
            {/* macOS-like window controls */}
            <div className="bg-[#44475a] px-4 py-2 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5555] hover:bg-[#ff6e6e] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#ffb86c] hover:bg-[#ffc985] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#50fa7b] hover:bg-[#69ff92] transition-colors" />
              </div>
              <span
                className={cn(
                  "text-sm text-[#f8f8f2]",
                  jetbrainsMono.className
                )}
              >
                project-data.js
              </span>
              <div className="w-3 h-3" /> {/* Spacer for alignment */}
            </div>
            <div className="flex">
              <div className="bg-[#21222c] w-48 p-2 hidden sm:block">
                <div className="flex items-center text-[#6272a4] mb-2 hover:bg-[#44475a] rounded px-2 py-1 transition-colors cursor-pointer">
                  <ChevronRight size={16} />
                  <span className="text-sm ml-1">src</span>
                </div>
                <div className="flex items-center text-[#f8f8f2] ml-4 hover:bg-[#44475a] rounded px-2 py-1 transition-colors cursor-pointer">
                  <FileCode size={14} className="mr-1" />
                  <span className="text-sm">project-data.js</span>
                </div>
              </div>
              <div className="flex-grow p-4 overflow-auto bg-[#282a36] max-h-[500px] scrollbar-thin scrollbar-thumb-[#44475a] scrollbar-track-[#282a36]">
                <pre
                  ref={codeRef}
                  className={cn(
                    "text-sm text-[#f8f8f2] whitespace-pre-wrap",
                    jetbrainsMono.className
                  )}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
