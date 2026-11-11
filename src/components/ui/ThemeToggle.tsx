"use client";

import { useTheme } from "@/components/ui/ThemeProvider";
import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide";
import { MorphIcon } from "morphicons/react";
import { play } from "@/lib/sound/engine";

interface ThemeToggleProps {
  label?: string;
}

/**
 * Light/dark switch built on HeroUI's Button + lucide icons. The visible icon
 * is driven purely by the `.dark` class via Tailwind variants, so there is no
 * hydration mismatch and no mounted-gate effect needed. The active theme is
 * read at click time (post-mount) to decide the next theme. The switch runs
 * through the View Transition API (see ThemeProvider.setTheme).
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
      data-sound="self"
      onPress={(event) => {
        // The new theme spreads out from the centre of this button.
        const rect = (event.target as Element).getBoundingClientRect();
        setTheme(isDark ? "light" : "dark", {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
        play(isDark ? "toggleOff" : "toggleOn");
      }}
    >
      <MorphIcon icon={isDark  ? Sun : Moon} />
      {/* <Sun size={20} aria-hidden className="hidden dark:block" />
      <Moon size={20} aria-hidden className="block dark:hidden" /> */}
    </Button>
  );
};

export default ThemeToggle;
