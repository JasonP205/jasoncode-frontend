"use client";

import { useLocale } from "next-intl";
import { Button } from "@heroui/react";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";

interface LocaleSwitcherProps {
  label?: string;
  fullWidth?: boolean;
}

/**
 * Toggles between Vietnamese and English while preserving the current path.
 * `usePathname` from next-intl returns the path without the locale prefix, so
 * `router.replace` with the target locale re-applies the correct prefix
 * (no prefix for the default `vi`, `/en` for English).
 */
const LocaleSwitcher = ({ label = "Select language", fullWidth }: LocaleSwitcherProps) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const target = locale === "vi" ? "en" : "vi";

  return (
    <Button
      variant="ghost"
      aria-label={label}
      fullWidth={fullWidth}
      onPress={() => router.replace(pathname, { locale: target })}
    >
      <Languages size={18} aria-hidden />
      <span className="text-xs font-semibold uppercase">{target}</span>
    </Button>
  );
};

export default LocaleSwitcher;
