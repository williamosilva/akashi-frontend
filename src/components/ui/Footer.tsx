"use client";

import { motion } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
});

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export default function Footer() {
  return (
    <footer className="relative w-full bg-zinc-900 border-t border-emerald-500/20 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 md:col-span-2"
          >
            <h2
              className={cn(
                "text-2xl font-bold mb-4 text-emerald-400",
                jetbrainsMono.className
              )}
            >
              Transform Your Personal Projects
            </h2>
            <p className="text-zinc-400 mb-4">
              Connect and manage your project data dynamically. Update content
              seamlessly through our intuitive API.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-emerald-300 hover:text-emerald-400 transition-colors"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="text-emerald-300 hover:text-emerald-400 transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="#"
                className="text-emerald-300 hover:text-emerald-400 transition-colors"
              >
                LinkedIn
              </Link>
            </div>
          </motion.div>
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1"
          >
            <h3
              className={cn(
                "text-lg font-semibold mb-4 text-emerald-300",
                jetbrainsMono.className
              )}
            >
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  API
                </Link>
              </li>
            </ul>
          </motion.div>
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1"
          >
            <h3
              className={cn(
                "text-lg font-semibold mb-4 text-emerald-300",
                jetbrainsMono.className
              )}
            >
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-emerald-300 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 pt-8 border-t border-zinc-800 text-center"
        >
          <p className="text-zinc-500 text-sm">
            © 2025 Your Company. All rights reserved.
          </p>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(52,211,153,0.04),transparent_70%)] pointer-events-none" />
    </footer>
  );
}
