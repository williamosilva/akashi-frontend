import HeroGeometric from "@/components/sections/hero";
import MindMapSection from "@/components/sections/mentalMapSection";
import Features from "@/components/sections/features";
import DynamicVSCodeSection from "@/components/sections/dynamic-vscode-section";
import Background from "@/components/ui/Background";
import Footer from "@/components/ui/Footer";

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
        <Footer />
      </div>
    </main>
  );
}
