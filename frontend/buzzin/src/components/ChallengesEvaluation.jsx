import React from 'react'

const ChallengesEvaluation = ({handleEvaluate}) => {
  return (
    <div className="flex flex-row text-slate-800 rounded-md justify-between  border-slate-500  mr-2 mb-1 gap-1">
      <button className="btn btn-sm bg-slate-900 btn-outline border-green-500">
          <span className="text-green-500 text-xl font-bold">✓</span>
      </button>
      <button className="btn btn-sm bg-slate-900  btn-outline border-red-500">
          <span className="text-red-500 text-xl ">X</span>
      </button>
      <button className="btn btn-sm bg-slate-900 btn-outline border-green-500">
          <span className="text-green-500 text-xl font-bold">C✓</span>
      </button>
      <button className="btn btn-sm bg-slate-900  btn-outline border-red-500">
          <span className="text-red-500 text-xl ">CX</span>
      </button>
      <button className="btn btn-sm bg-slate-900 btn-outline border-green-500">
          <span className="text-green-500 text-xl font-bold">Concur</span>
      </button>
      <button className="btn btn-sm bg-slate-900  btn-outline border-red-500">
          <span className="text-red-500 text-xl ">Concur</span>
      </button>
    </div>
  )
}

export default ChallengesEvaluation