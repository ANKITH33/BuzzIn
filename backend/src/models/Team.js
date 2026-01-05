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

    isActive: {
      type: Boolean,
      default: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz", //This ObjectId refers to a document in the Quiz collection
      required: true,
    },
  },
  { timestamps: true }
);

// team names must be unique per quiz, it also allows teams to join again
teamSchema.index({ quiz: 1, teamName: 1 }, { unique: true, partialFilterExpression: { isActive: true }, });

export default mongoose.model("Team", teamSchema);
