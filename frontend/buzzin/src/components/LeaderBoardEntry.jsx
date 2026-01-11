import React from 'react'

const LeaderBoardEntry = ({rank,name,score}) => {
  return (
    <div className="bg-white text-slate-800 rounded-md flex items-center justify-between p-2 border-2 border-slate-500 mx-2 sm:mx-6 mb-1">
      <span className="truncate max-w-[70%]">{rank}. {name}</span>
      <span className="font-semibold shrink-0">{score}</span>
    </div>
  )
}

export default LeaderBoardEntry