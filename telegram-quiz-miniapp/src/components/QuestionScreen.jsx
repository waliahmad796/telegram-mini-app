export default function QuestionScreen({ question, onAnswer, current, total }) {
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <p className="mb-1 text-sm text-gray-500">
        Question {current} of {total}
      </p>
      <h2 className="text-xl font-bold mb-4 text-blue-700 drop-shadow-sm">
        {question.text}
      </h2>
      <div className="grid gap-3 w-full max-w-md">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            className="w-full bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-blue-900 font-semibold px-4 py-3 rounded-xl shadow transition-all duration-150 border border-blue-200"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
