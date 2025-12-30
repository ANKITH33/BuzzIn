import express from "express"
import { CreateRoom , getCurrentGameInfo, getRoomByCode, getBuzzerState, toggleBuzzers} from "../controllers/RoomController.js"; 

const router = express.Router();

router.post("/", CreateRoom);
router.get("/:roomCode", getRoomByCode);
router.get("/:roomCode/game",getCurrentGameInfo);
router.get("/:roomCode/buzzers", getBuzzerState);
router.post("/:roomCode/buzzers", toggleBuzzers);

export default router;