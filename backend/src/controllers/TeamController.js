import Team from "../models/Team.js";
import Room from "../models/Room.js";


export async function joinTeam(req, res) {
  const {roomCode,teamName}=req.body;

  const room= await Room.findOne({code: roomCode}).select("quiz").lean();
  if (!room || !room.quiz) {
    return res.status(400).json({ error: "Invalid room" });
  }

  const inactiveTeam = await Team.findOne({quiz: room.quiz,teamName,isActive: false,});

  if(inactiveTeam){
    return res.status(409).json({error: "Team exists. Try rejoining"});
  }

  try {
    const team = await Team.create({ teamName, quiz: room.quiz });
    const io = req.app.get("io");

    req.app.get("leaderboardCache").delete(room.quiz.toString());
    req.app.get("playersCache").delete(room.quiz.toString());

    io.to(roomCode).emit("players-updated");
    io.to(roomCode).emit("leaderboard-updated");
    
    return res.status(201).json(team);
  } catch (err) {
    console.log(err.keyValue);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Team name already taken" });
    }
    return res.status(500).json({ error: "Join failed" });
  }
}

export async function getLeaderboard(req, res) {
  const {roomCode} = req.params;
  const room = await Room.findOne({ code: roomCode });
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (!room.quiz) {
    return res.status(400).json({ error: "Quiz not started yet" });
  }

  const cacheKey = room.quiz.toString();
  const cached = req.app.get("leaderboardCache")?.get(cacheKey);
  if(cached){return res.json(cached);}

  const teams = await Team.find({ quiz: room.quiz }).sort({ totalScore: -1 }).select("teamName totalScore").lean();

  req.app.get("leaderboardCache").set(cacheKey, teams);
  res.json(teams);

}


export async function rejoinTeam (req,res){
  const {roomCode,teamName}=req.body;

  const room= await Room.findOne({code: roomCode}).select("quiz").lean();
  if (!room || !room.quiz) {
    return res.status(400).json({ error: "Invalid room" });
  }

  const existingTeam= await Team.findOne({quiz: room.quiz,teamName: teamName, isActive:true});
  if(existingTeam){
    return res.status(409).json({error: "Team is already in the room"});
  }

  const existingInactive = await Team.findOne({quiz: room.quiz,teamName, isActive:false});
  if(existingInactive){
    existingInactive.isActive=true;
    await existingInactive.save();

    const io = req.app.get("io");

    req.app.get("leaderboardCache").delete(room.quiz.toString());
    req.app.get("playersCache").delete(room.quiz.toString());

    io.to(roomCode).emit("players-updated");
    io.to(roomCode).emit("leaderboard-updated");

    return res.status(200).json(existingInactive);
  }
  return res.status(404).json({error: "Team not found. Don't rejoin"});
}