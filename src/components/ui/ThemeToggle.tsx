"use client";

import { useTheme } from "@/components/ui/ThemeProvider";
import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide";
import {MorphIcon} from 'morphicons/react'

interface ThemeToggleProps {
  label?: string;
}

/**
 * Light/dark switch built on HeroUI's Button + lucide icons. The visible icon
 * is driven purely by the `.dark` class via Tailwind variants, so there is no
 * hydration mismatch and no mounted-gate effect needed. The active theme is
 * read at click time (post-mount) to decide the next theme.
 */
const ThemeToggle = ({
  label = "Chuyển giao diện sáng/tối",
}: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark"
  return (
    <Button
      variant="ghost"
      isIconOnly
      aria-label={label}
      onPress={() => setTheme(isDark ? "light" : "dark")}
    >
      <MorphIcon icon={isDark  ? Sun : Moon} />
      {/* <Sun size={20} aria-hidden className="hidden dark:block" />
      <Moon size={20} aria-hidden className="block dark:hidden" /> */}
    </Button>
  );
};

export default ThemeToggle;
