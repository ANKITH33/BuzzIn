import express from "express";
import { joinTeam ,getLeaderboard,rejoinTeam} from "../controllers/TeamController.js";

const router = express.Router();
router.post("/join", joinTeam);
router.post("/rejoin", rejoinTeam);
router.get("/leaderboard/:roomCode", getLeaderboard);

export default router;
