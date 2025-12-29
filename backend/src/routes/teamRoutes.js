import express from "express";
import { joinTeam } from "../controllers/TeamController.js";

const router = express.Router();
router.post("/join", joinTeam);

export default router;
