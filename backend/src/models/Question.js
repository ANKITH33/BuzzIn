import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },

  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Round",
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  order: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Question", questionSchema);
