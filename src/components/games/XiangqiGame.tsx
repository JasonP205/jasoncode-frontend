"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chip } from "@heroui/react";
import { Landmark, Sparkles, Swords, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import GameScaffold, { type GameMode } from "./GameScaffold";
import {
  applyXiangqiMove,
  chooseBestXiangqiMove,
  createInitialXiangqiState,
  formatXiangqiMove,
  getAllLegalXiangqiMoves,
  getLegalXiangqiMovesForSquare,
  getXiangqiPieceLabel,
  type XiangqiMove,
  type XiangqiPosition,
  type XiangqiState,
} from "@/lib/games/xiangqi";
import { cn } from "@/lib/utils";

const files = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];

function getTurnLabel(turn: XiangqiState["turn"]) {
  return turn === "r" ? "Đỏ" : "Đen";
}

function getWinnerLabel(winner: XiangqiState["winner"]) {
  if (winner === "r") return "Đỏ thắng";
  if (winner === "b") return "Đen thắng";
  if (winner === "draw") return "Hòa cờ";
  return "Ván đấu đang diễn ra";
}

export default function XiangqiGame() {
  const [mode, setMode] = useState<GameMode>("ai");
  const [state, setState] = useState(createInitialXiangqiState);
  const [selected, setSelected] = useState<XiangqiPosition | null>(null);
  const [legalMoves, setLegalMoves] = useState<XiangqiMove[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<XiangqiMove | null>(null);
  const [movingPiece, setMovingPiece] = useState<{
    from: XiangqiPosition;
    to: XiangqiPosition;
    label: string;
    color: XiangqiState["turn"];
  } | null>(null);
  const boardGridRef = useRef<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState(0);
  const isAiTurn = mode === "ai" && state.turn === "b" && !state.winner;

  const resetGame = (nextMode = mode) => {
    setMode(nextMode);
    setState(createInitialXiangqiState());
    setSelected(null);
    setLegalMoves([]);
    setHistory([]);
    setLastMove(null);
    setMovingPiece(null);
  };

  const commitMove = useCallback((move: XiangqiMove, source: "player" | "ai") => {
    const currentPiece = state.board[move.from.row][move.from.col];
    if (currentPiece) {
      setMovingPiece({
        from: move.from,
        to: move.to,
        label: getXiangqiPieceLabel(currentPiece),
        color: currentPiece.color,
      });
    }

    setState((current) => applyXiangqiMove(current, move));
    setSelected(null);
    setLegalMoves([]);
    setLastMove(move);
    setHistory((current) => [
      `${source === "ai" ? "Máy" : "Người chơi"}: ${formatXiangqiMove(move)}`,
      ...current,
    ].slice(0, 12));
  }, [state.board]);

  useEffect(() => {
    const updateCellSize = () => {
      if (!boardGridRef.current) return;
      setCellSize(boardGridRef.current.clientWidth / 9);
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  useEffect(() => {
    if (!movingPiece) return;
    const timer = window.setTimeout(() => setMovingPiece(null), 300);
    return () => window.clearTimeout(timer);
  }, [movingPiece]);

  const handleSquareClick = (row: number, col: number) => {
    if (isAiTurn || state.winner) return;

    const piece = state.board[row][col];
    const targetPosition = { row, col };

    if (selected) {
      const move = legalMoves.find((candidate) => candidate.to.row === row && candidate.to.col === col);
      if (move) {
        commitMove(move, "player");
        return;
      }
    }

    if (!piece || piece.color !== state.turn) {
      setSelected(null);
      setLegalMoves([]);
      return;
    }

    if (mode === "ai" && piece.color === "b") {
      return;
    }

    setSelected(targetPosition);
    setLegalMoves(getLegalXiangqiMovesForSquare(state, targetPosition));
  };

  useEffect(() => {
    if (mode !== "ai" || state.turn !== "b" || state.winner) return;

    const availableMoves = getAllLegalXiangqiMoves(state, "b");
    if (!availableMoves.length) return;

    const timer = window.setTimeout(() => {
      const bestMove = chooseBestXiangqiMove(state, "b") ?? availableMoves[0];
      commitMove(bestMove, "ai");
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [commitMove, mode, state]);

  const board = (
    <div className="mx-auto w-full max-w-[820px]">
      <div className="mb-2 grid grid-cols-[20px_repeat(9,minmax(0,1fr))] gap-1.5 px-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-default-400 sm:mb-3 sm:grid-cols-[24px_repeat(9,minmax(0,1fr))] sm:gap-2 sm:text-xs">
        <div />
        {files.map((file) => (
          <div key={file}>{file}</div>
        ))}
      </div>

      <div className="grid grid-cols-[20px_minmax(0,1fr)] gap-1.5 sm:grid-cols-[24px_minmax(0,1fr)] sm:gap-2">
        <div className="grid grid-rows-10 gap-1.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-default-400 sm:gap-2 sm:text-xs">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center justify-center">
              {10 - index}
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] bg-gradient-to-br from-[#f2d8ae] via-[#e9c990] to-[#dfba77] p-2.5 shadow-inner sm:rounded-[1.8rem] sm:p-3">
          <div ref={boardGridRef} className="relative grid grid-cols-9 gap-1.5 sm:gap-2">
            {state.board.map((boardRow, rowIndex) =>
              boardRow.map((piece, colIndex) => {
                const isSelected =
                  selected?.row === rowIndex && selected?.col === colIndex;
                const isTarget = legalMoves.some(
                  (move) => move.to.row === rowIndex && move.to.col === colIndex,
                );
                const partOfLastMove =
                  lastMove &&
                  (samePosition(lastMove.from, rowIndex, colIndex) ||
                    samePosition(lastMove.to, rowIndex, colIndex));
                const hideForAnimation =
                  movingPiece &&
                  movingPiece.to.row === rowIndex &&
                  movingPiece.to.col === colIndex;

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    className={cn(
                      "relative aspect-square rounded-full border-2 border-[#8a5c22] bg-[#f7ebd1] text-[clamp(0.95rem,2vw,1.75rem)] font-black shadow-sm transition duration-200",
                      isSelected && "scale-[0.97] ring-4 ring-amber-950/15",
                      isTarget && "ring-4 ring-emerald-400/35",
                      partOfLastMove && "border-amber-300 shadow-[0_0_0_3px_rgba(251,191,36,0.2)]",
                      piece?.color === "r" ? "text-red-700" : "text-slate-900",
                      !piece && "bg-[#efd3a0]/70 text-transparent hover:bg-[#efd3a0]",
                    )}
                    aria-label={`hang-${rowIndex + 1}-cot-${colIndex + 1}`}
                  >
                    {piece ? (
                      <span className={cn("transition-all duration-200", hideForAnimation && "opacity-0 scale-90")}>
                        {getXiangqiPieceLabel(piece)}
                      </span>
                    ) : (
                      "•"
                    )}
                    {isTarget && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/80" />
                      </span>
                    )}
                  </button>
                );
              }),
            )}

            <AnimatePresence>
              {movingPiece && cellSize > 0 ? (
                <motion.div
                  key={`${movingPiece.from.row}-${movingPiece.from.col}-${movingPiece.to.row}-${movingPiece.to.col}-${movingPiece.label}`}
                  initial={{
                    x: movingPiece.from.col * cellSize,
                    y: movingPiece.from.row * cellSize,
                    scale: 0.95,
                    opacity: 0.96,
                  }}
                  animate={{
                    x: movingPiece.to.col * cellSize,
                    y: movingPiece.to.row * cellSize,
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute left-0 top-0 z-20 flex items-center justify-center"
                  style={{ width: cellSize - 8, height: cellSize - 8 }}
                >
                  <span
                    className={cn(
                      "flex h-full w-full items-center justify-center rounded-full border-2 border-[#8a5c22] bg-[#f7ebd1] text-[clamp(1rem,2.1vw,1.75rem)] font-black shadow-lg",
                      movingPiece.color === "r" ? "text-red-700" : "text-slate-900",
                    )}
                  >
                    {movingPiece.label}
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="my-2 rounded-2xl border border-amber-900/15 bg-[#f6e0b6]/60 px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.34em] text-amber-950/75 sm:my-3 sm:py-3 sm:text-xs">
            Sông
          </div>
        </div>
      </div>
    </div>
  );

  const sidebar = (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_1.2fr]">
      <div className="rounded-[1.35rem] border border-default-200 bg-white/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-default-500">Trạng thái ván</p>
            <h3 className="text-lg font-bold text-foreground">{getWinnerLabel(state.winner)}</h3>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip variant="soft" className="bg-default-100 px-3 py-4 text-sm font-semibold">
            Lượt: {getTurnLabel(state.turn)}
          </Chip>
          <Chip
            variant="soft"
            className={cn(
              "px-3 py-4 text-sm font-semibold",
              mode === "ai" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800",
            )}
          >
            {mode === "ai" ? "Đấu với máy" : "2 người cùng máy"}
          </Chip>
          {isAiTurn ? (
            <Chip variant="soft" className="bg-amber-100 px-3 py-4 text-sm font-semibold text-amber-800">
              Máy đang tính nước
            </Chip>
          ) : null}
        </div>
      </div>

      <div className="rounded-[1.35rem] border border-default-200 bg-white/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-default-100 text-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-default-500">Cách chơi</p>
            <h3 className="text-lg font-bold text-foreground">Đi quân trực tiếp trên cùng thiết bị</h3>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
          <li>Chạm quân để xem nước đi hợp lệ.</li>
          <li>Chế độ máy: bạn cầm đỏ, máy cầm đen.</li>
          <li>Chế độ local: 2 người thay phiên trên cùng máy.</li>
        </ul>
      </div>

      <div className="rounded-[1.35rem] border border-default-200 bg-white/80 p-4 lg:col-span-2 xl:col-span-1">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-default-100 text-foreground">
            <Swords className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-default-500">Nước đi gần đây</p>
            <h3 className="text-lg font-bold text-foreground">Lịch sử ván đấu</h3>
          </div>
        </div>

        <div className="mt-4 max-h-64 space-y-2 overflow-auto pr-1">
          {history.length ? (
            history.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-2xl border border-default-200 bg-default-50 px-3 py-2 text-sm text-foreground/80"
              >
                {item}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-default-200 px-3 py-4 text-sm text-muted">
              Chưa có nước đi nào. Quân đỏ mở màn trước nhé.
            </div>
          )}
        </div>
      </div>

      {state.winner ? (
        <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50 p-4 text-amber-900 lg:col-span-2 xl:col-span-3">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5" />
            <p className="font-semibold">{getWinnerLabel(state.winner)}</p>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <GameScaffold
      title="Cờ Tướng"
      eyebrow="Traditional Strategy"
      description="Bàn cờ tướng được thiết kế theo cùng phong cách của route gốc, có sẵn chế độ đấu máy và 2 người cùng máy để bạn chơi nhanh ngay trên trình duyệt."
      mode={mode}
      onChangeMode={(nextMode) => resetGame(nextMode)}
      onReset={() => resetGame()}
      status={isAiTurn ? "Máy đang suy nghĩ..." : state.statusText}
      helper="Máy sẽ điều khiển quân đen. Khi chuyển sang 2 người, cả hai người chơi điều khiển ngay trên cùng một bàn cờ, không có phòng online."
      board={board}
      sidebar={sidebar}
    />
  );
}

function samePosition(position: XiangqiPosition, row: number, col: number) {
  return position.row === row && position.col === col;
}
