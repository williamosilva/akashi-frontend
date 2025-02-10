"use client";

import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/Aurora-background";

export default function FormPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="relative z-[2]">
        <AuroraBackground className="opacity-100">
          <Link href="/" className="mt-4 inline-block text-blue-500">
            Voltar para Home
          </Link>
        </AuroraBackground>

        <Footer />
      </div>
    </main>
  );
}
