import { cn } from "@/lib/utils";

/**
 * A soft wash of the brand's rainbow behind a hero — light, not an object.
 * Five blurred blobs on two different orbits drift slowly (CSS only; frozen for reduced motion) and
 * the whole field fades out toward its edges.
 *
 * Place inside a `relative isolate overflow-hidden` section: the aura sits at
 * `-z-10` within that stacking context and never causes horizontal scroll.
 */
export default function Aura({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] opacity-70 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_38%,black,transparent)] dark:opacity-45",
        className,
      )}
    >
      <div className="animate-aura absolute top-[12%] left-[18%] size-[26rem] rounded-full bg-[#ff9a8b]/55 blur-3xl sm:size-[32rem]" />
      <div className="animate-aura absolute top-[4%] right-[16%] size-[24rem] rounded-full bg-[#a78bfa]/50 blur-3xl [animation-delay:-7s] sm:size-[30rem]" />
      <div className="animate-aura absolute top-[34%] left-[38%] size-[22rem] rounded-full bg-[#60a5fa]/45 blur-3xl [animation-delay:-13s] sm:size-[28rem]" />
      {/* Two more layers on a wider orbit, so the colour keeps shifting. */}
      <div className="animate-aura-orbit absolute top-[22%] left-[46%] size-[18rem] rounded-full bg-[#ffa24c]/40 blur-3xl [animation-delay:-5s] sm:size-[24rem]" />
      <div className="animate-aura-orbit absolute top-[48%] left-[10%] size-[16rem] rounded-full bg-[#2ee6a8]/30 blur-3xl [animation-delay:-17s] sm:size-[22rem]" />
    </div>
  );
}
