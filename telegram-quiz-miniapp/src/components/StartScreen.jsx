export default function StartScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <p className="mb-2 text-lg text-gray-700">
        Test your brain in this quick quiz!
      </p>
      <button
        onClick={onStart}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow transition-all duration-200"
      >
        <span className="text-xl">▶️</span> Start Quiz
      </button>
    </div>
  );
}
