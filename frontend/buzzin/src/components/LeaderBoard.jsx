import React from 'react'
import LeaderBoardEntry from './LeaderBoardEntry';

const Leaderboard = ({teams=[]}) => {
  return (
    <div className="bg-yellow-500 opacity-90 rounded-xl w-full p-3 sm:p-4">
        <h1 className="text-slate-950 font-medium text-2xl ml-6 mb-5 mt-2"> Leaderboard</h1>
        

        {teams.map((team,i) =>(
          <LeaderBoardEntry key={team._id}
            rank={i+1}
            name={team.teamName}
            score={team.totalScore}
            />
        ))}
    </div>
  )
}

export default Leaderboard