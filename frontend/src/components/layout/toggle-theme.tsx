"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="transition-transform hover:scale-110"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}