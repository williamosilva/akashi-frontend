"use client";

import { motion } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Github, Linkedin, Globe } from "lucide-react";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
});

const fadeInVariants = {
  hidden: { opacity: 0.8, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function Footer() {
  const [gradientOpacity, setGradientOpacity] = useState(0.15);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setGradientOpacity((prev) => (prev === 0.15 ? 0.2 : 0.15));
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <motion.footer
      className="relative w-full bg-zinc-900 py-12"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            className="h-3 w-3 rounded-full bg-emerald-500 mb-4"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <h2
            className={cn(
              "text-2xl font-bold text-emerald-300 mb-4",
              jetbrainsMono.className
            )}
          >
            Ready to Transform Your Projects?
          </h2>
          <p className="text-zinc-400 max-w-md mb-6">
            Connect and manage your project data dynamically. Update content
            seamlessly through our intuitive API.
          </p>

          <motion.button
            className="relative px-8 py-3 rounded-lg 
            text-white 
            font-bold 
            group
            transition-all 
            duration-300 
            ease-in-out
            hover:shadow-xl 
            hover:shadow-emerald-500/50 
            transform 
            hover:scale-105 
            active:scale-95
            bg-gradient-to-r 
            from-emerald-500 
            via-teal-500 
            to-emerald-500 
            bg-size-200 
            bg-pos-0 
            hover:bg-pos-100 
            animate-gradient"
            style={{
              backgroundSize: "200% 100%",
              backgroundPosition: "0% 0%",
              animationDuration: "3s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(16, 185, 129, 0.7)",
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
          >
            Get Started
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <span
              className={cn(
                "text-emerald-300 font-bold",
                jetbrainsMono.className
              )}
            >
              Akashi
            </span>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-6 mb-4 md:mb-0">
            {["Product", "Docs", "Pricing", "About"].map((item) => (
              <motion.div key={item} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="flex space-x-4">
            {[
              { name: "GitHub", icon: Github, href: "#" },
              { name: "LinkedIn", icon: Linkedin, href: "#" },
              { name: "Website", icon: Globe, href: "#" },
            ].map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                className="text-zinc-400 hover:text-emerald-300 transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <span className="sr-only">{social.name}</span>
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Akashi. All rights reserved.
          </p>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse at bottom, rgba(52,211,153,${gradientOpacity}), transparent 70%)`,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.footer>
  );
}
