const AnswerBox = ({ setAnswer, answer, pressed }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Type your answer"
        value={answer}
        disabled={pressed}
        onChange={(e) => setAnswer(e.target.value)}
        className={`input mt-3 input-bordered w-full rounded-2xl focus:outline-none
          ${pressed
            ? "!bg-red-100 !text-red-700 border-red-400 ring-red-400 cursor-not-allowed"
            : "!bg-white text-slate-900 focus:ring-2 focus:ring-emerald-400"
          }`}
      />
    </div>
  );
};

export default AnswerBox;
