"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Meteors } from "./Meteors";

export function SucessPaid() {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    // Verifica se já existe um elemento com id "portal-root"
    let root = document.getElementById("portal-root");

    // Se não existir, cria um novo elemento div
    if (!root) {
      root = document.createElement("div");
      root.id = "portal-root";
      root.style.position = "fixed";
      root.style.zIndex = "9999";
      root.style.top = "0";
      root.style.left = "0";
      root.style.width = "100vw";
      root.style.height = "100vh";
      root.style.pointerEvents = "auto";
      // Adiciona ao body
      document.body.appendChild(root);
    }

    setPortalRoot(root);

    return () => {
      if (root && root.parentNode) {
        root.parentNode.removeChild(root);
      }
    };
  }, []);

  if (!portalRoot) return null;

  const content = (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(0.9);
            opacity: 1;
          }
        }

        @keyframes pulse-reverse {
          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.6;
          }
          50% {
            transform: scale(0.75);
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-reverse {
          animation: pulse-reverse 5s ease-in-out infinite;
        }
      `}</style>
      <div className="w-full relative max-w-xs">
        <>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-emerald-400/50 to-emerald-600/50 rounded-full blur-3xl animate-pulse-reverse" />
        </>
        <div className="relative shadow-xl bg-zinc-900 border border-emerald-500/20 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-emerald-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-emerald-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </div>

          <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-300 mb-4 relative z-50">
            Welcome to our platform!
          </h1>

          <p className="font-normal text-base text-zinc-400 mb-4 relative z-50">
            We are very happy to have you as a subscriber. Now you have access
            to all premium features on our platform. Explore all features and
            maximize your experience!
          </p>

          <button className="border px-4 py-1 rounded-lg border-emerald-500/20 text-emerald-300 hover:bg-zinc-800 transition-colors">
            Close
          </button>

          {/* Efeito de meteoros para um visual impressionante */}
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );

  // Usa ReactDOM.createPortal para renderizar o conteúdo no nó do portal
  return ReactDOM.createPortal(content, portalRoot);
}
