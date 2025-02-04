"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
});

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-sm border-b border-emerald-500/20",
        jetbrainsMono.className
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-center relative">
            <Image
              src="/images/logo_extensa.png"
              alt="Akashi Logo"
              width={80}
              height={100}
              className=" select-none "
            />
          </Link>
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/projects"
                  className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-emerald-300 border border-emerald-500/20 hover:bg-zinc-700 transition-colors"
                >
                  Projects
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                  }}
                  className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-emerald-300 border border-emerald-500/20 hover:bg-zinc-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-emerald-300 border border-emerald-500/20 hover:bg-zinc-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm rounded-md bg-emerald-500 text-zinc-900 font-medium hover:bg-emerald-400 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
