import React from 'react'

const PounceBounceEvaluation = ({handleEvaluate}) => {
  return (
    <div className="flex flex-row text-slate-800 rounded-md justify-between  border-slate-500  mr-2 mb-1 gap-1">
        <button className="btn btn-sm bg-slate-900 btn-outline border-green-500 mt-1"
            onClick={() => handleEvaluate("RISK_CORRECT")}
        >
          <span className="text-green-500 text-xl font-bold">P✓</span>
        </button>
        <button className="btn btn-sm bg-slate-900  btn-outline border-red-500 mt-1"
            onClick={() => handleEvaluate("RISK_WRONG")}
        >
          <span className="text-red-500 text-xl ">PX</span>
        </button>
        <button className="btn btn-sm bg-slate-900 btn-outline border-green-500 mt-1"
            onClick={() => handleEvaluate("SAFE_CORRECT")}
        >
            <span className="text-green-500 text-xl font-bold">B✓</span>
        </button>
        <button className="btn btn-sm bg-slate-900  btn-outline border-red-500 mt-1"
            onClick={() => handleEvaluate("SAFE_WRONG")}
        >
            <span className="text-red-500 text-xl ">BX</span>
        </button>
    </div>
  )
}

export default PounceBounceEvaluation