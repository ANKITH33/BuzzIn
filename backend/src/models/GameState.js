import mongoose from "mongoose";

const gameStateSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      unique: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    currentRoundIndex: {
      type: Number,
      default: 1, 
    },

    currentQuestionIndex: {
      type: Number,
      default: 1, 
    },

    status: {
      type: String,
      enum: ["waiting", "active", "ended"],
      default: "waiting",
    },


    buzzedTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      }
    ],

    submittedAnswers: [
      {
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
          required: true,
        },
        answerText: {
          type: String,
          required: true,
        },
        evaluated: {
          type: Boolean,
          default: false,
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("GameState",gameStateSchema);