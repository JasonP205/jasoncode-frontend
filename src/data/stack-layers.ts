/**
 * What Phuc uses on each layer of the stack, top (interface) to bottom
 * (infra). The order matches `LAYER_NAMES` in `LayerScene` and the
 * `profile.stack.layers` labels. Only list tools that appear in the CV
 * (`src/data/cv.ts`) or a project under `src/data/projects.ts`.
 */
export const stackLayers: string[][] = [
  ["React", "Next.js", "React Native", "Expo", "Tailwind CSS", "shadcn/ui", "Vite"],
  ["TypeScript", "Zustand", "Zod", "React Hook Form"],
  ["Node.js", "Express", "NestJS", "REST", "Socket.IO", "JWT"],
  ["PostgreSQL", "MongoDB", "MySQL", "SQLite"],
  ["Docker", "Git", "GitHub", "Vercel", "Render", "Cloudinary"],
];
