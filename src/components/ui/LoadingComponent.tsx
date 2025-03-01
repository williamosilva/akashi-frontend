"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner } from "./Spinner";
import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/styles/fonts";

const loadingMessages = [
  "Bringing the latest updates...",
  "Optimizing your experience...",
  "Loading insights...",
  "Hold tight! We're gathering your data...",
  "Just a moment, we're preparing everything for you...",
  "Hang in there! Your data is on the way...",
];

const getRandomLoadingMessage = () => {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
};

const LoadingComponent = () => {
  const [, setLoading] = useState(true);
  const [loadingMessage] = useState(getRandomLoadingMessage());

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <Spinner size={40} variant="bars" className="text-emerald-400" />
        <motion.p
          className={cn(
            "mt-2 text-emerald-300/80 text-lg tracking-wide animate-pulse",
            jetbrainsMono.className
          )}
        >
          {loadingMessage}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingComponent;
