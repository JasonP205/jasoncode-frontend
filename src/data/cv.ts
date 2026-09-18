/**
 * The CV rendered at `/cv`, transcribed from `public/cv/CV.pdf` so the page can
 * be real HTML: selectable, themeable, responsive and crawlable, instead of an
 * embedded PDF that only paints on desktop.
 *
 * Content stays in English on purpose — it is the CV as written and sent to
 * recruiters. Only the surrounding page chrome is translated.
 *
 * Keep this in sync whenever the PDF is replaced.
 */

export interface CvSkillGroup {
  label: string;
  items: string[];
}

export interface CvProject {
  name: string;
  stack: string[];
  live: string;
  bullets: string[];
}

export const cv = {
  name: "Hoang Phuc Phan",
  role: "Software Engineer — Full-Stack Web and Mobile Developer",
  location: "Ho Chi Minh City, Vietnam",
  phone: "+84 798 020 513",
  email: "phuc20513@gmail.com",
  portfolio: { label: "hwagfu.dev", href: "https://hwagfu.dev" },
  github: { label: "github.com/JasonP205", href: "https://github.com/JasonP205" },

  summary:
    "Final-year Computing student at the University of Greenwich Vietnam and freelance web developer who has shipped production applications in React, Next.js, TypeScript, Node.js, Express and MongoDB. Experienced in RESTful API design, real-time systems with Socket.IO, JWT authentication, RBAC and SEO. Seeking a Frontend, Backend or Full-Stack Developer role in Ho Chi Minh City.",

  skills: [
    {
      label: "Programming Languages",
      items: ["JavaScript", "TypeScript", "PHP"],
    },
    {
      label: "Frontend",
      items: [
        "React",
        "Next.js (App Router)",
        "React Native",
        "Expo",
        "Vite",
        "Tailwind CSS",
        "shadcn/ui",
        "Zustand",
        "Zod",
      ],
    },
    {
      label: "Backend",
      items: [
        "Node.js",
        "Express",
        "NestJS",
        "RESTful API",
        "Socket.IO",
        "JWT and refresh sessions",
        "bcrypt",
      ],
    },
    {
      label: "Databases",
      items: ["PostgreSQL", "MongoDB (Mongoose)", "MySQL", "SQLite"],
    },
    {
      label: "Tools and Platforms",
      items: [
        "Git",
        "GitHub",
        "Docker",
        "Vercel",
        "Render",
        "Cloudinary",
        "Postman",
      ],
    },
    {
      label: "Concepts",
      items: [
        "Real-Time Systems",
        "RBAC",
        "Responsive Design",
        "SEO",
        "Agile/Scrum",
      ],
    },
  ] satisfies CvSkillGroup[],

  projects: [
    {
      name: "Bamboo House — Restaurant Management System",
      stack: ["React", "TypeScript", "Express", "MongoDB", "Socket.IO"],
      live: "https://bamboohouse.hwagfu.dev",
      bullets: [
        "Developed a bilingual multi-branch restaurant platform with QR-based ordering at the table and real-time order tracking across branches via Socket.IO.",
        "Implemented role-based access control, employee management and end-to-end menu and order workflows, with automatic English/Vietnamese translation of food descriptions.",
      ],
    },
    {
      name: "Chap — Real-Time Chat Platform",
      stack: [
        "React 19",
        "TypeScript",
        "Zustand",
        "Express 5",
        "MongoDB",
        "Socket.IO",
      ],
      live: "https://mojichat.hwagfu.dev",
      bullets: [
        "Built a full-stack messaging app with private and group chats, username search, friend requests, unread counts, online presence and read receipts pushed instantly over Socket.IO.",
        "Implemented infinite-scroll message history and secured the API with JWT access tokens, database-backed refresh sessions, bcrypt hashing and Cloudinary avatar uploads.",
      ],
    },
    {
      name: "L3GO Coffee — Client Website",
      stack: ["Next.js", "TypeScript", "Design System", "SEO"],
      live: "https://legocoffee.hwagfu.dev",
      bullets: [
        "Delivered a client website for a four-storey coffee shop in Can Tho on Next.js App Router, with a custom design system, light/dark themes, structured data, sitemap and canonical tags.",
        "Built a 68-item menu filterable by mood, drinking style and budget, with filter state in the query string and per-item URLs so any shared link reopens the exact view.",
      ],
    },
  ] satisfies CvProject[],

  education: {
    school: "University of Greenwich — Vietnam",
    location: "Ho Chi Minh City, Vietnam",
    degree: "Bachelor of Computing — Software Engineering",
    period: "Aug 2023 — Present (Final-year student)",
    gpa: "Provisional average (to date): 65% · US GPA equiv.: ~3.5/4.00",
    languages:
      "Vietnamese (Native), English B2 Proficiency (VSTEP), Chinese Basic Level (HSK 2)",
  },
} as const;
