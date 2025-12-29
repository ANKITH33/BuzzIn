import React from 'react'

const BuzzerWithChallengesConfig = () => {
  return (
    <div className="flex flex-col md:flex-row mt-3 gap-4 mb-2 w-full md:w-auto">
        <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            placeholder="Points for correct answer"
            className="input input-bordered bg-white text-slate-900 w-56"
        />
        <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Points for wrong answer"
            max={0}
            className="input input-bordered bg-white text-slate-900 w-56"
        />
        <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Number of questions"
            min={1}
            className="input input-bordered bg-white text-slate-900 w-56"
        />
    </div>
  )
}

export default BuzzerWithChallengesConfig