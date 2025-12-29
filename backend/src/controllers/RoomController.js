import Room from '../models/Room.js'

export async function CreateRoom (req,res) {
    let room=null;
    let attempts=0;
    try {
        while (!room && attempts < 5) {
            try {
                const code = Math.random().toString(36).substring(2, 7).toUpperCase();
                room = await Room.create({ code });
            } catch (err) {
                if (err.code === 11000) {
                    attempts++;
                    continue;
                }
                throw err;
            }
        }

        if (!room) {
            return res.status(500).json({
                message: "Failed to generate unique room code",
            });
        }

        return res.status(201).json(room);
    } catch (error) {
        console.error("Error in createRoom controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getRoomByCode(req, res) {
  const { roomCode } = req.params;

  const room = await Room.findOne({ code: roomCode })
    .populate("quiz","title")
    .select("code status quiz");//selects fields from json

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  return res.json(room);
}