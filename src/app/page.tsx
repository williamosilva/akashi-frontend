import HeroGeometric from "@/components/sections/hero";
import MindMapSection from "@/components/sections/mentalMapSection";
import Features from "@/components/sections/features";
import DynamicVSCodeSection from "@/components/sections/dynamic-vscode-section";
import Background from "@/components/ui/Background";

export default function Home() {
  return (
    <main className="relative">
      <div className="fixed inset-0 w-full h-full z-[1]">
        <Background />
      </div>
      <div className="relative z-[2]">
        <HeroGeometric />
        <Features />
        <MindMapSection />
        <DynamicVSCodeSection />
      </div>
    </main>
  );
}
