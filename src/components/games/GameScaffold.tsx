"use client";

import MotionDiv from "@/components/ui/motionDiv";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";
import { Bot, RotateCcw, Users } from "lucide-react";
import Link from "next/link";

export type GameMode = "ai" | "local";

interface GameScaffoldProps {
  title: string;
  eyebrow: string;
  description: string;
  mode: GameMode;
  onChangeMode: (mode: GameMode) => void;
  onReset: () => void;
  status: string;
  helper: string;
  board: React.ReactNode;
  sidebar: React.ReactNode;
  accentClassName?: string;
}

export default function GameScaffold({
  title,
  eyebrow,
  description,
  mode,
  onChangeMode,
  onReset,
  status,
  helper,
  board,
  sidebar,
  accentClassName,
}: GameScaffoldProps) {
  return (
    <div className="relative overflow-hidden py-8 sm:py-12 lg:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(244,244,245,0.85)_40%,rgba(232,232,232,0.55)_100%)]" />
      <div className="absolute left-[-5%] top-10 -z-10 h-64 w-64 rounded-full bg-black/5 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute right-[-8%] top-1/3 -z-10 h-72 w-72 rounded-full bg-black/5 blur-3xl sm:h-96 sm:w-96" />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-8 lg:gap-10">
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-default-200 bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-default-600 shadow-sm">
              {eyebrow}
            </span>
            <Link
              href="/utils/games"
              className="rounded-full border border-default-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-default-600 transition hover:bg-white"
            >
              Quay lại danh sách game
            </Link>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base lg:text-lg">
              {description}
            </p>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className={cn(
            "mx-auto w-full max-w-[1120px] overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 p-3 shadow-[0_30px_90px_rgba(20,20,20,0.08)] backdrop-blur sm:rounded-[2.2rem] sm:p-5 lg:p-7",
            accentClassName,
          )}
        >
          <div className="mb-4 grid gap-4 border-b border-default-200/80 pb-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="text-center lg:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-default-500">
                Bàn cờ
              </p>
              <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">{status}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{helper}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
              <Button
                onPress={() => onChangeMode("ai")}
                className={cn(
                  "rounded-full px-4 text-sm font-semibold",
                  mode === "ai" ? "bg-black text-white" : "border border-default-200 bg-white text-foreground",
                )}
              >
                <Bot className="h-4 w-4" />
                Chơi với máy
              </Button>
              <Button
                onPress={() => onChangeMode("local")}
                className={cn(
                  "rounded-full px-4 text-sm font-semibold",
                  mode === "local" ? "bg-black text-white" : "border border-default-200 bg-white text-foreground",
                )}
              >
                <Users className="h-4 w-4" />
                2 người cùng máy
              </Button>
              <Button
                onPress={onReset}
                className="rounded-full border border-default-200 bg-white px-4 text-sm font-semibold text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Chơi lại
              </Button>
            </div>
          </div>
          <div className="flex justify-center rounded-[1.5rem] bg-gradient-to-b from-white to-default-50/50 p-2 sm:p-3">
            {board}
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mx-auto w-full max-w-6xl rounded-[1.75rem] border border-white/70 bg-white/88 p-4 shadow-[0_24px_70px_rgba(20,20,20,0.07)] backdrop-blur sm:p-6"
        >
          {sidebar}
        </MotionDiv>
      </div>
    </div>
  );
}
