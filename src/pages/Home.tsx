import { useMemo, useState } from 'react';

type Cell = 'X' | 'O' | null;
type Board = Cell[];

const LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: Board): { winner: Cell; line: [number, number, number] | null } {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

export default function Home() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [scoredThisRound, setScoredThisRound] = useState(false);

  const { winner, line } = useMemo(() => calculateWinner(board), [board]);
  const isDraw = !winner && board.every((c) => c !== null);
  const winningSet = new Set<number>(line ?? []);

  // Update score once when round ends.
  if (winner && !scoredThisRound) {
    setScoredThisRound(true);
    setScore((s) => ({ ...s, [winner]: s[winner] + 1 }));
  } else if (isDraw && !scoredThisRound) {
    setScoredThisRound(true);
    setScore((s) => ({ ...s, draws: s.draws + 1 }));
  }

  function handleClick(i: number) {
    if (board[i] || winner) return;
    const next = board.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  function newRound() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setScoredThisRound(false);
  }

  function resetAll() {
    newRound();
    setScore({ X: 0, O: 0, draws: 0 });
  }

  const status = winner
    ? `Player ${winner} wins!`
    : isDraw
      ? "It's a draw."
      : `Player ${xIsNext ? 'X' : 'O'}'s turn`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
            Tic Tac Toe
          </h1>
          <p className="mt-2 text-slate-300 text-sm">Two players. One board. Best of forever.</p>
        </header>

        {/* Status */}
        <div
          className={`mb-6 text-center rounded-2xl border px-4 py-3 backdrop-blur-sm transition-colors ${
            winner
              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
              : isDraw
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-200'
                : 'border-white/10 bg-white/5 text-white'
          }`}
        >
          <span className="text-lg font-semibold">{status}</span>
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
          {board.map((cell, i) => {
            const isWinning = winningSet.has(i);
            const disabled = Boolean(cell) || Boolean(winner);
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={disabled}
                className={`aspect-square rounded-2xl text-5xl sm:text-6xl font-black flex items-center justify-center select-none transition-all
                  ${
                    isWinning
                      ? 'bg-emerald-400/20 border-2 border-emerald-300 text-emerald-200 shadow-[0_0_30px_-5px] shadow-emerald-400/60'
                      : 'bg-slate-800/70 border border-white/10 hover:bg-slate-700/70'
                  }
                  ${cell === 'X' ? 'text-cyan-300' : cell === 'O' ? 'text-fuchsia-300' : ''}
                  ${isWinning && cell === 'X' ? 'text-cyan-200' : ''}
                  ${isWinning && cell === 'O' ? 'text-fuchsia-200' : ''}
                  ${disabled ? 'cursor-default' : 'cursor-pointer active:scale-95'}
                `}
                aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ', empty'}`}
              >
                {cell}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={newRound}
            className="flex-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-3 transition-colors active:scale-[0.98]"
          >
            New round
          </button>
          <button
            onClick={resetAll}
            className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 transition-colors active:scale-[0.98]"
          >
            Reset score
          </button>
        </div>

        {/* Scoreboard */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-cyan-300">Player X</div>
            <div className="text-3xl font-bold mt-1">{score.X}</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-300">Draws</div>
            <div className="text-3xl font-bold mt-1">{score.draws}</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-fuchsia-300">Player O</div>
            <div className="text-3xl font-bold mt-1">{score.O}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
