import React from 'react'
import LeaderBoardEntry from './LeaderBoardEntry';

const Leaderboard = ({teams=[]}) => {
  return (
    <div className="bg-yellow-500 opacity-90 rounded-xl w-full p-3 sm:p-4 flex flex-col items-center">
        <h1 className="text-slate-950 font-medium text-2xl mb-5 md:mb-2 md:mx-6 mt-2 text-center md:text-left w-full">
          Leaderboard
        </h1>
        
        <div className="w-full flex flex-col gap-2">
        {teams.map((team,i) =>(
          <LeaderBoardEntry key={team._id}
            rank={i+1}
            name={team.teamName}
            score={team.totalScore}
            />
        ))}
        </div>
    </div>
  )
}

export default Leaderboard