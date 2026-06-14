export type XiangqiColor = "r" | "b";
export type XiangqiPieceType = "g" | "a" | "e" | "h" | "r" | "c" | "s";

export interface XiangqiPiece {
  color: XiangqiColor;
  type: XiangqiPieceType;
}

export interface XiangqiPosition {
  row: number;
  col: number;
}

export interface XiangqiMove {
  from: XiangqiPosition;
  to: XiangqiPosition;
}

export interface XiangqiState {
  board: (XiangqiPiece | null)[][];
  turn: XiangqiColor;
  winner: XiangqiColor | "draw" | null;
  statusText: string;
}

const PIECE_VALUES: Record<XiangqiPieceType, number> = {
  g: 10000,
  a: 110,
  e: 110,
  h: 300,
  r: 600,
  c: 360,
  s: 70,
};

function cloneBoard(board: (XiangqiPiece | null)[][]) {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

function isInsideBoard(row: number, col: number) {
  return row >= 0 && row < 10 && col >= 0 && col < 9;
}

function sameSquare(a: XiangqiPosition, b: XiangqiPosition) {
  return a.row === b.row && a.col === b.col;
}

function isInPalace(color: XiangqiColor, row: number, col: number) {
  const rowRange = color === "r" ? row >= 7 && row <= 9 : row >= 0 && row <= 2;
  return rowRange && col >= 3 && col <= 5;
}

function crossedRiver(color: XiangqiColor, row: number) {
  return color === "r" ? row <= 4 : row >= 5;
}

function findGeneral(board: (XiangqiPiece | null)[][], color: XiangqiColor) {
  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const piece = board[row][col];
      if (piece?.color === color && piece.type === "g") {
        return { row, col };
      }
    }
  }
  return null;
}

function generalsFacing(board: (XiangqiPiece | null)[][]) {
  const red = findGeneral(board, "r");
  const black = findGeneral(board, "b");

  if (!red || !black || red.col !== black.col) return false;

  const minRow = Math.min(red.row, black.row);
  const maxRow = Math.max(red.row, black.row);
  for (let row = minRow + 1; row < maxRow; row += 1) {
    if (board[row][red.col]) return false;
  }

  return true;
}

function getLineMoves(
  board: (XiangqiPiece | null)[][],
  from: XiangqiPosition,
  color: XiangqiColor,
  deltas: number[][],
) {
  const moves: XiangqiMove[] = [];

  for (const [dr, dc] of deltas) {
    let row = from.row + dr;
    let col = from.col + dc;

    while (isInsideBoard(row, col)) {
      const target = board[row][col];
      if (!target) {
        moves.push({ from, to: { row, col } });
      } else {
        if (target.color !== color) {
          moves.push({ from, to: { row, col } });
        }
        break;
      }
      row += dr;
      col += dc;
    }
  }

  return moves;
}

function getCannonMoves(
  board: (XiangqiPiece | null)[][],
  from: XiangqiPosition,
  color: XiangqiColor,
) {
  const moves: XiangqiMove[] = [];
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [dr, dc] of deltas) {
    let row = from.row + dr;
    let col = from.col + dc;
    let jumped = false;

    while (isInsideBoard(row, col)) {
      const target = board[row][col];

      if (!jumped) {
        if (!target) {
          moves.push({ from, to: { row, col } });
        } else {
          jumped = true;
        }
      } else if (target) {
        if (target.color !== color) {
          moves.push({ from, to: { row, col } });
        }
        break;
      }

      row += dr;
      col += dc;
    }
  }

  return moves;
}

function getPseudoMoves(state: XiangqiState, from: XiangqiPosition) {
  const piece = state.board[from.row][from.col];
  if (!piece) return [];

  const moves: XiangqiMove[] = [];

  switch (piece.type) {
    case "g": {
      const steps = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of steps) {
        const row = from.row + dr;
        const col = from.col + dc;
        if (!isInsideBoard(row, col) || !isInPalace(piece.color, row, col)) continue;
        const target = state.board[row][col];
        if (!target || target.color !== piece.color) {
          moves.push({ from, to: { row, col } });
        }
      }

      const enemy = findGeneral(state.board, piece.color === "r" ? "b" : "r");
      if (enemy && enemy.col === from.col) {
        const minRow = Math.min(enemy.row, from.row);
        const maxRow = Math.max(enemy.row, from.row);
        let blocked = false;
        for (let row = minRow + 1; row < maxRow; row += 1) {
          if (state.board[row][from.col]) {
            blocked = true;
            break;
          }
        }
        if (!blocked) {
          moves.push({ from, to: enemy });
        }
      }
      return moves;
    }
    case "a": {
      const steps = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];
      for (const [dr, dc] of steps) {
        const row = from.row + dr;
        const col = from.col + dc;
        if (!isInsideBoard(row, col) || !isInPalace(piece.color, row, col)) continue;
        const target = state.board[row][col];
        if (!target || target.color !== piece.color) {
          moves.push({ from, to: { row, col } });
        }
      }
      return moves;
    }
    case "e": {
      const steps = [
        [-2, -2],
        [-2, 2],
        [2, -2],
        [2, 2],
      ];
      for (const [dr, dc] of steps) {
        const row = from.row + dr;
        const col = from.col + dc;
        const eyeRow = from.row + dr / 2;
        const eyeCol = from.col + dc / 2;
        if (!isInsideBoard(row, col)) continue;
        if (piece.color === "r" && row < 5) continue;
        if (piece.color === "b" && row > 4) continue;
        if (state.board[eyeRow][eyeCol]) continue;
        const target = state.board[row][col];
        if (!target || target.color !== piece.color) {
          moves.push({ from, to: { row, col } });
        }
      }
      return moves;
    }
    case "h": {
      const steps = [
        { dr: -2, dc: -1, legRow: -1, legCol: 0 },
        { dr: -2, dc: 1, legRow: -1, legCol: 0 },
        { dr: 2, dc: -1, legRow: 1, legCol: 0 },
        { dr: 2, dc: 1, legRow: 1, legCol: 0 },
        { dr: -1, dc: -2, legRow: 0, legCol: -1 },
        { dr: 1, dc: -2, legRow: 0, legCol: -1 },
        { dr: -1, dc: 2, legRow: 0, legCol: 1 },
        { dr: 1, dc: 2, legRow: 0, legCol: 1 },
      ];
      for (const step of steps) {
        const row = from.row + step.dr;
        const col = from.col + step.dc;
        const legRow = from.row + step.legRow;
        const legCol = from.col + step.legCol;
        if (!isInsideBoard(row, col) || state.board[legRow][legCol]) continue;
        const target = state.board[row][col];
        if (!target || target.color !== piece.color) {
          moves.push({ from, to: { row, col } });
        }
      }
      return moves;
    }
    case "r":
      return getLineMoves(state.board, from, piece.color, [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]);
    case "c":
      return getCannonMoves(state.board, from, piece.color);
    case "s": {
      const forward = piece.color === "r" ? -1 : 1;
      const candidates = [{ row: from.row + forward, col: from.col }];
      if (crossedRiver(piece.color, from.row)) {
        candidates.push({ row: from.row, col: from.col - 1 });
        candidates.push({ row: from.row, col: from.col + 1 });
      }

      for (const candidate of candidates) {
        if (!isInsideBoard(candidate.row, candidate.col)) continue;
        const target = state.board[candidate.row][candidate.col];
        if (!target || target.color !== piece.color) {
          moves.push({ from, to: candidate });
        }
      }
      return moves;
    }
    default:
      return moves;
  }
}

function isGeneralInCheck(board: (XiangqiPiece | null)[][], color: XiangqiColor) {
  const general = findGeneral(board, color);
  if (!general) return true;
  const enemy = color === "r" ? "b" : "r";
  const sourceState: XiangqiState = { board, turn: enemy, winner: null, statusText: "" };

  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const piece = board[row][col];
      if (piece?.color !== enemy) continue;
      const moves = getPseudoMoves(sourceState, { row, col });
      if (moves.some((move) => sameSquare(move.to, general))) {
        return true;
      }
    }
  }

  return false;
}

function makeMoveInternal(
  state: XiangqiState,
  move: XiangqiMove,
): XiangqiState {
  const board = cloneBoard(state.board);
  const piece = board[move.from.row][move.from.col];
  if (!piece) return state;

  board[move.from.row][move.from.col] = null;
  board[move.to.row][move.to.col] = piece;

  return {
    board,
    turn: state.turn === "r" ? "b" : "r",
    winner: null,
    statusText: "",
  };
}

interface XiangqiStatus {
  winner: XiangqiState["winner"];
  statusText: string;
}

export function getLegalXiangqiMovesForSquare(state: XiangqiState, from: XiangqiPosition) {
  const piece = state.board[from.row][from.col];
  if (!piece || piece.color !== state.turn) return [];

  return getPseudoMoves(state, from).filter((move) => {
    const next = makeMoveInternal(state, move);
    return !generalsFacing(next.board) && !isGeneralInCheck(next.board, piece.color);
  });
}

export function getAllLegalXiangqiMoves(state: XiangqiState, color = state.turn) {
  const moves: XiangqiMove[] = [];

  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const piece = state.board[row][col];
      if (piece?.color === color) {
        const sourceState = color === state.turn ? state : { ...state, turn: color };
        moves.push(...getLegalXiangqiMovesForSquare(sourceState, { row, col }));
      }
    }
  }

  return moves;
}

function getStatus(next: XiangqiState): XiangqiStatus {
  const currentHasGeneral = findGeneral(next.board, next.turn);
  if (!currentHasGeneral) {
    return {
      winner: next.turn === "r" ? "b" : "r",
      statusText: `${next.turn === "r" ? "Đen" : "Đỏ"} thắng`,
    };
  }

  const hasMoves = getAllLegalXiangqiMoves(next, next.turn).length > 0;
  const inCheck = isGeneralInCheck(next.board, next.turn) || generalsFacing(next.board);

  if (hasMoves) {
    return {
      winner: null,
      statusText: inCheck
        ? `${next.turn === "r" ? "Đỏ" : "Đen"} đang bị chiếu`
        : `Lượt ${next.turn === "r" ? "đỏ" : "đen"}`,
    };
  }

  if (inCheck) {
    return {
      winner: next.turn === "r" ? "b" : "r",
      statusText: `Chiếu bí. ${next.turn === "r" ? "Đen" : "Đỏ"} thắng`,
    };
  }

  return {
    winner: "draw" as const,
    statusText: "Hòa cờ",
  };
}

export function applyXiangqiMove(
  state: XiangqiState,
  move: XiangqiMove,
): XiangqiState {
  const next = makeMoveInternal(state, move);
  const status = getStatus(next);
  return {
    ...next,
    winner: status.winner,
    statusText: status.statusText,
  };
}

export function evaluateXiangqiState(state: XiangqiState, perspective: XiangqiColor) {
  let score = 0;

  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const piece = state.board[row][col];
      if (!piece) continue;

      let value = PIECE_VALUES[piece.type];
      if (piece.type === "s" && crossedRiver(piece.color, row)) {
        value += 25;
      }
      score += piece.color === perspective ? value : -value;
    }
  }

  const mobility =
    getAllLegalXiangqiMoves(state, perspective).length -
    getAllLegalXiangqiMoves(state, perspective === "r" ? "b" : "r").length;
  score += mobility * 2;

  if (state.winner === perspective) score += 50000;
  if (state.winner && state.winner !== perspective && state.winner !== "draw") score -= 50000;

  return score;
}

export function chooseBestXiangqiMove(state: XiangqiState, aiColor: XiangqiColor) {
  const moves = getAllLegalXiangqiMoves(state, aiColor);
  if (!moves.length) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const next = applyXiangqiMove({ ...state, turn: aiColor }, move);
    const immediate = evaluateXiangqiState(next, aiColor);
    const replies = getAllLegalXiangqiMoves(next, next.turn);
    let replyPenalty = 0;

    if (replies.length) {
      replyPenalty = Math.max(
        ...replies.map((reply) => {
          const replyState = applyXiangqiMove(next, reply);
          return -evaluateXiangqiState(replyState, aiColor);
        }),
      );
    }

    const total = immediate - replyPenalty * 0.35 + Math.random() * 1.5;
    if (total > bestScore) {
      bestScore = total;
      bestMove = move;
    }
  }

  return bestMove;
}

export function createInitialXiangqiState(): XiangqiState {
  const board: (XiangqiPiece | null)[][] = Array.from({ length: 10 }, () => Array.from({ length: 9 }, () => null));

  const place = (row: number, col: number, color: XiangqiColor, type: XiangqiPieceType) => {
    board[row][col] = { color, type };
  };

  place(0, 0, "b", "r");
  place(0, 1, "b", "h");
  place(0, 2, "b", "e");
  place(0, 3, "b", "a");
  place(0, 4, "b", "g");
  place(0, 5, "b", "a");
  place(0, 6, "b", "e");
  place(0, 7, "b", "h");
  place(0, 8, "b", "r");
  place(2, 1, "b", "c");
  place(2, 7, "b", "c");
  [0, 2, 4, 6, 8].forEach((col) => place(3, col, "b", "s"));

  place(9, 0, "r", "r");
  place(9, 1, "r", "h");
  place(9, 2, "r", "e");
  place(9, 3, "r", "a");
  place(9, 4, "r", "g");
  place(9, 5, "r", "a");
  place(9, 6, "r", "e");
  place(9, 7, "r", "h");
  place(9, 8, "r", "r");
  place(7, 1, "r", "c");
  place(7, 7, "r", "c");
  [0, 2, 4, 6, 8].forEach((col) => place(6, col, "r", "s"));

  return {
    board,
    turn: "r",
    winner: null,
    statusText: "Lượt đỏ",
  };
}

export function getXiangqiPieceLabel(piece: XiangqiPiece) {
  const map: Record<XiangqiColor, Record<XiangqiPieceType, string>> = {
    r: {
      g: "帥",
      a: "仕",
      e: "相",
      h: "傌",
      r: "俥",
      c: "炮",
      s: "兵",
    },
    b: {
      g: "將",
      a: "士",
      e: "象",
      h: "馬",
      r: "車",
      c: "砲",
      s: "卒",
    },
  };

  return map[piece.color][piece.type];
}

export function formatXiangqiMove(move: XiangqiMove) {
  return `(${move.from.row + 1},${move.from.col + 1}) -> (${move.to.row + 1},${move.to.col + 1})`;
}

export function isSameXiangqiMove(a: XiangqiMove, b: XiangqiMove) {
  return sameSquare(a.from, b.from) && sameSquare(a.to, b.to);
}
