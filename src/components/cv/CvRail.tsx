"use client";

import { useEffect, useState } from "react";
import { focusLayer } from "@/components/ui/three/LayerScene";
import { play } from "@/lib/sound/engine";
import { cn } from "@/lib/utils";
import { toneCycle, toneText } from "@/components/ui/tones";

interface CvRailProps {
  label: string;
  items: { id: string; title: string }[];
}

/**
 * The CV's table of contents as a depth gauge: L0 at the top, L4 at the
 * bottom. The current section is the one whose top has passed 40% of the
 * viewport; changing it brings the same layer forward in the hero's stack and
 * plays the "one layer down" cue (only after the visitor has scrolled, so
 * nothing sounds on load).
 */
export default function CvRail({ label, items }: CvRailProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let current = -1;
    let scrolled = false;
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
        if (current !== -1 && scrolled) play("layer", index);
        current = index;
        setActive(index);
        focusLayer(index);
      }
    };
    const onScroll = () => {
      scrolled = true;
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
                    ? "border-current font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <span className={cn("font-mono text-xs", on ? toneText[toneCycle[i]] : "")}>
                  L{i}
                </span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
