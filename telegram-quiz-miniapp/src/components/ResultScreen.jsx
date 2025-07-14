export default function ResultScreen({
  score,
  onRestart,
  coins,
  referrals,
  user,
  badges = [],
}) {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="mb-4 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-2xl">🪙</span>
          <span className="font-bold text-xl">{coins}</span>
        </div>
        {user && (
          <span className="font-semibold text-lg">{user.first_name}</span>
        )}
        <span className="text-gray-500">Referrals: {referrals}</span>
      </div>
      {/* Badges Section */}
      {badges.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
            <span>🏅</span> Badges Earned
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {badges.map((badge) => (
              <span
                key={badge}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-base font-semibold flex items-center gap-1 shadow"
              >
                🏅 {badge}
              </span>
            ))}
          </div>
        </div>
      )}
      <h2 className="text-3xl font-extrabold mb-4 text-purple-700 flex items-center gap-2">
        🏆 Your Score: {score}
      </h2>
      <button
        onClick={onRestart}
        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow transition-all duration-200"
      >
        🔄 Play Again
      </button>
    </div>
  );
}
