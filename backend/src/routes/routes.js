import express from "express"
import { getAllTeams, createTeam, UpdateTeam, DeleteTeam, fetchTeam} from "../controllers/controller.js"; 

const router = express.Router();



router.get("/", getAllTeams);
router.get("/:id",fetchTeam);
router.post("/", createTeam);
router.put("/:id", UpdateTeam);//we need to add id in the url to identify which data to update
router.delete("/:id", DeleteTeam);//we need to add id in the url to identify which data to delete

export default router;