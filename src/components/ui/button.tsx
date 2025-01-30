import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
