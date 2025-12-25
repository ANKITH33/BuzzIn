import React from 'react'

const ChoiceCard2 = () => {
  return (
    <div className="bg-blue-900 p-8 rounded-2xl w-[420px] space-y-5">


        {/* Header Section */}
        <div className="space-y-2">
            <p className="italic text-white text-xl opacity-80">Host?</p>
            <h2 className="text-white text-3xl font-inter">Create Room</h2>
        </div>

        {/* Description */}
        <div className="">
            <p className="text-neutral-200 opacity-100">
                Host a quiz, free of cost!
            </p>
            <p className="text-neutral-200 opacity-100">
                Get a shareable link to invite more players.
            </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
            <input type="text" className="input input-bordered w-full bg-white text-neutral-700" placeholder="Enter Room Name"></input>
        </div>

        {/* Action */}
        <button className="btn btn-wide btn-info">Let's Go!!</button>

    </div>
  )
}

export default ChoiceCard2