"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import React from "react";

interface RevealTextProps {
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
}

const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function RevealText({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  stagger = false,
}: RevealTextProps) {
  const { ref, inView } = useInView(0.1);

  if (!stagger) {
    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  const words = typeof children === "string" ? children.split(" ") : [];

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("overflow-hidden", className)}
      aria-label={typeof children === "string" ? children : undefined}
    >
      <div className="flex flex-wrap gap-x-[0.25em]">
        {words.map((word, i) => (
          <motion.span
            key={i}
            custom={i + delay * 10}
            variants={variants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
