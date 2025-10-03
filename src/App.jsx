import { useState, useEffect } from "react";

// Single square button
function Square({ value, onSquareClick, highlight, disabled }) {
  const baseClasses =
    "flex items-center justify-center w-20 h-20 text-3xl font-bold border border-gray-400 transition-transform duration-150 hover:scale-105";
  
  let bg, textColor;
  if (highlight) {
    bg = "bg-green-200";
    textColor = "text-green-800";
  } else if (value) {
    bg = "bg-gray-100";
    textColor = value === "X" ? "text-red-600" : "text-blue-600";
  } else {
    bg = "bg-white";
    textColor = "text-gray-800";
  }

  return (
    <button
      onClick={onSquareClick}
      disabled={disabled || !!value}
      className={`${baseClasses} ${bg} ${textColor} ${value ? "cursor-default" : "cursor-pointer"}`}
    >
      {value}
    </button>
  );
}

// Board component
function Board({ xIsNext, squares, onPlay, aiEnabled }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];
  const isTie = !squares.includes(null) && !winner;
  const boardDisabled = winner || isTie;

  function handleClick(i) {
    if (boardDisabled || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-medium mb-3">
        {winner
          ? `Winner: ${winner} 🎉`
          : isTie
          ? "It's a tie! 🤝"
          : aiEnabled && !xIsNext
          ? "AI is thinking..."
          : `Next Player: ${xIsNext ? "X" : "O"}`}
      </div>
      <div className="grid grid-cols-3 gap-1 p-1 rounded-md shadow-md" style={{ backgroundColor: "#4B5563" }}>
        {squares.map((val, i) => (
          <Square
            key={i}
            value={val}
            onSquareClick={() => handleClick(i)}
            highlight={winningLine.includes(i)}
            disabled={boardDisabled}
          />
        ))}
      </div>
    </div>
  );
}

// Main Game component
export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [aiEnabled, setAiEnabled] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // AI move effect
  useEffect(() => {
    const winnerInfo = calculateWinner(currentSquares);
    const boardFull = !currentSquares.includes(null);
    if (aiEnabled && !xIsNext && !winnerInfo && !boardFull) {
      const emptyIndices = currentSquares
        .map((v, idx) => (v === null ? idx : null))
        .filter((v) => v !== null);
      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const aiSquares = currentSquares.slice();
      aiSquares[randomIndex] = "O";
      const timer = setTimeout(() => handlePlay(aiSquares), 500);
      return () => clearTimeout(timer);
    }
  }, [currentSquares, xIsNext, aiEnabled]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-10"
      style={{ background: "linear-gradient(to bottom right, #DBEAFE, #EDE9FE)" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-900">🎮 Tic-Tac-Toe</h1>

      <div className="flex gap-10 flex-wrap justify-center">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          aiEnabled={aiEnabled}
        />

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={resetGame}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Restart
          </button>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={aiEnabled}
              onChange={(e) => setAiEnabled(e.target.checked)}
              className="accent-indigo-500 w-5 h-5"
            />
            <span className="text-gray-800">Play vs AI</span>
          </label>

          <ol className="list-decimal pl-4 space-y-2">
            {history.map((_, move) => (
              <li key={move}>
                <button
                  onClick={() => jumpTo(move)}
                  className={`px-2 py-1 text-sm rounded transition-colors ${
                    move === currentMove
                      ? "font-bold text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {move === 0 ? "Go to game start" : `Go to move #${move}`}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// Calculate winner function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
