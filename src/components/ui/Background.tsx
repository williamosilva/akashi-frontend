import Geometric3DShape from "@/three/Geometric3DShape";

const SmokeBlob = ({ className = "" }) => (
  <div className={`absolute rounded-full bg-black/10 blur-3xl ${className}`} />
);

export default function Background() {
  return (
    <div className="absolute w-full min-h-[710vh] flex items-center justify-center overflow-hidden bg-zinc-900">
      <div className="absolute inset-0 overflow-hidden">
        <SmokeBlob className="w-96 h-96 left-[10%] top-[15%] opacity-20" />
        <SmokeBlob className="w-80 h-80 right-[15%] top-[25%] opacity-15" />
        <SmokeBlob className="w-72 h-72 left-[20%] top-[45%] opacity-25" />
        <SmokeBlob className="w-64 h-64 right-[25%] top-[65%] opacity-20" />
        <SmokeBlob className="w-80 h-80 left-[15%] top-[85%] opacity-15" />
      </div>

      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[linear-gradient(rgba(52,211,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.05)_1px,transparent_1px)] before:bg-[size:50px_50px] before:opacity-30" />

      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-zinc-800/[0.2] blur-2xl pointer-events-none" />

      <div className="sm:absolute hidden inset-0 overflow-hidden z-[1] pointer-events-none ">
        <Geometric3DShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          className="left-[-10%] md:left-[-5%] top-[8%]"
        />
        <Geometric3DShape
          delay={0.3}
          width={600}
          height={140}
          rotate={-18}
          className="right-[-10%] md:right-[-5%] top-[10%]"
        />
        <Geometric3DShape
          delay={0.5}
          width={200}
          height={60}
          rotate={-30}
          className="right-[-5%] md:right-[70%] top-[70%] md:top-[2%]"
        />

        <Geometric3DShape
          delay={0.6}
          width={210}
          height={70}
          rotate={20}
          className="right-[15%] md:right-[25%] top-[10%] md:top-[3%]"
        />

        <Geometric3DShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[4%]"
        />

        <Geometric3DShape
          delay={0.5}
          width={300}
          height={80}
          rotate={-15}
          className="left-[-5%] md:left-[2%] top-[38%] "
        />
        <Geometric3DShape
          delay={0.4}
          width={300}
          height={80}
          rotate={12}
          className="right-[5%] md:right-[10%] top-[65%] "
        />
        <Geometric3DShape
          delay={0.7}
          width={200}
          height={60}
          rotate={-25}
          className="left-[15%] md:left-[20%] top-[70%]"
        />
      </div>
    </div>
  );
}
