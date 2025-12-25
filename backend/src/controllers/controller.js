import Team from "../models/Team.js"
export async function getAllTeams (req, res){
    try{
        const teams = await Team.find().sort({createdAt:-1});
        res.status(200).json(teams);
    } catch(error) {
        console.error("Error in getAllTeams controller",error);

        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function createTeam(req, res) {
    try {
        const { teamName, quiz } = req.body;
        const newTeam = new Team({
            teamName,
            quiz,
            score: 0,
            active: true,
        });

        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        console.error("Error in createTeam controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function UpdateTeam (req,res){
    try{
        const {teamName, quiz} = req.body;
        const updatedTeam = await Team.findByIdAndUpdate(req.params.id, {teamName,quiz},{new: true});//id comes from /:id
        if(!updatedTeam) return res.status(404).json({message: "Team not found"});
        res.status(200).json({message: "Team updated successfully"});
    }catch(error){
        console.error("Error in UpdateTeam", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

export async function DeleteTeam (req,res) {
    try{
        const deletedTeam = await Team.findByIdAndDelete(req.params.id);
        if(!deletedTeam) return res.status(404).json({message: "Team not found"});
        res.status(200).json({message: "Team deleted successfully"});
    }catch(error){
        console.log("Error in DeleteTeam Controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function fetchTeam(req,res) {
    try{
        const team=await Team.findById(req.params.id);
        if(!team) return res.status(404).json({message: "Team not found"});
        res.status(200).json(team);
    } catch(error){
        console.log("Error in FetchTeam Controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}