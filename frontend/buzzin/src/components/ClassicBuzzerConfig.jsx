  import { useState } from "react";
  import { useEffect } from "react";

  const ClassicBuzzerConfig = ({onValidityChange}) => {
    const [correct, setCorrect] = useState("");
    const [correctError, setCorrectError] = useState("");

    const [incorrect, setIncorrect] = useState("");
    const [incorrectError, setIncorrectError] = useState("");

    const [question,setQuestions] = useState("");
    const [questionError,setQuestionError] = useState("");

    const valid = correct!="" && incorrect!="" && question!="" && !correctError && !incorrectError && !questionError;

    const handleCorrectChange = (e) => {
      const value = e.target.value;

      if (value === "") {
        setCorrect("");
        setCorrectError("");
        return;
      }

      if (!/^-?\d*$/.test(value)) return;

      setCorrect(value);
    };

    const handleCorrectBlur = () => {
      if (correct === "") {
        setCorrectError("Required");
        return;
      }

      const num = Number(correct);

      if (Number.isNaN(num)) {
        setCorrectError("Only numbers allowed");
        return;
      }

      if (num < 0) {
        setCorrectError("Points must be positive");
        return;
      }

      setCorrectError("");
    };

    
    const handleIncorrectChange = (e) => {
      const value = e.target.value;

      if (value === "") {
        setIncorrect("");
        setIncorrectError("");
        return;
      }

      if (!/^-?\d*$/.test(value)) return;

      setIncorrect(value);
    };

    const handleIncorrectBlur = () => {
      if (incorrect === ""){
        setIncorrectError("Required");
        return;
      };

      const num = Number(incorrect);

      if (Number.isNaN(num)) {
        setIncorrectError("Only numbers allowed");
        return;
      }

      if (num > 0) {
        setIncorrectError("Points must be non positive");
        return;
      }

      setIncorrectError("");
    };

    const handleQuestion = (e) =>{
      const value = e.target.value;

      if(value === ""){
        setQuestions("");
        setQuestionError("");
        return;
      }

      if (!/^\d*$/.test(value)) return;

      setQuestions(value);
    }

    const handleQuestionBlur = () =>{
      if(question ===""){
        setQuestionError("Required");
        return;
      }

      const num = Number(question);

      if (Number.isNaN(num)) {
        setQuestionError("Only numbers allowed");
        return;
      }

      if (num < 1) {
        setQuestionError("Round must have atleast 1 question");
        return;
      }

      setQuestionError("");
    }

    useEffect(() =>{
      onValidityChange(valid);
    },[valid]);
    
    return (
      <div className="flex flex-col md:flex-row gap-4 mt-3 mb-2">

        {/* Correct */}
        <div className="flex flex-col">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Points for correct answer"
            value={correct}
            onChange={handleCorrectChange}
            onBlur={handleCorrectBlur}
            className={`input bg-slate-900 text-zinc-200 w-56 ${
              correctError ? "border-red-600 border-opacity-75 border-2" : ""
            }`}
          />
          {correctError && (
            <p className="text-red-600 text-opacity-90 text-sm mt-1 ml-2">{correctError}</p>
          )}
        </div>

        {/* Incorrect */}
        <div className="flex flex-col">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Points for wrong answer"
            value={incorrect}
            onChange={handleIncorrectChange}
            onBlur={handleIncorrectBlur}
            className={`input bg-slate-900 text-zinc-200 w-56 ${
              incorrectError ? "border-red-600 border-opacity-75 border-2" : ""
            }`}
          />
          {incorrectError && (
            <p className="text-red-600 text-opacity-90 text-sm mt-1 ml-2">{incorrectError}</p>
          )}
        </div>

        {/* Questions */}
        <div className="flex flex-col">
          <input
          type="text"
          inputMode="numeric"
          placeholder="Number of questions"
          value={question}
          onChange={handleQuestion}
          onBlur={handleQuestionBlur}
          className={`input bg-slate-900 text-zinc-200 w-56 ${
              questionError ? "border-red-600 border-opacity-75 border-2" : ""
            }`}
          />
          {questionError && (
            <p className="text-red-600 text-opacity-90 text-sm mt-1 ml-2">{questionError}</p>
          )}
        </div>
        
      </div>
    );
  };

  

  export default ClassicBuzzerConfig;
