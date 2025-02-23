"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isExpanded?: boolean;
  showSearchIcon?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isExpanded, showSearchIcon = true, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <input
          type={type}
          className={cn(
            "h-10 w-full text-sm transition-all duration-200",
            "outline-none ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0",
            "rounded-lg border border-zinc-700/50",
            "bg-zinc-800/30 backdrop-blur-md",
            "text-zinc-100",
            showSearchIcon && isExpanded ? "pl-10 pr-4" : "px-4",
            "placeholder:text-emerald-500/40",
            "focus:outline-none",
            "focus:border-emerald-500/30",
            "hover:bg-zinc-800/40",
            "hover:border-emerald-500/20",
            "disabled:cursor-not-allowed",
            "disabled:opacity-50",
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
            className
          )}
          ref={ref}
          {...props}
        />

        {showSearchIcon && (
          <Search
            className={cn(
              "absolute left-[7%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500",
              !isExpanded &&
                "absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500"
            )}
          />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
