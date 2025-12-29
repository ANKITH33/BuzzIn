import Room from '../models/Room.js'

export async function CreateRoom (req,res) {
    try {
        const code = Math.random().toString(36).substring(2, 7).toUpperCase();
        const room = await Room.create({ code });

        res.status(201).json(room);
    } catch (error) {
        console.error("Error in createQuiz controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}