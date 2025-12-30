import React from 'react'
const BuzzerBoard = () => {
  return (
    <div className="bg-green-500 opacity-90 rounded-xl w-full p-4 pl-2 pr-2">
      <div className="flex flex-row justify-between mb-2 ml-6 mr-6">
        <h1 className="text-slate-950 font-medium trac text-2xl mb-2"> Buzzer Board</h1>
        <button className="btn btn-black rounded-xl btn-sm mt-1">Clear All</button>
      </div>
    </div>
  )
}

export default BuzzerBoard