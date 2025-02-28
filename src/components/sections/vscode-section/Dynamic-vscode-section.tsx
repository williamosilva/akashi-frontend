"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FileCode, ChevronRight } from "lucide-react";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { LangButtons } from "./components/LangButtons";
import { fadeInUpVariants } from "@/animations/variation";

const codeSnippet = `
<span class="text-[#ff79c6]">import</span> <span class="text-[#f8f8f2]">axios</span> <span class="text-[#ff79c6]">from</span> <span class="text-[#f1fa8c]">'axios'</span><span class="text-[#f8f8f2]">;</span>

<span class="text-[#50fa7b]">async function</span> <span class="text-[#8be9fd]">getProjectData</span><span class="text-[#f8f8f2]">() {</span>
 <span class="text-[#ff79c6]">try</span> <span class="text-[#f8f8f2]">{</span>
   <span class="text-[#ff79c6]">const</span> <span class="text-[#f8f8f2]">response = </span><span class="text-[#ff79c6]">await</span> <span class="text-[#f8f8f2]">axios.get(</span><span class="text-[#f1fa8c]">\`Your-akashi-private-link\`</span><span class="text-[#f8f8f2]">);</span>
   <span class="text-[#ff79c6]">const</span> <span class="text-[#f8f8f2]">yourData = response.data;</span>
   <span class="text-[#ff79c6]">return</span> <span class="text-[#f8f8f2]">yourData;</span>
 <span class="text-[#f8f8f2]">} </span><span class="text-[#ff79c6]">catch</span> <span class="text-[#f8f8f2]">(error) {</span>
   <span class="text-[#f8f8f2]">console.error(</span><span class="text-[#f1fa8c]">'Error fetching project data:'</span><span class="text-[#f8f8f2]">, error);</span>
   <span class="text-[#ff79c6]">throw</span> <span class="text-[#f8f8f2]">error;</span>
 <span class="text-[#f8f8f2]">}</span>
<span class="text-[#f8f8f2]">}</span>

<span class="text-[#6272a4]">// Usage</span>
<span class="text-[#f8f8f2]">getProjectData()</span>
 <span class="text-[#f8f8f2]">.then(</span><span class="text-[#ffb86c]">yourData</span> <span class="text-[#ff79c6]">=></span> <span class="text-[#f8f8f2]">console.log(</span><span class="text-[#f1fa8c]">'Your Data:'</span><span class="text-[#f8f8f2]">, yourData))</span>
 <span class="text-[#f8f8f2]">.catch(</span><span class="text-[#ffb86c]">error</span> <span class="text-[#ff79c6]">=></span> <span class="text-[#f8f8f2]">console.error(</span><span class="text-[#f1fa8c]">'Error:'</span><span class="text-[#f8f8f2]">, error.message));</span>

<span class="text-[#6272a4]">/* Example response:
{
 "Project Name": {
   "userList": [...],
   "apiIntegration": {...},
   "dataExample": {...}
 }
}
*/</span>
`;
export default function DynamicVSCodeSection() {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = codeSnippet;
    }
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden py-10 sm:py-20">
      <motion.div
        className="absolute top-1/2 left-[20%]
        -translate-x-1/2 -translate-y-1/2
        z-20"
      >
        <LangButtons />
      </motion.div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col justify-center items-center">
        <motion.div
          custom={0}
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-3xl mx-auto mb-8 sm:mb-12 text-center"
        >
          <h2
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tighter",
              jetbrainsMono.className
            )}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
              Seamless Integration
            </span>
          </h2>

          <p
            className={cn(
              "text-zinc-400 text-sm sm:text-base md:text-lg",
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
          className="w-full max-w-5xl mx-auto"
        >
          <div className="bg-[#282a36] rounded-lg overflow-hidden shadow-2xl transform scale-90 sm:scale-100">
            <div className="bg-[#44475a] px-4 py-2 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5555] hover:bg-[#ff6e6e] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#ffb86c] hover:bg-[#ffc985] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#50fa7b] hover:bg-[#69ff92] transition-colors" />
              </div>
              <span
                className={cn(
                  "text-xs sm:text-sm text-[#f8f8f2]",
                  jetbrainsMono.className
                )}
              >
                project-data.js
              </span>
              <div className="w-3 h-3" />
            </div>
            <div className="flex">
              <div className="bg-[#21222c] w-12 sm:w-48 p-2 hidden sm:block">
                <div className="flex items-center text-[#6272a4] mb-2 hover:bg-[#44475a] rounded px-2 py-1 transition-colors cursor-pointer">
                  <ChevronRight size={16} />
                  <span className="text-sm ml-1 hidden sm:inline">src</span>
                </div>
                <div className="flex items-center text-[#f8f8f2] ml-4 hover:bg-[#44475a] rounded px-2 py-1 transition-colors cursor-pointer">
                  <FileCode size={14} className="mr-1" />
                  <span className="text-sm hidden sm:inline">
                    project-data.js
                  </span>
                </div>
              </div>
              <div className="flex-grow p-4 overflow-auto bg-[#282a36] h-[300px] sm:h-[400px] md:h-[500px] scrollbar-thin scrollbar-thumb-[#44475a] scrollbar-track-[#282a36]">
                <pre
                  ref={codeRef}
                  className={cn(
                    "text-xs sm:text-sm text-[#f8f8f2] whitespace-pre-wrap",
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
