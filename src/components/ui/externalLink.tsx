import React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
const externalLink = ({ url, label, className }: { url?: string; label: string; className?: string }) => {
    if (!url) {
        return <span className={cn("text-muted text-center", className)}>{label}</span>;
    }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-muted transition-colors hover:underline-offset-4 decoration-dashed decoration-1 duration-200 hover:underline text-center flex min-w-fit", className)}
    >
      {label}
      <ExternalLink size={12} />
    </a>
  );
};

export default externalLink;
