"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { useMediaQuery } from "react-responsive";
import { Tooltip, TooltipProvider } from "./Tooltip";

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
];

export default function QuoteCard({ link }: { link: string }) {
  const [quote, setQuote] = useState(quotes[0]);
  const [typedQuote, setTypedQuote] = useState("");
  const [displayedQuote, setDisplayedQuote] = useState(quotes[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const typingSpeedRef = useRef(50); // milliseconds per character
  const isDesktopOrLaptop = useMediaQuery({
    query: "(max-width: 1280px)",
  });
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle quote transition and typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * quotes.length);
      } while (quotes[nextIndex].text === quote.text);

      setQuote(quotes[nextIndex]);
    }, 24000);
    return () => clearInterval(interval);
  }, [quote]);

  // Handle typing animation when quote changes
  useEffect(() => {
    if (quote.text !== displayedQuote.text) {
      // Start erasing the current quote
      setIsTyping(true);
      let currentText = displayedQuote.text;
      const eraseInterval = setInterval(() => {
        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          setTypedQuote(currentText);
        } else {
          clearInterval(eraseInterval);
          setDisplayedQuote(quote);

          // Start typing the new quote
          let index = 0;
          const typeInterval = setInterval(() => {
            if (index < quote.text.length) {
              setTypedQuote(quote.text.slice(0, index + 1));
              index++;
            } else {
              clearInterval(typeInterval);
              setIsTyping(false);
            }
          }, typingSpeedRef.current);
        }
      }, typingSpeedRef.current / 2);

      return () => {
        clearInterval(eraseInterval);
      };
    }
  }, [quote, displayedQuote]);

  // Initialize typing animation
  useEffect(() => {
    if (typedQuote === "" && quote.text !== "") {
      let index = 0;
      setIsTyping(true);
      const interval = setInterval(() => {
        if (index < quote.text.length) {
          setTypedQuote(quote.text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, typingSpeedRef.current);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div
      className={cn(
        "w-auto h-full flex items-center justify-center bg-zinc-900 relative overflow-hidden",
        montserrat.variable,
        jetbrainsMono.variable
      )}
    >
      {/* Original background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.04),transparent_70%)]" />
        <div className="absolute inset-0 liquid-effect" />
        <div className="absolute inset-0 liquid-effect-secondary" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/90" />
      </div>

      <div className="relative z-10 w-full h-full">
        {/* Quote Card with Dynamic Galaxy Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col justify-between overflow-hidden backdrop-blur-sm bg-zinc-800/30 rounded-lg border border-emerald-500/20 md:p-4 sm:p-3 p-4 shadow-2xl h-full"
        >
          {/* Dynamic Galaxy background inside the card */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 galaxy-effect" />
            <div className="absolute inset-0 galaxy-effect-secondary" />
            <div className="absolute inset-0 starfield starfield-small" />
            <div className="absolute inset-0 starfield starfield-medium" />
            <div className="absolute inset-0 starfield starfield-large" />
          </div>

          <div className="gap-2 mb-2 relative z-10 h-auto flex flex-col">
            <blockquote
              className={cn(
                "lg:text-base xl:text-base 2xl:text-lg md:text-base font-bold 2xl:mb-4 mb-0 tracking-tight",
                montserrat.className
              )}
            >
              <span className="flex">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
                  "{typedQuote}"
                </span>
                {/* {isTyping && <span className="typing-cursor">|</span>} */}
              </span>
            </blockquote>
            <motion.p
              key={displayedQuote.author}
              initial={{ opacity: 0 }}
              animate={{ opacity: isTyping ? 0.5 : 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "text-right text-zinc-400 lg:text-sm 2xl:text-base md:text-sm text-xs",
                jetbrainsMono.className
              )}
            >
              - {displayedQuote.author}
            </motion.p>
          </div>

          <div className="flex flex-row items-center gap-2 relative z-10 w-full max-w-3xl mx-auto px-0 sm:px-0">
            <input
              type="text"
              value={link}
              readOnly
              className="flex-1 px-4 py-2 rounded-md bg-zinc-900 border border-emerald-500/20 text-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 font-mono w-full"
            />

            <TooltipProvider>
              <Tooltip content="Click to copy" position="top">
                <Button
                  variant="outline"
                  size="icon"
                  className="disabled:opacity-100"
                  onClick={copyToClipboard}
                  aria-label={copied ? "Copied" : "Copy to clipboard"}
                  disabled={copied}
                >
                  <div
                    className={cn(
                      "transition-all",
                      copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}
                  >
                    <Check
                      className="stroke-emerald-500"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute transition-all",
                      copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                    )}
                  >
                    <Copy size={16} strokeWidth={2} aria-hidden="true" />
                  </div>
                </Button>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .liquid-effect {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(52, 211, 153, 0.1) 0%,
            rgba(52, 211, 153, 0.05) 25%,
            transparent 50%
          );
          filter: blur(40px);
          transform-origin: center;
          animation: liquidMove 20s ease-in-out infinite;
        }

        .liquid-effect-secondary {
          background: radial-gradient(
            circle at 30% 70%,
            rgba(52, 211, 153, 0.08) 0%,
            rgba(52, 211, 153, 0.03) 30%,
            transparent 60%
          );
          filter: blur(60px);
          transform-origin: center;
          animation: liquidMove 25s ease-in-out infinite reverse;
        }

        .galaxy-effect {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(52, 211, 153, 0.08) 0%,
            rgba(52, 211, 153, 0.04) 25%,
            transparent 50%
          );
          filter: blur(20px);
          transform-origin: center;
          animation: galaxyMove 30s ease-in-out infinite;
        }

        .galaxy-effect-secondary {
          background: radial-gradient(
            circle at 30% 70%,
            rgba(52, 211, 153, 0.06) 0%,
            rgba(52, 211, 153, 0.02) 30%,
            transparent 60%
          );
          filter: blur(30px);
          transform-origin: center;
          animation: galaxyMove 40s ease-in-out infinite reverse;
        }

        .starfield {
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          background-image: radial-gradient(
              1px 1px at 25px 5px,
              #fff,
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(1px 1px at 50px 25px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(1px 1px at 125px 20px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(1.5px 1.5px at 175px 45px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 20px 80px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(2.5px 2.5px at 100px 110px, #fff, rgba(0, 0, 0, 0));
          background-repeat: repeat;
          background-size: 200px 200px;
        }

        .starfield-small {
          opacity: 0.05;
          animation: moveStars 150s linear infinite;
        }

        .starfield-medium {
          opacity: 0.09;
          animation: moveStars 100s linear infinite;
        }

        .starfield-large {
          opacity: 0.1;
          animation: moveStars 50s linear infinite;
        }

        .typing-cursor {
          animation: blink 0.7s infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes liquidMove {
          0% {
            transform: scale(1) translate(0%, 0%) rotate(0deg);
          }
          33% {
            transform: scale(1.1) translate(3%, 3%) rotate(3deg);
          }
          66% {
            transform: scale(0.9) translate(-3%, -3%) rotate(-3deg);
          }
          100% {
            transform: scale(1) translate(0%, 0%) rotate(0deg);
          }
        }

        @keyframes galaxyMove {
          0% {
            transform: scale(1) translate(0%, 0%) rotate(0deg);
          }
          33% {
            transform: scale(1.1) translate(2%, 2%) rotate(2deg);
          }
          66% {
            transform: scale(0.9) translate(-2%, -2%) rotate(-2deg);
          }
          100% {
            transform: scale(1) translate(0%, 0%) rotate(0deg);
          }
        }

        @keyframes moveStars {
          from {
            transform: translateY(0%);
          }
          to {
            transform: translateY(50%);
          }
        }
      `}</style>
    </div>
  );
}
