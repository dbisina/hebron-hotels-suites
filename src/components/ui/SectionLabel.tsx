import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export function SectionLabel({ children, className, light }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "text-[10px] md:text-xs tracking-[0.45em] uppercase font-sans font-medium",
        light ? "text-cream-200/60" : "text-gold-600",
        className
      )}
    >
      {children}
    </p>
  );
}
