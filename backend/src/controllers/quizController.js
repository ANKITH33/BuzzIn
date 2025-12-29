import Quiz from "../models/Quiz.js";
import Room from "../models/Room.js";
import Round from "../models/Round.js";
import GameState from "../models/GameState.js";
import mongoose from "mongoose";

export async function createQuiz(req, res) {
  let session;
  try {

    const {title,roomCode,rounds} = req.body;

    if (!title || !roomCode || !Array.isArray(rounds) || rounds.length === 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    //To make multiple database operations behave like ONE atomic operation - either everything succeeds, or nothing is saved.

    session = await mongoose.startSession();
    session.startTransaction();

    const quiz = await Quiz.create(
      [{
        title,
        isActive: true,
      }],{session}
    ); //When you pass an ARRAY to create(), Mongoose returns an array.
    //You only need arrays when using create() with a session. why ? If session is provided, create() must behave like insertMany() and hence arrays are needed


    const room = await Room.findOneAndUpdate(
      {code: roomCode}, //Find the document in the rooms collection where room.code === roomCode
      {status: "active", quiz: quiz[0]._id},//update
      {new: true,session}//returns updated 
    );//The result is not an array here because findONE

    if (!room) {
      throw new Error("Room not found");;
    }

    await Round.insertMany(
      rounds.map(r => ({
        quiz: quiz[0]._id,
        order: r.order,
        type: r.type,
        questionsCount: r.questionsCount,
        scoring: r.scoring
      })),
      {session}
    );

    await GameState.create(
      [{
        room: room._id,
        quiz: quiz[0]._id,
        status: "active",
        currentRoundIndex: 1,
        currentQuestionIndex: 1
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      quizId: quiz[0]._id,
      roomCode
    });

  } catch (error) {
    if(session){
      await session.abortTransaction();
      session.endSession();
    }
    
    
    return res.status(500).json({ error: error.message });
  }
}
