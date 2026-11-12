
export interface HeadlineSegment {
  text: string;
  /** The one word or phrase that gets the pink highlighter (`.pop-mark`). */
  accent?: boolean;
  /** Greyed, the quiet half of a two-part headline. */
  quiet?: boolean;
}

interface HeadlineProps {
  segments: HeadlineSegment[];
  as?: "h1" | "h2" | "p";
  className?: string;
}

/**
 * A page headline built from segments. Plain server-rendered text (it is
 * usually the LCP element); an `accent` segment gets the pink highlighter —
 * at most one per page, so it stays a surprise.
 */
export default function Headline({ segments, as: Tag = "h1", className }: HeadlineProps) {
  return (
    <Tag className={className}>
      {segments.map((s, i) =>
        s.accent ? (
          <span key={i} className="pop-mark">
            {s.text}
          </span>
        ) : s.quiet ? (
          <span key={i} className="headline-quiet">
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </Tag>
  );
}
