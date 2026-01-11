import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      default: null,
    },
    status: {
      type: String,
      enum: ["waiting", "active", "ended"],
      default: "waiting",
    },
  },
  { timestamps: true }
);
roomSchema.index({ code: 1 });
export default mongoose.model("Room", roomSchema);
