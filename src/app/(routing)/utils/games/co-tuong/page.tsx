import type { Metadata } from "next";
import XiangqiGame from "@/components/games/XiangqiGame";

export const metadata: Metadata = {
  title: "Cờ tướng",
  description:
    "Chơi cờ tướng trực tiếp trên website với chế độ đấu máy hoặc 2 người cùng một thiết bị, giữ đúng phong cách giao diện của route gốc.",
};

export default function XiangqiPage() {
  return <XiangqiGame />;
}
