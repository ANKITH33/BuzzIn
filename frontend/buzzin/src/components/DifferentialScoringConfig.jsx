  import { useState } from "react";
  import { useEffect } from "react";

  const DifferentialScoringConfig = ({onValidityChange,onConfigChange}) => {
    const [scalingFactor, setScalingFactor] = useState("");
    const [scalingError, setScalingError] = useState("");

    const [question,setQuestions] = useState("");
    const [questionError,setQuestionError] = useState("");

    const valid = scalingFactor!=""  && question!="" && !scalingError && !questionError;

    const handleScalingChange = (e) => {
      const value = e.target.value;

      if (value === "") {
        setScalingFactor("");
        setScalingError("");
        return;
      }

      if (!/^-?\d*$/.test(value)) return;

      setScalingFactor(value);
    };

    const handleScalingBlur = () => {
      if (scalingFactor === "") {
        setScalingError("Required");
        return;
      }

      const num = Number(scalingFactor);

      if (Number.isNaN(num)) {
        setScalingError("Only numbers allowed");
        return;
      }

      if (num < 0) {
        setScalingError("Scale must be positive");
        return;
      }

      setScalingError("");
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

    useEffect(() => {
      if (!valid) return;
      onConfigChange({
        questionsCount: Number(question),
        scoring: {
          scaler: Number(scalingFactor),
        }
      });
    }, [valid, scalingFactor, question, onConfigChange]);
    
    return (
      <div className="flex flex-col md:flex-row gap-4 mt-3 mb-2">

        {/* Scaling factor */}
        <div className="flex flex-col">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Scaling factor"
            value={scalingFactor}
            onChange={handleScalingChange}
            onBlur={handleScalingBlur}
            className={`input bg-slate-900 text-zinc-200 w-56 ${
              scalingError ? "border-red-600 border-opacity-75 border-2" : ""
            }`}
          />
          {scalingError && (
            <p className="text-red-600 text-opacity-90 text-sm mt-1 ml-2">{scalingError}</p>
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

  

  export default DifferentialScoringConfig;
