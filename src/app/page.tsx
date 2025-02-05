import HeroGeometric from "@/components/sections/Hero";
import MindMapSection from "@/components/sections/MentalMapSection";
import Features from "@/components/sections/Features";
import DynamicVSCodeSection from "@/components/sections/Dynamic-vscode-section";
import Background from "@/components/ui/Background";
import Footer from "@/components/ui/Footer";
import PriceSection from "@/components/sections/Price";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className=" w-full h-full z-[1] ">
        <Background />
      </div>
      <div className="relative z-[2]  ">
        <HeroGeometric />
        <Features />
        <MindMapSection />
        <DynamicVSCodeSection />
        <PriceSection />
        <Footer />
      </div>
    </main>
  );
}
