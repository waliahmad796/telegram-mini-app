import { useState, useEffect } from "react";
import questionSets from "./data/questions";
import StartScreen from "./components/StartScreen";
import QuestionScreen from "./components/QuestionScreen";
import ResultScreen from "./components/ResultScreen";
import Leaderboard from "./components/Leaderboard";

function App() {
  const [step, setStep] = useState("start");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0); // New: coins state
  const [referrals] = useState(0); // New: referrals state (will be updated from backend in future)
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [badges, setBadges] = useState([]); // New: badges state
  const [selectedLevel, setSelectedLevel] = useState(0); // Index of selected level
  const [unlockedLevels, setUnlockedLevels] = useState([0]); // Only Easy (0) unlocked by default
  const [showWeeklyChallenge, setShowWeeklyChallenge] = useState(false);
  const weeklyChallengeIdx = questionSets.findIndex(
    (q) => q.level === "Weekly Challenge"
  );
  // Weekly challenge is active only on Mondays
  const now = new Date();
  const isMonday = now.getDay() === 1;
  // Calculate time until next Monday
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  const nextMonday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysUntilMonday,
    0,
    0,
    0
  );
  const msUntilNextMonday = nextMonday - now;
  const hours = Math.floor(msUntilNextMonday / (1000 * 60 * 60));
  const minutes = Math.floor((msUntilNextMonday / (1000 * 60)) % 60);
  const seconds = Math.floor((msUntilNextMonday / 1000) % 60);

  // Select today's question set or selected level
  const questions = showWeeklyChallenge
    ? questionSets[weeklyChallengeIdx].questions
    : questionSets[selectedLevel].questions;

  // Unlock levels based on badges
  useEffect(() => {
    // Count perfect scores
    const perfectCount = badges.filter((b) => b === "Perfect Score").length;
    let newUnlocked = [0];
    if (perfectCount >= 2) newUnlocked.push(1); // Unlock Medium
    if (perfectCount >= 5) newUnlocked.push(2); // Unlock Hard
    setUnlockedLevels(newUnlocked);
  }, [badges]);

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
    // TODO: fetch referrals from backend if available
    window.Telegram?.WebApp?.expand();
  }, []);

  const startQuiz = () => {
    setStep("quiz");
    setCurrent(0);
    setScore(0);
    setShowWeeklyChallenge(false);
  };

  const handleAnswer = (choice) => {
    if (choice === questions[current].answer) {
      setScore(score + 1);
    }
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setStep("result");
      // Award coins for quiz completion (e.g., 10 coins per quiz)
      setCoins((prev) => prev + 10);
      // Award badges
      if (
        score + (choice === questions[current].answer ? 1 : 0) ===
        questions.length
      ) {
        setBadges((prev) =>
          prev.includes("Perfect Score") ? prev : [...prev, "Perfect Score"]
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 font-sans">
      {/* Fixed Top Bar */}
      <div className="w-full flex justify-center bg-white/80 border-b border-blue-100 shadow-sm py-2 px-4 z-10">
        <div className="flex items-center gap-6 max-w-xl w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-2xl">🪙</span>
            <span className="font-bold text-lg">{coins}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-lg">Referrals:</span>
            <span className="font-bold text-blue-700 text-lg">{referrals}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto text-center p-6 rounded-3xl shadow-2xl bg-white/90 border border-blue-100 mt-4">
          <h1 className="text-2xl font-bold mb-4 text-blue-600">QuizVerse</h1>
          {/* Level Selection */}
          {!showLeaderboard && step === "start" && (
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              {questionSets.map((set, idx) => (
                <button
                  key={set.level}
                  onClick={() => setSelectedLevel(idx)}
                  disabled={!unlockedLevels.includes(idx)}
                  className={`px-4 py-2 rounded-xl font-semibold border transition-all ${
                    selectedLevel === idx
                      ? "bg-blue-500 text-white border-blue-700"
                      : unlockedLevels.includes(idx)
                      ? "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                      : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  {set.level} {unlockedLevels.includes(idx) ? "" : "🔒"}
                </button>
              ))}
            </div>
          )}
          {/* Leaderboard Button */}
          {!showLeaderboard && step === "start" && (
            <button
              onClick={() => setShowLeaderboard(true)}
              className="mb-4 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl"
            >
              🏆 View Leaderboard
            </button>
          )}
          {/* Weekly Challenge Button */}
          {!showLeaderboard &&
            step === "start" &&
            weeklyChallengeIdx !== -1 && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    setShowWeeklyChallenge(true);
                    setStep("quiz");
                    setCurrent(0);
                    setScore(0);
                  }}
                  disabled={!isMonday}
                  className={`px-4 py-2 rounded-xl font-semibold border transition-all w-full mb-2 ${
                    isMonday
                      ? "bg-purple-600 text-white border-purple-700 hover:bg-purple-700"
                      : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  ⏰ Weekly Challenge {isMonday ? "" : "(Available on Monday)"}
                </button>
                {!isMonday && (
                  <div className="text-xs text-gray-500">
                    Next challenge in {hours}h {minutes}m {seconds}s
                  </div>
                )}
              </div>
            )}
          {/* Leaderboard Component */}
          {showLeaderboard ? (
            <Leaderboard onBack={() => setShowLeaderboard(false)} />
          ) : (
            <>
              {step === "start" && <StartScreen onStart={startQuiz} />}
              {step === "quiz" && (
                <QuestionScreen
                  question={questions[current]}
                  onAnswer={handleAnswer}
                  current={current + 1}
                  total={questions.length}
                />
              )}
              {step === "result" && (
                <ResultScreen
                  score={score}
                  onRestart={startQuiz}
                  coins={coins}
                  referrals={referrals}
                  user={user}
                  badges={badges}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
