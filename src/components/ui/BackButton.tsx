"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  children?: React.ReactNode;
  fallbackHref?: string;
  className?: string;
}

export function BackButton({
  children = "Back",
  fallbackHref,
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "group inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-foreground",
        className
      )}
    >
      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {children}
    </button>
  );
}