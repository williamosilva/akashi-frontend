"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Language {
  id: string;
  label: string;
  image: string;
}

interface LangButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  onLanguageChange?: (langId: string) => void;
  tabSize?: number;
}

const LangButtons = React.forwardRef<HTMLDivElement, LangButtonsProps>(
  ({ className, onLanguageChange, tabSize = 40, ...props }, ref) => {
    const languages = [
      {
        id: "javascript",
        label: "JavaScript",
        image: "/images/JavaScript_icon.png",
      },
      {
        id: "python",
        label: "Python",
        image: "/images/python_icon.webp",
      },
      {
        id: "java",
        label: "Java",
        image: "/images/java_icon.png",
      },
    ];

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverStyle, setHoverStyle] = useState({});
    const [activeStyle, setActiveStyle] = useState({
      top: "0px",
      height: "0px",
    });
    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex];
        if (hoveredElement) {
          const { offsetTop, offsetHeight } = hoveredElement;
          setHoverStyle({
            top: `${offsetTop}px`,
            height: `${offsetHeight}px`,
          });
        }
      }
    }, [hoveredIndex]);

    useEffect(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetTop, offsetHeight } = activeElement;
        setActiveStyle({
          top: `${offsetTop}px`,
          height: `${offsetHeight}px`,
        });
      }
    }, [activeIndex]);

    useEffect(() => {
      requestAnimationFrame(() => {
        const firstElement = tabRefs.current[0];
        if (firstElement) {
          const { offsetTop, offsetHeight } = firstElement;
          setActiveStyle({
            top: `${offsetTop}px`,
            height: `${offsetHeight}px`,
          });
        }
      });
    }, []);

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div className="relative">
          {/* Hover Highlight */}
          <div
            className="absolute transition-all duration-300 ease-out bg-[#21222C] bg-opacity-75 rounded-full flex items-center justify-center"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
              width: `${tabSize}px`,
              height: `${tabSize}px`,
            }}
          />

          {/* Language Buttons */}
          <div className="relative flex xl:flex-col flex-row gap-4 items-center">
            {languages.map((lang, index) => (
              <div
                key={lang.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                className={cn(
                  "cursor-pointer transition-all p-2 duration-300 rounded-full overflow-hidden ",
                  index === activeIndex
                    ? "scale-150 bg-[#21222C]"
                    : "scale-100 bg-[#282A36]"
                )}
                style={{
                  width: `${tabSize}px`,
                  height: `${tabSize}px`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setActiveIndex(index);
                  onLanguageChange?.(lang.id);
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={
                      lang.image ||
                      `/placeholder.svg?height=${tabSize}&width=${tabSize}`
                    }
                    alt={lang.label}
                    width={tabSize - 18}
                    height={tabSize - 18}
                    className="object-contain rounded-md"
                  />
                  <span className="sr-only">{lang.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
LangButtons.displayName = "LangButtons";

export { LangButtons };
