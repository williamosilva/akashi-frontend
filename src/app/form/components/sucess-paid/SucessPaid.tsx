"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Meteors } from "./Meteors";
import { motion, AnimatePresence } from "framer-motion";

interface SucessPaidProps {
  email: string;
  plan: string;
  hasParams: boolean;
}

export function SucessPaid({ email, plan, hasParams }: SucessPaidProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasParams) return;

    let root = document.getElementById("portal-root");

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

      document.body.appendChild(root);
    }

    setPortalRoot(root);
    setIsVisible(true);

    return () => {
      if (root && root.parentNode) {
        root.parentNode.removeChild(root);
      }
    };
  }, [hasParams]);

  if (!hasParams || !portalRoot) return null;

  const planDisplay = plan
    ? plan.charAt(0).toUpperCase() + plan.slice(1)
    : "Premium";

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      if (portalRoot && portalRoot.parentNode) {
        portalRoot.parentNode.removeChild(portalRoot);
      }
    }, 500);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const content = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
        >
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
          <motion.div
            className="w-full relative max-w-xs"
            variants={modalVariants}
          >
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

              <motion.h1
                className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-300 mb-4 relative z-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Subscription Successful!
              </motion.h1>

              <motion.p
                className="font-normal text-base text-zinc-400 mb-4 relative z-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Thank you for subscribing to {planDisplay} plan. A confirmation
                email has been sent to{" "}
                <span className="text-emerald-300">{email}</span>
                .You now have access to all {plan} features on our platform.
                Enjoy exploring!
              </motion.p>

              <motion.button
                onClick={handleClose}
                className="border px-4 py-1 rounded-lg border-emerald-500/20 text-emerald-300 hover:bg-zinc-800 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>

              <Meteors number={20} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(content, portalRoot);
}
