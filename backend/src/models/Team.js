import mongoose from "mongoose";

//1-create a schema
//2- model based off of that schema

const teamSchema = new mongoose.Schema(
    {
        teamName: {
            type: String,
            required: true, 
        },
        score: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            required:true,
            default: false,
        },
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        }
    },
    { timestamps: true} //createdAt, UpdatedAt
)

const team = mongoose.model("Team", teamSchema);

export default team;