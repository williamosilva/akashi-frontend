"use client";
import { scroller } from "react-scroll";
import HeroGeometric from "@/components/sections/Hero";
import MindMapSection from "@/components/sections/MentalMapSection";
import Features from "@/components/sections/SubFeatures";
import DynamicVSCodeSection from "@/components/sections/vscode-section/VscodeSection";
import Background from "@/components/ui/Background";
import Footer from "@/components/ui/Footer";
import PriceSection from "@/components/sections/Price";
import { useHook } from "@/components/ui/ConditionalLayout";
import { useEffect } from "react";
import { FeatureSteps } from "@/components/sections/FeatureSteps";
import { featuresStep } from "@/data";

export default function Home() {
  const { targetSection, setTargetSection, setOpenAuthModal } = useHook();

  useEffect(() => {
    if (!targetSection) return;

    const isHeroSection = targetSection === "hero" || targetSection === "hero2";
    const scrollDuration = isHeroSection ? 1000 : 800;
    const scrollOffset = isHeroSection ? 0 : -50;

    const sectionToScroll = isHeroSection ? "hero" : targetSection;

    scroller.scrollTo(sectionToScroll, {
      duration: scrollDuration,
      delay: 0,
      smooth: true,
      offset: scrollOffset,
    });

    const timeoutId = setTimeout(() => {
      if (targetSection === "hero") {
        setOpenAuthModal(true);
        console.log("Modal aberto após scroll do Hero");
      }
      setTargetSection("");
    }, scrollDuration);

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
          <FeatureSteps features={featuresStep} />
        </div>
        <div id="sub-features">
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
