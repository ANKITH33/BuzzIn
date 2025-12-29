import React from 'react'
import { useParams } from 'react-router-dom';

const InfoBoxCreate = ({ quizTitle, roomCode }) => {
  
  return (
    <div className="bg-blue-900 text-white rounded-xl mx-6 mt-6 p-2">

      {/* Title */}
      <div className="px-1 py-2">
        <h2 className="font-bold tracking-tight pl-5 text-xl md:text-2xl">
          Info
        </h2>
      </div>

      <hr className="border-white/90 mx-6" />

      {/* Info row */}
      <div className="px-6 py-2 ">
        <div className="flex flex-col gap-1 md:flex-row md:justify-between text-sm md:text-lg ">

          <p className='text-base'>
            <span className="opacity-60">Quiz Title:</span> {quizTitle}
          </p>

          <p className='text-base'>
            <span className="opacity-60">Room Code:</span> {roomCode}
          </p>

        </div>
      </div>

      <hr className="border-white/70 mx-6 p-2" />
    </div>
  );
};


export default InfoBoxCreate