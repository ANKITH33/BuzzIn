import Team from "../models/Team.js";
import Room from "../models/Room.js";


export async function joinTeam(req, res) {
  const {roomCode,teamName}=req.body;

  const room= await Room.findOne({code: roomCode}).select("quiz");
  if (!room || !room.quiz) {
    return res.status(400).json({ error: "Invalid room" });
  }

  try {
    const team = await Team.create({ teamName, quiz: room.quiz });
    return res.status(201).json(team);
  } catch (err) {
    console.log(err.keyValue);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Team name already taken" });
    }
    return res.status(500).json({ error: "Join failed" });
  }
}
