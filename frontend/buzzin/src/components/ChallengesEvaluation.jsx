import React from "react";

const ChallengesEvaluation = ({ handleEvaluate }) => {
  return (
    <div className="grid grid-cols-4 gap-1 ml-2 mr-4 items-start">
      <button className="btn btn-sm bg-slate-900 btn-outline border-green-500"
        onClick={() => handleEvaluate("CORRECT")}
      >
        <span className="text-green-500 text-xl font-bold">✓</span>
      </button>

      <button className="btn btn-sm bg-slate-900 btn-outline border-red-500"
        onClick={() => handleEvaluate("WRONG")}
      >
        <span className="text-red-500 text-xl">X</span>
      </button>

      <button className="btn btn-sm bg-slate-900 btn-outline border-green-500"
        onClick={() => handleEvaluate("CHALLENGE_CORRECT")}
      >
        <span className="text-green-500 text-md font-bold">C✓</span>
      </button>

      <button className="btn btn-sm bg-slate-900 btn-outline border-red-500"
        onClick={() => handleEvaluate("CHALLENGE_WRONG")}
      >
        <span className="text-red-500 text-md">CX</span>
      </button>

      <div className="col-span-2 flex justify-end">
        <button className="btn btn-sm bg-slate-900 btn-outline border-green-500 w-fit"
          onClick={() => handleEvaluate("NO_PENALTY")}
        >
          <span className="text-green-500 text-md">Concur</span>
        </button>
      </div>

      <div className="col-span-2 flex justify-start">
        <button className="btn btn-sm bg-slate-900 btn-outline border-red-500 w-fit"
          onClick={() => handleEvaluate("CONCUR_PENALTY")}
        >
          <span className="text-red-500 text-md">Concur</span>
        </button>
      </div>
    </div>
  );
};

export default ChallengesEvaluation;
