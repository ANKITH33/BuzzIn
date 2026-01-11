import mongoose from "mongoose";
import Room from '../models/Room.js'
import Team from '../models/Team.js';
import Round from '../models/Round.js';
import GameState from '../models/GameState.js';

const roundValidEvaluations = {
  classic_buzzer: [
    "CORRECT",
    "WRONG",
  ],

  buzzer_with_challenges: [
    "CORRECT",
    "WRONG",
    "CHALLENGE_CORRECT",
    "CHALLENGE_WRONG",
    "CONCUR_PENALTY",
    "NO_PENALTY",
  ],

  differential_scoring: [
    "CORRECT",
    "WRONG",
  ],

  pounce_bounce: [
    "RISK_CORRECT",
    "RISK_WRONG",
    "SAFE_CORRECT",
    "SAFE_WRONG",
  ],

  hit_hold: [
    "RISK_CORRECT",
    "RISK_WRONG",
    "SAFE_CORRECT",
    "SAFE_WRONG",
  ],
};

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
    .select("code status quiz").lean();//selects fields from json

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const cacheKey = room.quiz?.toString();
  let playerCount = 0;
  
  if (cacheKey) {
    const cached = req.app.get("playersCache").get(cacheKey);
    if (cached !== undefined) {
        playerCount = cached;
    }
    else{
        playerCount = await Team.countDocuments({ quiz: room.quiz });
        req.app.get("playersCache").set(cacheKey, playerCount);
    }
    }

  return res.json({...room,playerCount});//converts Mongoose document to js object and adds a field
}




export async function getCurrentGameInfo (req,res){
    const {roomCode} = req.params;

    const room = await Room.findOne({code: roomCode}).lean();
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
        status: gameState.status,
    });
}



export async function toggleBuzzers (req,res){
    const {roomCode} = req.params;
    const {locked} = req.body;

    const room = await Room.findOne({code: roomCode}).lean();

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
    
    const room = await Room.findOne({code: roomCode}).lean();
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
    if(!gameState){
        return res.status(409).json({ error: "Team already buzzed" });
    }
    if(gameState.questionProcessed){
        return res.status(409).json({ error: "Question already processed",});
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
        submittedAnswers: [],
        evaluations: {},
        questionProcessed: false,},
        {new:true}
    )
    if (!gameState) {
        return res.status(404).json({ error: "GameState not found" });
    }

    const io = req.app.get("io");
    io.to(roomCode).emit("buzzer-cleared");

    res.status(200).json({buzzedTeams:[],submittedAnswers:[]});
}

export async function updateEvaluation(req, res) {
    const {roomCode} = req.params;
    const {teamName,evaluation} = req.body;

    

    const room = await Room.findOne({ code: roomCode });
    if(!room){
        return res.status(404).json({error:"Room not found"});
    }

    if(!room.quiz){
        return res.status(400).json({error:"Quiz not started yet"});
    }

    const team = await Team.findOne({quiz: room.quiz,teamName});
    if(!team){
        return res.status(404).json({error:"Team not found"});
    }

    const gameState = await GameState.findOne({ room: room._id });
    if(!gameState){
        return res.status(404).json({error:"GameState not found"});
    }
    if (gameState.questionProcessed) {
        return res.status(409).json({error: "Question already processed",});
    }

    const round = await Round.findOne({quiz: room.quiz,order: gameState.currentRoundIndex,});
    if(!round){
        return res.status(404).json({ error: "Round not found" });
    }

    const allowedForRound = roundValidEvaluations[round.type];
    if(!allowedForRound){
        return res.status(400).json({ error: "Unsupported round type" });
    }

    if (!allowedForRound.includes(evaluation)) {
        return res.status(400).json({error: `Invalid evaluation for ${round.type}`,});
    }

    const hasAnswered = gameState.submittedAnswers.some(a => a.team.equals(team._id));
    if(!hasAnswered){
        return res.status(400).json({error:"Team has not submitted an answer"});
    }

    gameState.evaluations.set(team._id.toString(), evaluation);
    await gameState.save();

    const io = req.app.get("io");
    io.to(roomCode).emit("evaluation-updated", {
        teamName,
        evaluation,
    });

    return res.status(200).json({success:true});
}



export async function updateScores (req,res){
    const io = req.app.get("io");
    const {roomCode} = req.params;

    const room= await Room.findOne({code: roomCode});
    if(!room){
        return res.status(404).json({error: "Room not found"});
    }
    if(!room.quiz){
        return res.status(400).json({error: "Quiz not started yet"});
    }

    const gameState= await GameState.findOne({room: room._id});
    if(!gameState){
        return res.status(404).json({error: "GameState not found"});
    }

    if (gameState.questionProcessed) {
        return res.status(409).json({error: "This question has already been processed"});
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    gameState.questionProcessed=true;

    try{
        for(const entry of gameState.submittedAnswers){
            const teamID = entry.team.toString();
            if(!gameState.evaluations.has(teamID)){
                throw new Error("Evaluations incomplete");
            }
        }

        const round = await Round.findOne({quiz: room.quiz, order: gameState.currentRoundIndex,}).session(session);
        if(!round){
            throw new Error("Round not found");
        }

        const roundType = round.type;
        let correctTeams = 0;
        let wrongTeams = 0;

        if(roundType === "differential_scoring"){
            for(const entry of gameState.submittedAnswers){
                const evalValue = gameState.evaluations.get(entry.team.toString());
                if(evalValue === "CORRECT"){
                    correctTeams++;
                }
                else{ 
                    wrongTeams++;
                }
            }
        }

        const totalTeams = roundType === "differential_scoring" ? await Team.countDocuments({ quiz: room.quiz }): 0;

        for(const entry of gameState.submittedAnswers){
            const teamID=entry.team.toString();
            const evaluation=gameState.evaluations.get(teamID);

            const team=await Team.findById(entry.team).session(session);
            if(!team){
                throw new Error("Team not found");
            }

            if(roundType==="classic_buzzer"){
                if(evaluation === "CORRECT"){
                    team.totalScore += round.scoring.correct;
                }
                else if(evaluation === "WRONG"){
                    team.totalScore += round.scoring.wrong;
                }
                else{
                    throw new Error("Invalid evaluation");
                }
            }

            else if(roundType === "buzzer_with_challenges"){
                if(evaluation === "CORRECT"){
                    team.totalScore += round.scoring.correct;
                }
                else if(evaluation === "CHALLENGE_CORRECT"){
                    team.totalScore += round.scoring.challengeCorrect;
                }
                else if(evaluation === "CHALLENGE_WRONG"){
                    team.totalScore += round.scoring.challengeWrong;
                }
                else if(evaluation === "NO_PENALTY"){
                    team.totalScore += 0;
                }
                else if(evaluation === "CONCUR_PENALTY"){
                    team.totalScore += round.scoring.concurPenalty;
                }
                else if(evaluation === "WRONG"){
                    team.totalScore += round.scoring.wrong;
                }
                else{
                    throw new Error("Invalid evaluation");
                }
            }

            else if(roundType === "differential_scoring"){
                if (evaluation === "CORRECT") {
                    team.totalScore+=round.scoring.scaler*(totalTeams - correctTeams);
                }
                else if(evaluation === "WRONG"){
                    if (wrongTeams >= correctTeams) {
                        team.totalScore -=round.scoring.scaler;
                    }
                    else{
                        team.totalScore -=round.scoring.scaler*(correctTeams - wrongTeams);
                    }
                }
                else{
                    throw new Error("Invalid evaluation");
                }
            }

            else if(roundType === "pounce_bounce"){
                if (evaluation === "RISK_CORRECT") {
                    team.totalScore+=round.scoring.riskCorrect;
                }
                else if(evaluation === "RISK_WRONG"){
                    team.totalScore+=round.scoring.riskWrong;
                }
                else if(evaluation === "SAFE_CORRECT"){
                    team.totalScore+=round.scoring.safeCorrect;
                }
                else if(evaluation === "SAFE_WRONG"){
                    team.totalScore+=round.scoring.safeWrong;
                }
                else{
                    throw new Error("Invalid evalaution");
                }
            }

            else if(roundType === "hit_hold"){
                if (evaluation === "RISK_CORRECT") {
                    team.totalScore+=round.scoring.riskCorrect;
                }
                else if(evaluation === "RISK_WRONG"){
                    team.totalScore+=round.scoring.riskWrong;
                }
                else if(evaluation === "SAFE_CORRECT"){
                    team.totalScore+=round.scoring.safeCorrect;
                }
                else if(evaluation === "SAFE_WRONG"){
                    team.totalScore+=round.scoring.safeWrong;
                }
                else{
                    throw new Error("Invalid evalaution");
                }
            }

            await team.save({session});
        }

        //update GameState
        const numberofRounds= await Round.countDocuments({quiz: room.quiz});
        if(gameState.currentQuestionIndex<round.questionsCount){
            gameState.currentQuestionIndex++;
        }
        else{
            gameState.currentQuestionIndex = 1;
            if(gameState.currentRoundIndex<numberofRounds){
                gameState.currentRoundIndex++;
            }
            else{
                gameState.status="ended";
                io.to(roomCode).emit("endof-quiz");
            }
        }

        gameState.buzzedTeams=[];
        gameState.buzzersLocked=false;
        gameState.evaluations.clear();
        gameState.submittedAnswers=[];
        gameState.questionProcessed = false;

        await gameState.save({ session });

        await session.commitTransaction();
        session.endSession();
        req.app.get("leaderboardCache").delete(room.quiz.toString());

        io.to(roomCode).emit("updated-scores");

        return res.status(200).json({ success: true });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({ error: err.message });
    }

}