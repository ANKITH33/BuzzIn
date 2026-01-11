import React from 'react'
import LeaderBoardEntry from './LeaderBoardEntry';

const Leaderboard = ({teams=[]}) => {
  return (
    <div className="bg-yellow-500 opacity-90 rounded-xl w-full p-3 sm:p-4">
      <div className="md:mx-6">
        <h1 className="text-slate-950 font-medium text-2xl mt-2 mb-3 text-center md:text-left">
          Leaderboard
        </h1>

        <div className="flex flex-col gap-2">
          {teams.map((team, i) => (
            <LeaderBoardEntry
              key={team._id}
              rank={i + 1}
              name={team.teamName}
              score={team.totalScore}
            />
          ))}
        </div>
      </div>
    </div>
  );

}

export default Leaderboard