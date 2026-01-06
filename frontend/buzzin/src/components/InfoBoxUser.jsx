import React from 'react'

const InfoBoxUser = ({quizTitle, teamName, players, roomCode,roundNumber, questionNumber,roundType,quizEnded}) => {


  return (
    <div className="bg-gradient-to-b from-blue-900/90 to-slate-800 backdrop-blur-md text-white rounded-xl mx-6 mt-6 p-2">

      {/* Title */}
      <div className="px-1 py-2">
        <h2 className="font-bold tracking-tight pl-5 text-xl md:text-2xl">
          Info
        </h2>
      </div>

      <hr className="border-white/90 mx-6" />

      {/* Info row */}
      <div className="px-6 py-2">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:flex md:items-center md:justify-between text-sm md:text-lg">

          <p className='text-base'>
            <span className="opacity-60">Quiz Title:</span> {quizTitle}
          </p>

          <p className='text-base'>
            <span className="opacity-60">#Players:</span> {players}
          </p>

          <p className='text-base'>
            <span className="opacity-60">Team Name:</span> {teamName}
          </p>

          <p className='text-base'>
            <span className="opacity-60">Room Code:</span> {roomCode}
          </p>

        </div>
      </div>

      <hr className="border-white/70 mx-6 " />

      {!quizEnded && (<div className="px-6 py-2">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:flex md: items-center md:justify-between text-sm md:text-lg ">

          <p className='text-base'>
            <span className="opacity-60">Round:</span> {roundNumber}
          </p>

          <p className='text-base'>
            <span className="opacity-60">Question:</span> {questionNumber}
          </p>

          <p className='text-base'>
            <span className="opacity-60">Round Type:</span> {roundType}
          </p>

        </div>
      </div>)}

      <hr className="border-white/70 mx-6 p-2" />
    </div>
  );
};


export default InfoBoxUser