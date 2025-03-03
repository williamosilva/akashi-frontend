"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FileCode, ChevronRight } from "lucide-react";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { LangButtons } from "./components/LangButtons";
import { fadeInUpVariants } from "@/animations/variation";
import {
  codeSnippetJavaScript,
  codeSnippetPython,
  codeSnippetJava,
} from "./data";

export default function DynamicVSCodeSection() {
  const [lang, setLang] = useState("javascript");
  const [key, setKey] = useState(0);

  const getCodeSnippet = () => {
    switch (lang) {
      case "javascript":
        return codeSnippetJavaScript;
      case "python":
        return codeSnippetPython;
      case "java":
        return codeSnippetJava;
      default:
        return codeSnippetJavaScript;
    }
  };

  const handleLanguageChange = (langId: string) => {
    setLang(langId);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden py-10 sm:py-20">
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
          className="w-full max-w-5xl mx-auto flex xl:flex-row flex-col-reverse items-center"
        >
          <motion.div className="xl:right-10 right-0 xl:top-0 sm:top-10 top-4 relative">
            <LangButtons onLanguageChange={handleLanguageChange} />
          </motion.div>
          <div className="bg-[#282a36] rounded-lg w-full overflow-hidden shadow-2xl transform scale-90 sm:scale-100">
            <div className="bg-[#44475a] px-4 py-2 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5555] hover:bg-[#ff6e6e] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#ffb86c] hover:bg-[#ffc985] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#50fa7b] hover:bg-[#69ff92] transition-colors" />
              </div>
              <motion.span
                key={`filename-${lang}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "text-xs sm:text-sm text-[#f8f8f2]",
                  jetbrainsMono.className
                )}
              >
                {lang === "javascript"
                  ? "project-data.js"
                  : lang === "python"
                  ? "project_data.py"
                  : "ProjectData.java"}
              </motion.span>
              <div className="w-3 h-3" />
            </div>
            <div className="flex">
              <div className="bg-[#21222c] w-12 sm:w-44 p-2 hidden sm:block">
                <div className="flex items-center text-[#6272a4] mb-2 hover:bg-[#44475a] rounded px-2 py-1 transition-colors cursor-pointer">
                  <ChevronRight size={16} />
                  <span className="text-sm ml-1 hidden sm:inline">src</span>
                </div>
                <div className="flex items-center text-[#f8f8f2] ml-4 hover:bg-[#44475a] rounded px-2 py-1 transition-colors cursor-pointer">
                  <FileCode size={14} className="mr-1" />
                  <motion.span
                    key={`sidebar-filename-${lang}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm hidden sm:inline whitespace-nowrap"
                  >
                    {lang === "javascript"
                      ? "project-data.js"
                      : lang === "python"
                      ? "project_data.py"
                      : "ProjectData.java"}
                  </motion.span>
                </div>
              </div>
              <div className="flex-grow p-4 overflow-auto bg-[#282a36] h-[300px]  sm:h-[400px] md:h-[500px] scrollbar-thin scrollbar-thumb-[#44475a] scrollbar-track-[#282a36]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`code-${key}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="w-full"
                  >
                    <pre
                      className={cn(
                        "text-xs sm:text-sm text-[#f8f8f2] whitespace-pre-wrap break-words",
                        jetbrainsMono.className
                      )}
                      dangerouslySetInnerHTML={{ __html: getCodeSnippet() }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
