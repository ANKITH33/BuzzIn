import mongoose from "mongoose";

const teamQuestionScoreSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },

  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Round",
    required: true,
  },

  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },

  score: {
    type: Number,
    default: 0,
  },
});

// exactly ONE cell per team per question
teamQuestionScoreSchema.index(
  { team: 1, question: 1 },
  { unique: true }
);

export default mongoose.model(
  "TeamQuestionScore",
  teamQuestionScoreSchema
);
