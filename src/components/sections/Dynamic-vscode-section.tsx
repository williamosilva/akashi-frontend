"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FileCode, ChevronRight } from "lucide-react";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { fadeInUpVariants } from "@/animations/variation";

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

export default function DynamicVSCodeSection() {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = codeSnippet;
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 -mt-44">
      <div className=" mx-auto px-4 md:px-6 relative z-10 h-full flex flex-col justify-center items-center ">
        <motion.div
          custom={0}
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl w-full mx-auto mb-12 text-center"
        >
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold mb-4 tracking-tighter",
              jetbrainsMono.className
            )}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
              Seamless Integration
            </span>
          </h2>

          <p
            className={cn(
              "text-zinc-400 text-base md:text-lg",
              montserrat.className
            )}
          >
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
