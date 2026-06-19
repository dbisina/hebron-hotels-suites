import { cn } from "@/lib/utils";

interface GoldDividerProps {
  className?: string;
  variant?: "full" | "short" | "ornate";
}

export function GoldDivider({ className, variant = "short" }: GoldDividerProps) {
  if (variant === "ornate") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-600/50" />
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <path d="M0 6H8M16 6H24M12 0L14 6L12 12L10 6L12 0Z" stroke="#C9A84C" strokeWidth="0.5" />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-600/50" />
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div
        className={cn("w-full h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent", className)}
      />
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-8 h-px bg-gold-500" />
      <div className="w-1.5 h-1.5 rotate-45 bg-gold-500" />
      <div className="w-8 h-px bg-gold-500" />
    </div>
  );
}
