import React from 'react'
import BuzzerBoardEntry from './BuzzerBoardEntry'

const BuzzerBoard = ({responses=[],handleClearAll,roundType,roomCode}) => {
  return (
    <div className="bg-green-500 opacity-90 rounded-xl w-full p-4 pl-2 pr-2">
      <div className="flex flex-row justify-between mb-2 ml-6 mr-6">
        <h1 className="text-slate-950 font-medium text-2xl mb-2"> Buzzer Board</h1>
        <button className="btn btn-black rounded-xl btn-sm mt-1" onClick={handleClearAll}>Clear All</button>
      </div>
      {responses.map((r, i) => (
        <BuzzerBoardEntry
          key={i}
          name={r.teamName}
          response={r.answer}
          roundType={roundType}
          roomCode={roomCode}
        />
      ))}

    </div>
  )
}

export default BuzzerBoard