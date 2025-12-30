import express from "express";
import { joinTeam ,getLeaderboard} from "../controllers/TeamController.js";

const router = express.Router();
router.post("/join", joinTeam);
router.get("/leaderboard/:roomCode", getLeaderboard);

export default router;
