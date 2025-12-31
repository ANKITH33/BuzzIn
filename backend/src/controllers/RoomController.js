import Room from '../models/Room.js'
import Team from '../models/Team.js';
import Round from '../models/Round.js';
import GameState from '../models/GameState.js';

export async function CreateRoom (req,res) {
    let room=null;
    let attempts=0;
    try {
        while (!room && attempts < 5) {
            try {
                const code = Math.random().toString(36).substring(2, 7).toUpperCase();
                room = await Room.create({ code });
            } catch (err) {
                if (err.code === 11000) {
                    attempts++;
                    continue;
                }
                throw err;
            }
        }

        if (!room) {
            return res.status(500).json({
                message: "Failed to generate unique room code",
            });
        }

        return res.status(201).json(room);
    } catch (error) {
        console.error("Error in createRoom controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




export async function getRoomByCode(req, res) {
  const { roomCode } = req.params;

  const room = await Room.findOne({ code: roomCode })
    .populate("quiz","title")
    .select("code status quiz");//selects fields from json

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const playerCount = room.quiz ? await Team.countDocuments({quiz:room.quiz}):0;

  return res.json({...room.toObject(),playerCount});//converts Mongoose document to js object and adds a field
}




export async function getCurrentGameInfo (req,res){
    const {roomCode} = req.params;

    const room = await Room.findOne({code: roomCode});
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    if (!room.quiz) {
        return res.status(400).json({ error: "Quiz not started yet" });
    }

    const gameState = await GameState.findOne({room : room._id});
    if(!gameState){
        return res.status(404).json({error: "GameState not found"});
    }

    const round = await Round.findOne({quiz: room.quiz, order:gameState.currentRoundIndex}).select("type");

    return res.json({
        roundNumber: gameState.currentRoundIndex,
        questionNumber: gameState.currentQuestionIndex,
        roundType: round?.type || "",
    });
}



export async function toggleBuzzers (req,res){
    const {roomCode} = req.params;
    const {locked} = req.body;

    const room = await Room.findOne({code: roomCode});

    if(!room){
        return res.status(404).json({error: "Room not found"});
    }

    if (!room.quiz) {
        return res.status(400).json({ error: "Quiz not started yet" });
    }

    const gameState = await GameState.findOneAndUpdate({room: room._id},{buzzersLocked: locked},{new:true});
    if (!gameState) return res.status(404).json({ error: "GameState not found" });

    const io = req.app.get("io");
    io.to(roomCode).emit("buzzers-locked", locked); //Targets only sockets that joined this room
    //Event name: "buzzers-locked"
    //Payload: locked (true or false)

    return res.status(200).json({locked: gameState.buzzersLocked});
}



export async function getBuzzerState (req,res){
    const {roomCode} = req.params;
    
    const room = await Room.findOne({code: roomCode});
    if(!room){
        return res.status(404).json({error : "Room not found"});
    }
    if(!room.quiz){
        return res.status(400).json({ error: "Quiz not started yet" });
    }

    const gameState = await GameState.findOne({ room: room._id });
    if (!gameState) {
        return res.status(404).json({ error: "GameState not found" });
    }

    return res.json({ locked: gameState.buzzersLocked });

}


export async function updateResponses (req,res){
    const {answer= "",teamName}=req.body;
    const {roomCode}=req.params;

    const room= await Room.findOne({code:roomCode});
    if(!room){
        return res.status(404).json({error : "Room not found"});
    }
    if(!room.quiz){
        return res.status(400).json({ error: "Quiz not started yet" });
    }

    const team = await Team.findOne({
        quiz: room.quiz,
        teamName: teamName,
    });
    if(!team){
        return res.status(404).json({ error: "Team not found" });
    }

    const gameState = await GameState.findOneAndUpdate(
        {
            room: room._id,
            buzzedTeams: { $ne: team._id },
        },
        {$push: {
            buzzedTeams: team._id,
            submittedAnswers: {team: team._id, answerText: answer, evaluated: false,},
            },
        },
        { new: true }
    );
    if (!gameState) {
        return res.status(409).json({ error: "Team already buzzed" });
    }

    const io = req.app.get("io");
    io.to(roomCode).emit("response-updated");

    return res.status(200).json({ success: true });
}

export async function getMyBuzzerStatus(req,res) {
    const {roomCode}=req.params;
    const {teamName}=req.query;//since we are not changing state

    const room= await Room.findOne({code:roomCode});
    if(!room){
        return res.status(404).json({error : "Room not found"});
    }
    if(!room.quiz){
        return res.status(400).json({ error: "Quiz not started yet" });
    }

    const team = await Team.findOne({
        quiz: room.quiz,
        teamName: teamName,
    });
    if(!team){
        return res.status(404).json({ error: "Team not found" });
    }

    const gameState = await GameState.findOne({ room: room._id });
    if (!gameState) {
        return res.status(404).json({ error: "GameState not found" });
    }

    const alreadyBuzzed = gameState.buzzedTeams.some( (id) => id.equals(team._id));
    const submittedEntry = gameState.submittedAnswers.find((entry) => entry.team.equals(team._id));

    const alreadyAnswered = !!submittedEntry;
    const submittedAnswer = submittedEntry ? submittedEntry.answerText : null;

    return res.json({alreadyBuzzed,alreadyAnswered,submittedAnswer });
}

export async function getBuzzerBoard (req,res){
    const {roomCode}=req.params;

    const room = await Room.findOne({code:roomCode});
    if(!room){
        return res.status(404).json({error : "Room not found"});
    }
    if(!room.quiz){
        return res.status(400).json({ error: "Quiz not started yet" });
    }

    const gameState = await GameState.findOne({ room: room._id }).populate("buzzedTeams", "teamName").populate("submittedAnswers.team", "teamName");
    if (!gameState) {
        return res.status(404).json({ error: "GameState not found" });
    }

    return res.status(200).json({
        buzzedTeams: gameState.buzzedTeams.map(t => t.teamName),
        submittedAnswers: gameState.submittedAnswers.map(a => ({
            teamName: a.team.teamName,
            answer: a.answerText,
        }))
    });

}

export async function clearBuzzers (req,res) {
    const {roomCode} = req.params;

    const room = await Room.findOne({code:roomCode});
    if(!room){
        return res.status(404).json({error: "Room not found"});
    }

    if(!room.quiz){
        return res.status(400).json({error: "Quiz not started yet"});
    }

    const gameState = await GameState.findOneAndUpdate(
        {room : room._id},
        {buzzedTeams: [],
        submittedAnswers: []},
        {new:true}
    )
    if (!gameState) {
        return res.status(404).json({ error: "GameState not found" });
    }

    const io = req.app.get("io");
    io.to(roomCode).emit("buzzer-cleared");

    res.status(200).json({buzzedTeams:[],submittedAnswers:[]});
}