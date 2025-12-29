import express from "express"
import { CreateRoom } from "../controllers/RoomController.js"; 

const router = express.Router();

router.post("/", CreateRoom);

export default router;