import type { Metadata } from "next";
import ChessGame from "@/components/games/ChessGame";

export const metadata: Metadata = {
  title: "Cờ vua",
  description:
    "Chơi cờ vua trực tiếp trên website với 2 chế độ: đấu với máy hoặc 2 người cùng máy. Giao diện được thiết kế đồng bộ với toàn bộ website.",
};

export default function ChessPage() {
  return <ChessGame />;
}
