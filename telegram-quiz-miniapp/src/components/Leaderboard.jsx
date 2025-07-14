import React from "react";

const mockLeaderboard = [
  { name: "Alice", score: 42 },
  { name: "Bob", score: 37 },
  { name: "Charlie", score: 33 },
  { name: "Diana", score: 28 },
  { name: "Eve", score: 25 },
];

export default function Leaderboard({ onBack }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-600">🏆 Leaderboard</h2>
      <ol className="mb-4">
        {mockLeaderboard.map((user, idx) => (
          <li key={user.name} className="flex justify-between py-1">
            <span className="font-semibold">
              {idx + 1}. {user.name}
            </span>
            <span className="text-yellow-600 font-bold">{user.score}</span>
          </li>
        ))}
      </ol>
      <button
        onClick={onBack}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
      >
        Back
      </button>
    </div>
  );
}
