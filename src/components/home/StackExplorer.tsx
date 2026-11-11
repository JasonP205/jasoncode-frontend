"use client";

import { useState } from "react";
import LayerScene, { LAYER_NAMES } from "@/components/ui/three/LayerScene";
import { play } from "@/lib/sound/engine";
import { cn } from "@/lib/utils";
import { toneCycle, toneText } from "@/components/ui/tones";

interface StackExplorerProps {
  labels: string[];
  layers: string[][];
}

/**
 * The five layers as rows beside a sticky three.js stack. Hovering, focusing
 * or tapping a row slides that layer out of the stack and plays its note; the
 * row expands to show what lives there. Works by keyboard and touch — the
 * rows are buttons — and the list alone carries all the content.
 */
export default function StackExplorer({ labels, layers }: StackExplorerProps) {
  const [active, setActive] = useState(0);

  const select = (index: number) => {
    if (index === active) return;
    setActive(index);
    play("layer", index);
  };

  return (
    <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <ol className="divide-y divide-border border-y border-border">
        {labels.map((label, i) => {
          const open = i === active;
          return (
            <li key={label}>
              <button
                type="button"
                data-sound="self"
                aria-expanded={open}
                onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
                onFocus={() => select(i)}
                onClick={() => select(i)}
                className="group flex w-full items-baseline gap-5 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                <span className={cn("layer-tag w-10 shrink-0", toneText[toneCycle[i]])}>L{i}</span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block text-xl font-semibold tracking-tight transition-colors sm:text-2xl",
                      open ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {label}
                    <span className="ml-3 font-mono text-xs font-normal text-muted-foreground">
                      {LAYER_NAMES[i]}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="flex flex-wrap gap-1.5 pt-3">
                        {layers[i].map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-tile px-3 py-1 text-sm text-foreground/80 shadow-[inset_0_0_0_1px_var(--border)]"
                          >
                            {item}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative order-first h-[18rem] sm:h-[24rem] lg:sticky lg:top-24 lg:order-none lg:h-[30rem]">
        <LayerScene
          variant="stack"
          focus={active}
          className="absolute inset-0 opacity-0 transition-opacity duration-1000 data-ready:opacity-100"
        />
      </div>
    </div>
  );
}
