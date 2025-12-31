import React from 'react'

const BuzzerBoardEntry = ({name,response}) => {
  return (
    <div className="bg-white text-slate-800 rounded-md flex justify-between p-2 border-2 border-slate-500 ml-6 mr-6 mb-1">
      <span> {name}</span>
      <span className="font-semibold">{response}</span>
    </div>
  )
}

export default BuzzerBoardEntry