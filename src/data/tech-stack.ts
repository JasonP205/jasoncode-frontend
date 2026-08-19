/**
 * The tech stack shown in the Skills section, grouped by what each tool is
 * *for* rather than as one flat list of logos.
 *
 * Only list things that have actually shipped in a project under
 * `src/data/projects.ts` (or that back this site) — the section reads as a
 * capability claim, so an aspirational entry here is a lie to a client.
 *
 * Two flags handle logos that are not full-colour artwork:
 * - `mono` — a solid *black* glyph (Next.js, Express, GitHub, Vercel). It
 *   vanishes against the dark theme, so it gets inverted.
 * - `tint` — a `currentColor` glyph (the Simple Icons set). It already follows
 *   the text colour, so inverting it would break it in both themes.
 *
 * See `TechIcon` in `src/components/ui/TechMarquee.tsx`.
 */
export interface Tech {
  name: string;
  icon: string;
  /** Solid-black artwork — invert it in dark mode. */
  mono?: boolean;
  /** `currentColor` artwork — leave it alone, it follows the text colour. */
  tint?: boolean;
}

export interface TechCategory {
  /** Key into the `skills.categories` message namespace. */
  id: "frontend" | "backend" | "database" | "devops";
  items: Tech[];
}

export const techStack: TechCategory[] = [
  {
    id: "frontend",
    items: [
      { name: "Next.js", icon: "devicon:nextjs", mono: true },
      { name: "React", icon: "devicon:react" },
      { name: "TypeScript", icon: "devicon:typescript" },
      { name: "Tailwind CSS", icon: "devicon:tailwindcss" },
      { name: "React Native", icon: "devicon:react" },
    ],
  },
  {
    id: "backend",
    items: [
      { name: "Node.js", icon: "devicon:nodejs" },
      { name: "NestJS", icon: "devicon:nestjs" },
      { name: "Express", icon: "devicon:express", mono: true },
      { name: "Socket.IO", icon: "devicon:socketio", mono: true },
      { name: "PHP", icon: "devicon:php" },
    ],
  },
  {
    id: "database",
    items: [
      { name: "PostgreSQL", icon: "devicon:postgresql" },
      { name: "MySQL", icon: "devicon:mysql" },
      { name: "MongoDB", icon: "devicon:mongodb" },
      { name: "SQLite", icon: "devicon:sqlite" },
    ],
  },
  {
    id: "devops",
    items: [
      { name: "Docker", icon: "devicon:docker" },
      { name: "GitHub", icon: "devicon:github", mono: true },
      { name: "Git", icon: "devicon:git" },
      { name: "Vercel", icon: "devicon:vercel", mono: true },
      // Not in devicon — Simple Icons only, hence `tint` rather than `mono`.
      { name: "Render", icon: "simple-icons:render", tint: true },
    ],
  },
];
