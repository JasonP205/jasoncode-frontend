import { cn } from "@/lib/utils";

interface RainbowTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Emphasises a word with an animated rainbow gradient clipped to the text,
 * backed by a soft blurred "splash" of the same colours. Pure CSS (no hooks),
 * so it stays a server component and respects `prefers-reduced-motion` via the
 * `animate-rainbow` utility defined in globals.css.
 */
const RainbowText = ({ children, className }: RainbowTextProps) => {
  return (
    <span className={cn("relative inline-block italic overflow-visible", className)}>
      {/* Blurred rainbow splash behind the word */}
      <span
        aria-hidden
        className="animate-rainbow pointer-events-none absolute -inset-x-2 inset-y-0 -z-10 rounded-full bg-[linear-gradient(110deg,#ff6b6b,#f9d423,#34d399,#3b82f6,#a855f7,#ff6b6b)] bg-size-[200%_auto] opacity-30 blur-2xl dark:opacity-40"
      />
      {/* Gradient-filled text. The padding (pulled back with matching negative
          margins) enlarges the background-clip:text paint box so the italic
          overshoot — slanted tips and tall serif ascenders — is still painted
          instead of being clipped at the element's edge. */}
      <span className="animate-rainbow bg-[linear-gradient(110deg,#ff6b6b,#f9d423,#34d399,#3b82f6,#a855f7,#ff6b6b)] bg-size-[200%_auto] bg-clip-text text-transparent px-[0.14em] mx-[-0.14em] py-[0.14em] my-[-0.14em]">
        {children}
      </span>
    </span>
  );
};

export default RainbowText;
