"use client";
import { scroller } from "react-scroll";
import HeroGeometric from "@/components/sections/Hero";
import MindMapSection from "@/components/sections/MentalMapSection";
import Features from "@/components/sections/Features";
import DynamicVSCodeSection from "@/components/sections/Dynamic-vscode-section";
import Background from "@/components/ui/Background";
import Footer from "@/components/ui/Footer";
import PriceSection from "@/components/sections/Price";
import { useHook, useUser } from "@/components/ui/ConditionalLayout";
import { useEffect } from "react";

export default function Home() {
  const { targetSection, setTargetSection, setOpenAuthModal } = useHook();

  useEffect(() => {
    if (!targetSection) return;

    // Configurações da animação de scroll
    const isHeroSection = targetSection === "hero" || targetSection === "hero2";
    const scrollDuration = isHeroSection ? 1000 : 800;
    const scrollOffset = isHeroSection ? 0 : -50;

    // Determina o ID da seção para onde fazer o scroll (sempre "hero" para ambos os casos)
    const sectionToScroll = isHeroSection ? "hero" : targetSection;

    // Dispara a animação de scroll
    scroller.scrollTo(sectionToScroll, {
      duration: scrollDuration,
      delay: 0,
      smooth: true,
      offset: scrollOffset,
    });

    // Configura o timeout para sincronizar com o fim da animação
    const timeoutId = setTimeout(() => {
      // Abre o modal apenas se o target for "hero" (não "hero2")
      if (targetSection === "hero") {
        setOpenAuthModal(true); // Abre o modal APÓS a rolagem do Hero
        console.log("Modal aberto após scroll do Hero");
      }
      setTargetSection(""); // Reseta sempre ao final
    }, scrollDuration);

    // Cleanup para evitar vazamentos de memória
    return () => clearTimeout(timeoutId);
  }, [targetSection, setTargetSection, setOpenAuthModal]);

  return (
    <main className="relative overflow-hidden">
      <div className="w-full h-full z-[1]">
        <Background />
      </div>
      <div className="relative z-[2]">
        <div id="hero">
          <HeroGeometric />
        </div>
        <div id="features">
          <Features />
        </div>
        <div id="mindmap">
          <MindMapSection />
        </div>
        <div id="vscode">
          <DynamicVSCodeSection />
        </div>
        <div id="price">
          <PriceSection />
        </div>
        <Footer />
      </div>
    </main>
  );
}
