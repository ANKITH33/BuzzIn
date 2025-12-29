import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },

  type: {
    type: String,
    enum: [
      "classic_buzzer",
      "buzzer_with_challenges",
      "differential_scoring",
    ],
    required: true,
  },

  order: {
    type: Number,
    required: true,
  },

  // round-specific scoring rules
  scoring: {
    // classic buzzer
    correct: Number,
    wrong: Number,

    // buzzer with challenges
    challengeCorrect: Number,
    challengeWrong: Number,
    concurPenalty: Number,

    // differential scoring
    scaler: Number,
  },

  questionsCount:{
    type: Number,
    required: true,
  }
});

export default mongoose.model("Round", roundSchema);
