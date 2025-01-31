import React, { useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const DataFlowHub = () => {
  const containerRef = useRef(null);
  const hubRef = useRef(null);
  const userRef = useRef(null);
  const apiRef = useRef(null);
  const databaseRef = useRef(null);
  const streamingRef = useRef(null);

  return (
    <div className="w-full h-[400px] relative" ref={containerRef}>
      {/* Data Sources (Left Side) */}
      <div className="absolute left-4 top-1/4 flex flex-col gap-8">
        <div
          ref={apiRef}
          className="bg-blue-100 p-4 rounded-lg shadow-md w-40 text-center"
        >
          REST API
        </div>
        <div
          ref={databaseRef}
          className="bg-green-100 p-4 rounded-lg shadow-md w-40 text-center"
        >
          Database
        </div>
        <div
          ref={streamingRef}
          className="bg-yellow-100 p-4 rounded-lg shadow-md w-40 text-center"
        >
          Streaming Data
        </div>
      </div>

      {/* Central Hub */}
      <div
        ref={hubRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-100 p-6 rounded-full shadow-md w-32 h-32 flex items-center justify-center text-center"
      >
        Data Processing Hub
      </div>

      {/* End User (Right Side) */}
      <div
        ref={userRef}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-100 p-4 rounded-lg shadow-md w-40 text-center"
      >
        End User
      </div>

      {/* Beams from sources to hub */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={apiRef}
        toRef={hubRef}
        pathColor="#e2e8f0"
        gradientStartColor="#60a5fa"
        gradientStopColor="#818cf8"
        delay={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={databaseRef}
        toRef={hubRef}
        pathColor="#e2e8f0"
        gradientStartColor="#4ade80"
        gradientStopColor="#818cf8"
        delay={1}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={streamingRef}
        toRef={hubRef}
        pathColor="#e2e8f0"
        gradientStartColor="#facc15"
        gradientStopColor="#818cf8"
        delay={2}
      />

      {/* Beam from hub to user */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={userRef}
        pathColor="#e2e8f0"
        gradientStartColor="#818cf8"
        gradientStopColor="#f87171"
        delay={3}
      />
    </div>
  );
};

export default DataFlowHub;
