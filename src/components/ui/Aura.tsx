import { cn } from "@/lib/utils";
import LayerScene from "./three/LayerScene";

/**
 * The backdrop behind every page hero: two quiet three.js layer stacks at the
 * edges of the frame over a faint wash of the layer tones. The copy sits in
 * the middle, where the mask fades the scene out, so it never fights a
 * headline. The wash alone is what shows before WebGL loads (or without it).
 *
 * Place inside a `relative isolate overflow-hidden` section: the backdrop sits
 * at `-z-10` within that stacking context and never causes horizontal scroll.
 */
export default function Aura({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem]", className)}
    >
      <div className="layer-wash absolute inset-0" />
      <LayerScene
        variant="field"
        className="absolute inset-0 opacity-0 transition-opacity duration-1000 data-ready:opacity-60 dark:data-ready:opacity-75 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_40%,transparent_22%,black_70%)]"
      />
    </div>
  );
}
