"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CvRailProps {
  label: string;
  items: { id: string; title: string }[];
}

/**
 * The CV's table of contents. The current section is the one whose top has
 * passed 40% of the viewport; it is marked in navy with a pink tick.
 */
export default function CvRail({ label, items }: CvRailProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let current = -1;
    let frame = 0;
    const sections = items.map(({ id }) => document.getElementById(id));

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let index = 0;
      sections.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) index = i;
      });
      if (index !== current) {
        current = index;
        setActive(index);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label={label} className="sticky top-24 hidden lg:block">
      <ol className="relative space-y-1 border-l border-border">
        {items.map((item, i) => {
          const on = i === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "-ml-px flex items-center gap-3 border-l-2 py-2 pl-4 text-sm transition-colors",
                  on
                    ? "border-pop font-semibold text-hue-blue"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
