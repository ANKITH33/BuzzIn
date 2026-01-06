import React from "react";
import { useState } from "react";

const DifferentialEvaluation = ({handleEvaluate}) => {
  const [correctSelected,setCorrectSelected]=useState(false);
  const [wrongSelected,setWrongSelected]=useState(false);

  return (
    <div className="flex flex-row rounded-md justify-between  mr-2 mb-1 gap-1">
      <button 
        className={`btn btn-sm 
                    ${!correctSelected? "bg-green-700 border-green-700 text-slate-950" : "bg-slate-950 border-slate-950 text-green-500"} 
                    border 
                    hover:bg-slate-200 hover:border-slate-900 
                    transition-colors mt-1`
                  }
        onClick={() => {
          setCorrectSelected(true);
          setWrongSelected(false);
          handleEvaluate("CORRECT");
        }}
      >
          <span className="text-xl font-bold">✓</span>
      </button>
      <button 
        className={`btn btn-sm 
                    ${!wrongSelected? "bg-green-700 border-green-700 text-slate-950" : "bg-slate-950 border-slate-950 text-red-500"} 
                    border 
                    hover:bg-slate-200 hover:border-slate-900 
                    transition-colors mt-1`
                  }
        onClick={() => {
          setCorrectSelected(false);
          setWrongSelected(true);
          handleEvaluate("WRONG");
        }}
      >
          <span className=" text-xl ">X</span>
      </button>
    </div>
  );
};

export default DifferentialEvaluation;
