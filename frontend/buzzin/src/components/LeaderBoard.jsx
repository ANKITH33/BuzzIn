import React from 'react'
import LeaderBoardEntry from './LeaderBoardEntry';

const Leaderboard = ({teams=[]}) => {
  return (
    <div className="bg-yellow-500 opacity-90 rounded-xl w-full p-3 sm:p-4 flex flex-col">
        <h1 className="text-slate-950 font-medium text-2xl mb-5 mt-2 text-center md:text-left w-full md:ml-6 md:mr-6">
          Leaderboard
        </h1>

        
        <div className="w-full flex flex-col gap-2 md:ml-6 md:mr-6">
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