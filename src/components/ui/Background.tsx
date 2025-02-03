import Geometric3DShape from "@/three/Geometric3DShape";
import NetworkCanvas from "@/three/NetworkCanvas";

export default function Background() {
  return (
    <div className="absolute w-full min-h-[400vh] flex items-center justify-center overflow-hidden bg-zinc-900">
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-zinc-800/[0.1] blur-3xl" />

      {/* Elementos 3D */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <Geometric3DShape
          width={600}
          height={140}
          rotate={12}
          className="left-[-10%] md:left-[-5%] top-[10%]" // Ajuste para cobrir as seções
        />
        <Geometric3DShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          className="right-[-5%] md:right-[0%] top-[40%]" // Posicionado para outra seção
        />
        <Geometric3DShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          className="left-[5%] md:left-[10%] top-[70%]" // Mais para baixo
        />
        <Geometric3DShape
          delay={0.7}
          width={200}
          height={60}
          rotate={25}
          className="right-[15%] md:right-[20%] top-[100%]" // Última seção
        />
      </div>

      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.04),transparent_70%)]" />

      {/* Canvas para efeito de rede */}
      <div className="absolute inset-0 z-0">
        <NetworkCanvas />
      </div>
    </div>
  );
}
