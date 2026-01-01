import { useState, useEffect } from "react";

const BuzzerWithChallengesConfig = ({ onValidityChange, onConfigChange }) => {
  const [correct, setCorrect] = useState("");
  const [correctError, setCorrectError] = useState("");

  const [wrong, setWrong] = useState("");
  const [wrongError, setWrongError] = useState("");

  const [challengeCorrect, setChallengeCorrect] = useState("");
  const [challengeCorrectError, setChallengeCorrectError] = useState("");

  const [challengeWrong, setChallengeWrong] = useState("");
  const [challengeWrongError, setChallengeWrongError] = useState("");

  const [concurPenalty, setConcurPenalty] = useState("");
  const [concurPenaltyError, setConcurPenaltyError] = useState("");

  const [questions, setQuestions] = useState("");
  const [questionError, setQuestionError] = useState("");

  const valid =
    correct !== "" &&
    wrong !== "" &&
    challengeCorrect !== "" &&
    challengeWrong !== "" &&
    concurPenalty !== "" &&
    questions !== "" &&
    !correctError &&
    !wrongError &&
    !challengeCorrectError &&
    !challengeWrongError &&
    !concurPenaltyError &&
    !questionError;

  const numericChange = (setter, errorSetter) => (e) => {
    const value = e.target.value;
    if (value === "") {
      setter("");
      errorSetter("");
      return;
    }
    if (!/^-?\d*$/.test(value)) return;
    setter(value);
  };

  const positiveBlur = (value, errorSetter) => {
    if (value === "") return errorSetter("Required");
    const num = Number(value);
    if (Number.isNaN(num)) return errorSetter("Only numbers allowed");
    if (num < 0) return errorSetter("Must be positive");
    errorSetter("");
  };

  const nonPositiveBlur = (value, errorSetter) => {
    if (value === "") return errorSetter("Required");
    const num = Number(value);
    if (Number.isNaN(num)) return errorSetter("Only numbers allowed");
    if (num > 0) return errorSetter("Must be non-positive");
    errorSetter("");
  };

  const positiveIntBlur = (value, errorSetter) => {
    if (value === "") return errorSetter("Required");
    const num = Number(value);
    if (Number.isNaN(num)) return errorSetter("Only numbers allowed");
    if (num < 1) return errorSetter("Must be at least 1");
    errorSetter("");
  };

  useEffect(() => {
    onValidityChange(valid);
  }, [valid]);

  useEffect(() => {
    if (valid) {
      onConfigChange({
        questionsCount: Number(questions),
        scoring: {
          correct: Number(correct),
          wrong: Number(wrong),
          challengeCorrect: Number(challengeCorrect),
          challengeWrong: Number(challengeWrong),
          concurPenalty: Number(concurPenalty),
        },
      });
    }
  }, [
    valid,
    correct,
    wrong,
    challengeCorrect,
    challengeWrong,
    concurPenalty,
    questions,
    onConfigChange,
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-3 mb-2 flex-wrap">
      <Input
        label="Points for correct"
        value={correct}
        error={correctError}
        onChange={numericChange(setCorrect, setCorrectError)}
        onBlur={() => positiveBlur(correct, setCorrectError)}
      />

      <Input
        label="Points for wrong"
        value={wrong}
        error={wrongError}
        onChange={numericChange(setWrong, setWrongError)}
        onBlur={() => nonPositiveBlur(wrong, setWrongError)}
      />

      <Input
        label="Challenge correct points"
        value={challengeCorrect}
        error={challengeCorrectError}
        onChange={numericChange(setChallengeCorrect, setChallengeCorrectError)}
        onBlur={() =>
          positiveBlur(challengeCorrect, setChallengeCorrectError)
        }
      />

      <Input
        label="Challenge wrong points"
        value={challengeWrong}
        error={challengeWrongError}
        onChange={numericChange(setChallengeWrong, setChallengeWrongError)}
        onBlur={() =>
          nonPositiveBlur(challengeWrong, setChallengeWrongError)
        }
      />

      <Input
        label="Concur penalty"
        value={concurPenalty}
        error={concurPenaltyError}
        onChange={numericChange(setConcurPenalty, setConcurPenaltyError)}
        onBlur={() =>
          positiveBlur(concurPenalty, setConcurPenaltyError)
        }
      />

      <Input
        label="Number of questions"
        value={questions}
        error={questionError}
        onChange={numericChange(setQuestions, setQuestionError)}
        onBlur={() => positiveIntBlur(questions, setQuestionError)}
      />
    </div>
  );
};

const Input = ({ label, value, error, onChange, onBlur }) => (
  <div className="flex flex-col">
    <input
      type="text"
      inputMode="numeric"
      placeholder={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`input bg-slate-900 text-zinc-200 w-56 ${
        error ? "border-red-600 border-2" : ""
      }`}
    />
    {error && (
      <p className="text-red-600 text-sm mt-1 ml-2">{error}</p>
    )}
  </div>
);

export default BuzzerWithChallengesConfig;
