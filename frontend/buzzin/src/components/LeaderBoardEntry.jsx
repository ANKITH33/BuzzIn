import React from 'react'

const LeaderBoardEntry = ({rank,name,score}) => {
  return (
    <div className="bg-white text-slate-800 rounded-md flex justify-between p-2 border-2 border-slate-500 ml-6 mr-6 mb-1">
      <span>{rank}. {name}</span>
      <span className="font-semibold">{score}</span>
    </div>
  )
}

export default LeaderBoardEntry