import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz", //This ObjectId refers to a document in the Quiz collection
      required: true,
    },
  },
  { timestamps: true }
);

// team names must be unique per quiz
teamSchema.index({ quiz: 1, teamName: 1 }, { unique: true });

export default mongoose.model("Team", teamSchema);
