import type { Metadata } from "next";
import Link from "next/link";
import { BrainCircuit, Landmark, Trophy } from "lucide-react";
import MotionDiv from "@/components/ui/motionDiv";

export const metadata: Metadata = {
  title: "Game bàn cờ",
  description:
    "Danh sách các trò chơi bàn cờ mini gồm cờ vua và cờ tướng, có thể chơi với máy hoặc 2 người trên cùng một thiết bị.",
};

const games = [
  {
    href: "/utils/games/co-vua",
    title: "Cờ Vua",
    description:
      "Bàn cờ tiêu chuẩn 8x8 với chế độ đấu máy hoặc 2 người cùng chơi trên một máy.",
    icon: Trophy,
    badge: "Classic",
  },
  {
    href: "/utils/games/co-tuong",
    title: "Cờ Tướng",
    description:
      "Bàn cờ tướng 9x10 với luật đi cơ bản, hỗ trợ đấu máy và chơi local 2 người.",
    icon: Landmark,
    badge: "Traditional",
  },
];

export default function GamesPage() {
  return (
    <div className="relative overflow-hidden py-12 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(244,244,245,0.8)_45%,rgba(235,235,235,0.5)_100%)]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-4xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-default-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-default-600 shadow-sm">
            <BrainCircuit className="h-4 w-4" />
            Mini board games
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Chọn bàn cờ bạn muốn chơi
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            Hai game đều hỗ trợ chơi với máy và chế độ 2 người trên cùng một thiết bị.
            Mình giữ cùng ngôn ngữ giao diện với root route để trải nghiệm vẫn liền mạch.
          </p>
        </MotionDiv>

        <div className="grid gap-6 md:grid-cols-2">
          {games.map((game, index) => {
            const Icon = game.icon;

            return (
              <MotionDiv
                key={game.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Link
                  href={game.href}
                  className="group block rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_rgba(20,20,20,0.08)] transition hover:-translate-y-1 hover:shadow-[0_36px_90px_rgba(20,20,20,0.12)] sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-black text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-default-200 bg-default-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-default-500">
                      {game.badge}
                    </span>
                  </div>

                  <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground">
                    {game.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {game.description}
                  </p>

                  <div className="mt-8 inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-black/90">
                    Vào chơi ngay
                  </div>
                </Link>
              </MotionDiv>
            );
          })}
        </div>
      </div>
    </div>
  );
}
