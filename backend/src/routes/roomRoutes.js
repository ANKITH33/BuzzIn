import express from "express"
import { CreateRoom , getCurrentGameInfo, getRoomByCode, getBuzzerState, toggleBuzzers} from "../controllers/RoomController.js"; 
import { updateResponses, getMyBuzzerStatus, getBuzzerBoard, clearBuzzers} from "../controllers/RoomController.js"; 

const router = express.Router();

router.post("/", CreateRoom);
router.get("/:roomCode", getRoomByCode);
router.get("/:roomCode/game",getCurrentGameInfo);
router.get("/:roomCode/buzzers", getBuzzerState);
router.post("/:roomCode/buzzers", toggleBuzzers);
router.post("/:roomCode/update",updateResponses);
router.get("/:roomCode/buzz-status", getMyBuzzerStatus);
router.get("/:roomCode/buzzerboard", getBuzzerBoard);
router.post("/:roomCode/clearbuzzerboard", clearBuzzers);

export default router;