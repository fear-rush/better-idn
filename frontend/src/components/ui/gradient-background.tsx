"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const GradientBackground = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500 from-violet-500/20 via-transparent to-cyan-500/20" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500",
          resolvedTheme === "dark"
            ? "from-violet-500/20 via-transparent to-cyan-500/20"
            : "from-violet-500/10 via-transparent to-cyan-500/10"
        )}
      />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20",
          resolvedTheme === "dark" ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
