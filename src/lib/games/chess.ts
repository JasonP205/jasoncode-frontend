export type ChessColor = "w" | "b";
export type ChessPieceType = "p" | "n" | "b" | "r" | "q" | "k";

export interface ChessPiece {
  color: ChessColor;
  type: ChessPieceType;
}

export interface ChessPosition {
  row: number;
  col: number;
}

export interface ChessMove {
  from: ChessPosition;
  to: ChessPosition;
  promotion?: ChessPieceType;
  isCastle?: boolean;
  isEnPassant?: boolean;
}

export interface ChessState {
  board: (ChessPiece | null)[][];
  turn: ChessColor;
  castling: {
    wk: boolean;
    wq: boolean;
    bk: boolean;
    bq: boolean;
  };
  enPassant: ChessPosition | null;
  winner: ChessColor | "draw" | null;
  statusText: string;
}

const PIECE_VALUES: Record<ChessPieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const directions = {
  bishop: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  rook: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  knight: [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ],
  king: [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ],
};

function createBackRank(color: ChessColor): ChessPiece[] {
  return [
    { color, type: "r" },
    { color, type: "n" },
    { color, type: "b" },
    { color, type: "q" },
    { color, type: "k" },
    { color, type: "b" },
    { color, type: "n" },
    { color, type: "r" },
  ];
}

function cloneBoard(board: (ChessPiece | null)[][]) {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

function isInsideBoard(row: number, col: number) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function sameSquare(a: ChessPosition, b: ChessPosition) {
  return a.row === b.row && a.col === b.col;
}

function findKing(board: (ChessPiece | null)[][], color: ChessColor) {
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = board[row][col];
      if (piece?.color === color && piece.type === "k") {
        return { row, col };
      }
    }
  }
  return null;
}

function getSlidingMoves(
  board: (ChessPiece | null)[][],
  from: ChessPosition,
  color: ChessColor,
  deltas: number[][],
) {
  const moves: ChessMove[] = [];

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

function isSquareAttacked(
  board: (ChessPiece | null)[][],
  target: ChessPosition,
  byColor: ChessColor,
) {
  const pawnDirection = byColor === "w" ? -1 : 1;
  const pawnAttackRow = target.row - pawnDirection;

  for (const dc of [-1, 1]) {
    const col = target.col + dc;
    if (!isInsideBoard(pawnAttackRow, col)) continue;
    const piece = board[pawnAttackRow][col];
    if (piece?.color === byColor && piece.type === "p") return true;
  }

  for (const [dr, dc] of directions.knight) {
    const row = target.row + dr;
    const col = target.col + dc;
    if (!isInsideBoard(row, col)) continue;
    const piece = board[row][col];
    if (piece?.color === byColor && piece.type === "n") return true;
  }

  for (const [dr, dc] of directions.bishop) {
    let row = target.row + dr;
    let col = target.col + dc;

    while (isInsideBoard(row, col)) {
      const piece = board[row][col];
      if (piece) {
        if (piece.color === byColor && (piece.type === "b" || piece.type === "q")) {
          return true;
        }
        break;
      }
      row += dr;
      col += dc;
    }
  }

  for (const [dr, dc] of directions.rook) {
    let row = target.row + dr;
    let col = target.col + dc;

    while (isInsideBoard(row, col)) {
      const piece = board[row][col];
      if (piece) {
        if (piece.color === byColor && (piece.type === "r" || piece.type === "q")) {
          return true;
        }
        break;
      }
      row += dr;
      col += dc;
    }
  }

  for (const [dr, dc] of directions.king) {
    const row = target.row + dr;
    const col = target.col + dc;
    if (!isInsideBoard(row, col)) continue;
    const piece = board[row][col];
    if (piece?.color === byColor && piece.type === "k") return true;
  }

  return false;
}

function isInCheck(board: (ChessPiece | null)[][], color: ChessColor) {
  const king = findKing(board, color);
  if (!king) return true;
  return isSquareAttacked(board, king, color === "w" ? "b" : "w");
}

function getPseudoMovesForPiece(
  state: ChessState,
  from: ChessPosition,
) {
  const piece = state.board[from.row][from.col];
  if (!piece) return [];

  const moves: ChessMove[] = [];

  if (piece.type === "p") {
    const direction = piece.color === "w" ? -1 : 1;
    const startRow = piece.color === "w" ? 6 : 1;
    const oneStepRow = from.row + direction;

    if (isInsideBoard(oneStepRow, from.col) && !state.board[oneStepRow][from.col]) {
      moves.push({
        from,
        to: { row: oneStepRow, col: from.col },
        promotion: oneStepRow === 0 || oneStepRow === 7 ? "q" : undefined,
      });

      const twoStepRow = from.row + direction * 2;
      if (from.row === startRow && !state.board[twoStepRow][from.col]) {
        moves.push({ from, to: { row: twoStepRow, col: from.col } });
      }
    }

    for (const dc of [-1, 1]) {
      const row = from.row + direction;
      const col = from.col + dc;
      if (!isInsideBoard(row, col)) continue;

      const target = state.board[row][col];
      if (target && target.color !== piece.color) {
        moves.push({
          from,
          to: { row, col },
          promotion: row === 0 || row === 7 ? "q" : undefined,
        });
      } else if (state.enPassant && state.enPassant.row === row && state.enPassant.col === col) {
        moves.push({ from, to: { row, col }, isEnPassant: true });
      }
    }

    return moves;
  }

  if (piece.type === "n") {
    for (const [dr, dc] of directions.knight) {
      const row = from.row + dr;
      const col = from.col + dc;
      if (!isInsideBoard(row, col)) continue;
      const target = state.board[row][col];
      if (!target || target.color !== piece.color) {
        moves.push({ from, to: { row, col } });
      }
    }
    return moves;
  }

  if (piece.type === "b") {
    return getSlidingMoves(state.board, from, piece.color, directions.bishop);
  }

  if (piece.type === "r") {
    return getSlidingMoves(state.board, from, piece.color, directions.rook);
  }

  if (piece.type === "q") {
    return getSlidingMoves(
      state.board,
      from,
      piece.color,
      directions.bishop.concat(directions.rook),
    );
  }

  if (piece.type === "k") {
    for (const [dr, dc] of directions.king) {
      const row = from.row + dr;
      const col = from.col + dc;
      if (!isInsideBoard(row, col)) continue;
      const target = state.board[row][col];
      if (!target || target.color !== piece.color) {
        moves.push({ from, to: { row, col } });
      }
    }

    const enemy = piece.color === "w" ? "b" : "w";
    const homeRow = piece.color === "w" ? 7 : 0;
    const kingSide = piece.color === "w" ? state.castling.wk : state.castling.bk;
    const queenSide = piece.color === "w" ? state.castling.wq : state.castling.bq;

    if (
      from.row === homeRow &&
      from.col === 4 &&
      !isInCheck(state.board, piece.color)
    ) {
      if (
        kingSide &&
        !state.board[homeRow][5] &&
        !state.board[homeRow][6] &&
        !isSquareAttacked(state.board, { row: homeRow, col: 5 }, enemy) &&
        !isSquareAttacked(state.board, { row: homeRow, col: 6 }, enemy)
      ) {
        moves.push({ from, to: { row: homeRow, col: 6 }, isCastle: true });
      }

      if (
        queenSide &&
        !state.board[homeRow][1] &&
        !state.board[homeRow][2] &&
        !state.board[homeRow][3] &&
        !isSquareAttacked(state.board, { row: homeRow, col: 3 }, enemy) &&
        !isSquareAttacked(state.board, { row: homeRow, col: 2 }, enemy)
      ) {
        moves.push({ from, to: { row: homeRow, col: 2 }, isCastle: true });
      }
    }
  }

  return moves;
}

function makeMoveInternal(state: ChessState, move: ChessMove) {
  const board = cloneBoard(state.board);
  const piece = board[move.from.row][move.from.col];

  if (!piece) return state;

  const nextState: ChessState = {
    board,
    turn: state.turn === "w" ? "b" : "w",
    castling: { ...state.castling },
    enPassant: null,
    winner: null,
    statusText: "",
  };

  const captured = board[move.to.row][move.to.col];
  board[move.from.row][move.from.col] = null;

  if (move.isEnPassant) {
    const capturedRow = piece.color === "w" ? move.to.row + 1 : move.to.row - 1;
    board[capturedRow][move.to.col] = null;
  }

  if (move.isCastle) {
    if (move.to.col === 6) {
      board[move.to.row][5] = board[move.to.row][7];
      board[move.to.row][7] = null;
    } else if (move.to.col === 2) {
      board[move.to.row][3] = board[move.to.row][0];
      board[move.to.row][0] = null;
    }
  }

  board[move.to.row][move.to.col] = {
    color: piece.color,
    type: move.promotion ?? piece.type,
  };

  if (piece.type === "p" && Math.abs(move.from.row - move.to.row) === 2) {
    nextState.enPassant = {
      row: (move.from.row + move.to.row) / 2,
      col: move.from.col,
    };
  }

  if (piece.type === "k") {
    if (piece.color === "w") {
      nextState.castling.wk = false;
      nextState.castling.wq = false;
    } else {
      nextState.castling.bk = false;
      nextState.castling.bq = false;
    }
  }

  if (piece.type === "r") {
    if (move.from.row === 7 && move.from.col === 0) nextState.castling.wq = false;
    if (move.from.row === 7 && move.from.col === 7) nextState.castling.wk = false;
    if (move.from.row === 0 && move.from.col === 0) nextState.castling.bq = false;
    if (move.from.row === 0 && move.from.col === 7) nextState.castling.bk = false;
  }

  if (captured?.type === "r") {
    if (move.to.row === 7 && move.to.col === 0) nextState.castling.wq = false;
    if (move.to.row === 7 && move.to.col === 7) nextState.castling.wk = false;
    if (move.to.row === 0 && move.to.col === 0) nextState.castling.bq = false;
    if (move.to.row === 0 && move.to.col === 7) nextState.castling.bk = false;
  }

  return nextState;
}

interface ChessStatus {
  winner: ChessState["winner"];
  statusText: string;
}

export function getLegalMovesForSquare(state: ChessState, from: ChessPosition) {
  const piece = state.board[from.row][from.col];
  if (!piece || piece.color !== state.turn) return [];

  return getPseudoMovesForPiece(state, from).filter((move) => {
    const candidate = makeMoveInternal(state, move);
    return !isInCheck(candidate.board, piece.color);
  });
}

export function getAllLegalMoves(state: ChessState, color = state.turn) {
  const moves: ChessMove[] = [];

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = state.board[row][col];
      if (piece?.color === color) {
        const sourceState = color === state.turn ? state : { ...state, turn: color };
        moves.push(...getLegalMovesForSquare(sourceState, { row, col }));
      }
    }
  }

  return moves;
}

function getStatus(
  board: (ChessPiece | null)[][],
  nextTurn: ChessColor,
  hasMoves: boolean,
): ChessStatus {
  const inCheck = isInCheck(board, nextTurn);
  if (hasMoves) {
    return {
      winner: null,
      statusText: inCheck
        ? `${nextTurn === "w" ? "Trắng" : "Đen"} đang bị chiếu`
        : `Lượt ${nextTurn === "w" ? "trắng" : "đen"}`,
    };
  }

  if (inCheck) {
    return {
      winner: nextTurn === "w" ? "b" : "w",
      statusText: `Chiếu bí. ${nextTurn === "w" ? "Đen" : "Trắng"} thắng`,
    };
  }

  return {
    winner: "draw" as const,
    statusText: "Hòa cờ",
  };
}

export function applyChessMove(state: ChessState, move: ChessMove): ChessState {
  const nextState = makeMoveInternal(state, move);
  const hasMoves = getAllLegalMoves(nextState, nextState.turn).length > 0;
  const status = getStatus(nextState.board, nextState.turn, hasMoves);

  return {
    ...nextState,
    winner: status.winner,
    statusText: status.statusText,
  };
}

export function evaluateChessState(state: ChessState, perspective: ChessColor) {
  let score = 0;

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = state.board[row][col];
      if (!piece) continue;

      const value = PIECE_VALUES[piece.type];
      score += piece.color === perspective ? value : -value;

      if (piece.type === "p") {
        const progress = piece.color === "w" ? 6 - row : row - 1;
        score += (piece.color === perspective ? 1 : -1) * progress * 8;
      }
    }
  }

  const mobility = getAllLegalMoves(state, perspective).length - getAllLegalMoves(state, perspective === "w" ? "b" : "w").length;
  score += mobility * 3;

  if (state.winner === perspective) score += 100000;
  if (state.winner && state.winner !== perspective && state.winner !== "draw") score -= 100000;

  return score;
}

export function chooseBestChessMove(state: ChessState, aiColor: ChessColor) {
  const moves = getAllLegalMoves(state, aiColor);
  if (!moves.length) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const next = applyChessMove({ ...state, turn: aiColor }, move);
    const immediate = evaluateChessState(next, aiColor);

    const replies = getAllLegalMoves(next, next.turn);
    let replyScore = 0;

    if (replies.length) {
      replyScore = Math.max(
        ...replies.map((reply) => {
          const replyState = applyChessMove(next, reply);
          return -evaluateChessState(replyState, aiColor);
        }),
      );
    }

    const total = immediate - replyScore * 0.35 + Math.random() * 2;
    if (total > bestScore) {
      bestScore = total;
      bestMove = move;
    }
  }

  return bestMove;
}

export function createInitialChessState(): ChessState {
  const board: (ChessPiece | null)[][] = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

  board[0] = createBackRank("b");
  board[1] = Array.from({ length: 8 }, () => ({ color: "b", type: "p" }));
  board[6] = Array.from({ length: 8 }, () => ({ color: "w", type: "p" }));
  board[7] = createBackRank("w");

  return {
    board,
    turn: "w",
    castling: {
      wk: true,
      wq: true,
      bk: true,
      bq: true,
    },
    enPassant: null,
    winner: null,
    statusText: "Lượt trắng",
  };
}

export function getChessPieceLabel(piece: ChessPiece) {
  const map: Record<ChessColor, Record<ChessPieceType, string>> = {
    w: {
      k: "♔",
      q: "♕",
      r: "♖",
      b: "♗",
      n: "♘",
      p: "♙",
    },
    b: {
      k: "♚",
      q: "♛",
      r: "♜",
      b: "♝",
      n: "♞",
      p: "♟",
    },
  };

  return map[piece.color][piece.type];
}

export function formatChessMove(move: ChessMove) {
  const files = "abcdefgh";
  return `${files[move.from.col]}${8 - move.from.row} -> ${files[move.to.col]}${8 - move.to.row}`;
}

export function isSameChessMove(a: ChessMove, b: ChessMove) {
  return sameSquare(a.from, b.from) && sameSquare(a.to, b.to);
}
