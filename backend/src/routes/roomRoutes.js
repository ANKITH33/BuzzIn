import express from "express"
import { CreateRoom , getRoomByCode} from "../controllers/RoomController.js"; 

const router = express.Router();

router.post("/", CreateRoom);
router.get("/:roomCode", getRoomByCode);

export default router;