import { useState } from "react";

// Single square button
function Square({ value, onSquareClick, highlight }) {
  const baseClasses =
    "flex items-center justify-center w-20 h-20 text-3xl font-bold border-2 border-gray-400 transition-transform duration-200 rounded-md";

  // Background color
  const bg = highlight
    ? "bg-green-400 text-white animate-pulse" // winning squares blink
    : value
    ? "bg-gray-100 text-gray-800"
    : "bg-white text-gray-800";

  // Scale pop-in animation when X or O is placed
  const popIn = value
    ? "transform scale-105 transition-transform duration-200"
    : "hover:scale-105 cursor-pointer";

  return (
    <button
      onClick={onSquareClick}
      disabled={!!value}
      className={`${baseClasses} ${bg} ${popIn}`}
    >
      {value}
    </button>
  );
}

// Board component
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-medium mb-3 text-gray-800">
        {winner ? `Winner: ${winner}` : `Next Player: ${xIsNext ? "X" : "O"}`}
      </div>
      <div className="grid grid-cols-3 gap-1 bg-gray-700 p-1 rounded-md shadow-md">
        {squares.map((val, i) => (
          <Square
            key={i}
            value={val}
            onSquareClick={() => handleClick(i)}
            highlight={winningLine.includes(i)}
          />
        ))}
      </div>
    </div>
  );
}

// Main App component
export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="flex flex-col items-center gap-10 p-10 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <h1 className="text-3xl font-bold text-gray-900">Tic-Tac-Toe</h1>

      <div className="flex gap-10 flex-wrap justify-center">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={resetGame}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
          >
            🔄 Restart
          </button>

          <ol className="list-decimal pl-4 space-y-2">
            {history.map((squares, move) => {
              if (move === 0) {
                return (
                  <li key={move}>
                    <button
                      onClick={() => jumpTo(move)}
                      className={`px-2 py-1 text-sm rounded transition-colors ${
                        move === currentMove
                          ? "font-bold text-white bg-blue-500"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      Game start
                    </button>
                  </li>
                );
              }

              const prevSquares = history[move - 1];
              const changedIndex = squares.findIndex((val, idx) => val !== prevSquares[idx]);
              const player = squares[changedIndex];
              const row = Math.floor(changedIndex / 3) + 1;
              const col = (changedIndex % 3) + 1;

              return (
                <li key={move}>
                  <button
                    onClick={() => jumpTo(move)}
                    className={`px-2 py-1 text-sm rounded transition-colors ${
                      move === currentMove
                        ? "font-bold text-white bg-blue-500"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {player} placed at ({row}, {col})
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

// Calculate winner
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
