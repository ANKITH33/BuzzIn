import React from 'react';
import {useState} from 'react';
import axios from "axios";

const InfoBoxHost = ({quizTitle, roomCode, roundNumber, roundType, questionNumber, players, onNextQuestion , buzzerLocked, setBuzzerLocked,quizEnded,nextLoading}) => {
  const handleChange = async (e) =>{
    const locked = e.target.checked;
    setBuzzerLocked(locked);
    await axios.post(`http://localhost:5001/api/rooms/${roomCode}/buzzers`,{locked});
    return;
  }
  
  return (
    <div className="bg-blue-900 text-white rounded-xl mx-6 mt-6 p-2">

      <div className="px-1 py-2 mb-1">
        <div className="flex flex-col gap-1 md:flex-row md:justify-between text-sm md:text-lg mr-6 ">
            <h2 className="font-bold tracking-tight pl-5 text-xl md:text-2xl">
            Info
            </h2>
            <button className={`btn btn-sm transition-all duration-200 ${quizEnded || nextLoading ? "bg-slate-700 text-slate-400 cursor-not-allowed opacity-60": "btn-secondary hover:scale-[1.02]"}`} onClick={onNextQuestion} disabled={quizEnded ||nextLoading}>
              {nextLoading ? "Processing" : quizEnded ? "Quiz Ended" : "Next Question"}
            </button>
        </div>
      </div>

      <hr className="border-white/90 mx-6" />

      <div className="px-6 py-2 ">
        <div className="flex flex-col gap-1 md:flex-row md:justify-between text-sm md:text-lg ">

          <p className='text-base'>
            <span className="opacity-60">Quiz Title:</span> {quizTitle}
          </p>

          <p className='text-base'>
            <span className="opacity-60"># Players:</span> {players}
          </p>
          <p className='text-base'>
            <span className="opacity-60">Room Code:</span> {roomCode}
          </p>

        </div>
      </div>

      <hr className="border-white/70 mx-6" />

      {!quizEnded && (<div className="px-6 ">
        <div className="flex flex-col gap-1 md:flex-row md:justify-between text-sm md:text-lg ">

          <p className='text-base py-2'>
            <span className="opacity-60">Round:</span> {roundNumber}
          </p>

          <p className='text-base py-2'>
            <span className="opacity-60">Question:</span> {questionNumber}
          </p>

          <p className='text-base py-2'>
            <span className="opacity-60">Round Type:</span> {roundType}
          </p>

          <div className="form-control">
              <label className="cursor-pointer label gap-2">
                  <span className="text-sm opacity-80">Lock Buzzers?</span>
                  <input type="checkbox" checked={buzzerLocked} className="checkbox checkbox-error" onChange={handleChange} disabled={quizEnded}/>
              </label>
          </div>

        </div>
      </div>)}

      <hr className="border-white/70 mx-6 p-2" />

    </div>
  )
}

export default InfoBoxHost