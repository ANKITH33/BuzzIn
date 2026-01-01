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
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },

    // buzzer with challenges
    challengeCorrect: { type: Number, default: 0 },
    challengeWrong: { type: Number, default: 0 },
    concurPenalty: { type: Number, default: 0 },

    // differential scoring
    scaler: { type: Number, default: 0 },
  },

  questionsCount:{
    type: Number,
    required: true,
  }
});

export default mongoose.model("Round", roundSchema);
