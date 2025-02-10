import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isExpanded?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isExpanded, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {isExpanded && (
          <Search className="absolute left-3 h-4 w-4 text-emerald-500/50" />
        )}
        <input
          type={type}
          className={cn(
            // Base
            "h-10 w-full text-sm transition-all duration-200",

            // Remove default browser styles
            "outline-none ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0",

            // Appearance
            "rounded-lg border border-zinc-700/50",
            "bg-zinc-800/30 backdrop-blur-md",
            "text-zinc-100",

            // Padding
            isExpanded ? "pl-10 pr-4" : "px-4",

            // Placeholder
            "placeholder:text-emerald-500/40",

            // Custom focus state
            "focus:outline-none",
            "focus:border-emerald-500/30",

            // Hover state
            "hover:bg-zinc-800/40",
            "hover:border-emerald-500/20",

            // Disabled state
            "disabled:cursor-not-allowed",
            "disabled:opacity-50",

            // Override any focus visible styles
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",

            className
          )}
          placeholder={isExpanded ? "Search..." : ""}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
