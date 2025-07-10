import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      setIsTelegram(true);
      tg.ready();
      tg.expand();

      const userData = tg.initDataUnsafe?.user;
      if (userData) {
        setUser(userData);
      }
    } else {
      console.warn("Telegram WebApp not detected. Running outside Telegram.");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome to QuizVerse!</h1>

      {isTelegram && user ? (
        <p className="mb-4 text-lg">👋 Hello, {user.first_name}!</p>
      ) : (
        <p className="mb-4 text-lg">
          👋 Hello, Dev! (Testing outside Telegram)
        </p>
      )}

      <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow-xl">
        Start Quiz
      </button>
    </div>
  );
}

export default App;
