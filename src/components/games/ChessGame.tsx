"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chip } from "@heroui/react";
import { Crown, Sparkles, Swords, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import GameScaffold, { type GameMode } from "./GameScaffold";
import {
  applyChessMove,
  chooseBestChessMove,
  createInitialChessState,
  formatChessMove,
  getAllLegalMoves,
  getChessPieceLabel,
  getLegalMovesForSquare,
  type ChessMove,
  type ChessPosition,
  type ChessState,
} from "@/lib/games/chess";
import { cn } from "@/lib/utils";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

function getTurnLabel(turn: ChessState["turn"]) {
  return turn === "w" ? "Trắng" : "Đen";
}

function getWinnerLabel(winner: ChessState["winner"]) {
  if (winner === "w") return "Trắng thắng";
  if (winner === "b") return "Đen thắng";
  if (winner === "draw") return "Hòa cờ";
  return "Ván đấu đang diễn ra";
}

function getSquareTone(row: number, col: number) {
  return (row + col) % 2 === 0
    ? "bg-[#f4efe6] text-slate-800"
    : "bg-[#8a6c4d] text-white";
}

export default function ChessGame() {
  const [mode, setMode] = useState<GameMode>("ai");
  const [state, setState] = useState(createInitialChessState);
  const [selected, setSelected] = useState<ChessPosition | null>(null);
  const [legalMoves, setLegalMoves] = useState<ChessMove[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<ChessMove | null>(null);
  const [movingPiece, setMovingPiece] = useState<{
    from: ChessPosition;
    to: ChessPosition;
    label: string;
    color: ChessState["turn"];
  } | null>(null);
  const boardGridRef = useRef<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState(0);
  const isAiTurn = mode === "ai" && state.turn === "b" && !state.winner;

  const resetGame = (nextMode = mode) => {
    setMode(nextMode);
    setState(createInitialChessState());
    setSelected(null);
    setLegalMoves([]);
    setHistory([]);
    setLastMove(null);
    setMovingPiece(null);
  };

  const commitMove = useCallback((move: ChessMove, source: "player" | "ai") => {
    const currentPiece = state.board[move.from.row][move.from.col];
    if (currentPiece) {
      setMovingPiece({
        from: move.from,
        to: move.to,
        label: getChessPieceLabel(currentPiece),
        color: currentPiece.color,
      });
    }

    setState((current) => applyChessMove(current, move));
    setSelected(null);
    setLegalMoves([]);
    setLastMove(move);
    setHistory((current) => [
      `${source === "ai" ? "Máy" : "Người chơi"}: ${formatChessMove(move)}`,
      ...current,
    ].slice(0, 12));
  }, [state.board]);

  useEffect(() => {
    const updateCellSize = () => {
      if (!boardGridRef.current) return;
      setCellSize(boardGridRef.current.clientWidth / 8);
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  useEffect(() => {
    if (!movingPiece) return;
    const timer = window.setTimeout(() => setMovingPiece(null), 280);
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
    setLegalMoves(getLegalMovesForSquare(state, targetPosition));
  };

  useEffect(() => {
    if (mode !== "ai" || state.turn !== "b" || state.winner) return;

    const availableMoves = getAllLegalMoves(state, "b");
    if (!availableMoves.length) return;

    const timer = window.setTimeout(() => {
      const bestMove = chooseBestChessMove(state, "b") ?? availableMoves[0];
      commitMove(bestMove, "ai");
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [commitMove, mode, state]);

  const board = (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="mb-2 grid grid-cols-[20px_repeat(8,minmax(0,1fr))] gap-1.5 px-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-default-400 sm:mb-3 sm:grid-cols-[24px_repeat(8,minmax(0,1fr))] sm:gap-2 sm:text-xs">
        <div />
        {files.map((file) => (
          <div key={file}>{file}</div>
        ))}
      </div>

      <div className="grid grid-cols-[20px_minmax(0,1fr)] gap-1.5 sm:grid-cols-[24px_minmax(0,1fr)] sm:gap-2">
        <div className="grid grid-rows-8 gap-1.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-default-400 sm:gap-2 sm:text-xs">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-center justify-center">
              {8 - index}
            </div>
          ))}
        </div>

        <div
          ref={boardGridRef}
          className="relative grid grid-cols-8 gap-1.5 rounded-[1.45rem] bg-gradient-to-br from-[#f8f4ee] to-[#ddd1c0] p-2.5 shadow-inner sm:gap-2 sm:rounded-[1.7rem] sm:p-3"
        >
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
                    "relative aspect-square rounded-[1.05rem] border text-[clamp(1.1rem,3vw,2.4rem)] font-semibold transition duration-150 sm:rounded-2xl",
                    getSquareTone(rowIndex, colIndex),
                    isSelected && "border-black ring-4 ring-black/15 scale-[0.97]",
                    isTarget && "border-white/70 ring-4 ring-emerald-400/35",
                    partOfLastMove && "border-amber-300 shadow-[0_0_0_3px_rgba(251,191,36,0.2)]",
                    !piece && "hover:brightness-105",
                    piece && piece.color === state.turn && "hover:brightness-110",
                  )}
                  aria-label={`${files[colIndex]}${8 - rowIndex}`}
                >
                  {piece ? (
                    <span
                      className={cn(
                        "drop-shadow-sm transition-all duration-200",
                        hideForAnimation && "opacity-0 scale-90",
                        piece.color === "w" ? "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]" : "text-slate-950",
                      )}
                    >
                      {getChessPieceLabel(piece)}
                    </span>
                  ) : null}

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
                  scale: 0.96,
                  opacity: 0.95,
                }}
                animate={{
                  x: movingPiece.to.col * cellSize,
                  y: movingPiece.to.row * cellSize,
                  scale: 1,
                  opacity: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute left-3 top-3 z-20 flex items-center justify-center"
                style={{ width: cellSize - 8, height: cellSize - 8 }}
              >
                <span
                  className={cn(
                    "text-[clamp(1.35rem,3vw,2.4rem)] font-semibold drop-shadow-md",
                    movingPiece.color === "w"
                      ? "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]"
                      : "text-slate-950",
                  )}
                >
                  {movingPiece.label}
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const sidebar = (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_1.2fr]">
      <div className="rounded-[1.35rem] border border-default-200 bg-white/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
            <Crown className="h-5 w-5" />
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
            <h3 className="text-lg font-bold text-foreground">Điều khiển trực tiếp trên bàn cờ</h3>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
          <li>Chạm vào quân để xem nước đi hợp lệ.</li>
          <li>Chế độ máy: bạn cầm trắng, máy cầm đen.</li>
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
              Chưa có nước đi nào. Bắt đầu bằng quân trắng nhé.
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
      title="Cờ Vua"
      eyebrow="Classic Board Game"
      description="Một bàn cờ vua tối giản nhưng vẫn đủ luật đi cơ bản để bạn chơi nhanh ngay trên web. Có sẵn chế độ đấu với máy hoặc 2 người thay phiên trên cùng một thiết bị."
      mode={mode}
      onChangeMode={(nextMode) => resetGame(nextMode)}
      onReset={() => resetGame()}
      status={isAiTurn ? "Máy đang suy nghĩ..." : state.statusText}
      helper="Máy sẽ tự đi sau khi bạn hoàn tất lượt trắng. Nếu chơi 2 người, cả hai thay phiên thao tác trực tiếp trên cùng bàn cờ."
      board={board}
      sidebar={sidebar}
    />
  );
}

function samePosition(position: ChessPosition, row: number, col: number) {
  return position.row === row && position.col === col;
}
