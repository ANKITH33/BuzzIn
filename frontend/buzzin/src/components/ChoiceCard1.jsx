import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { motion } from "framer-motion";

const ChoiceCard1 = () => {
    const [roomCode,setRoomCode]=useState("");
    const [teamName,setteamName]=useState("");
    const [rejoin,setRejoin] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!teamName) {
            toast.error("Enter team name");
            return;
        }

        if (!roomCode) {
            toast.error("Enter room code");
            return;
        }

        try {
            if(rejoin){
                await axios.post(`${import.meta.env.VITE_API_URL}/api/teams/rejoin`,{roomCode,teamName});
            }
            else{
                await axios.post(`${import.meta.env.VITE_API_URL}/api/teams/join`,{roomCode,teamName});
            }
            
            navigate(`/join/${roomCode}`,{ state: teamName, replace: true });
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.error;

            if(rejoin){
                if(status===404){
                    toast.error(message || "No inactive team found to rejoin");
                }
                else if(status===409){
                    toast.error(message || "Team is already active in the room");
                }
                else{
                    toast.error("Failed to rejoin room");
                }
            }
            else{
                if(status === 409){
                    toast.error(message || "Team name already taken");
                }
                else if(status==404){
                    toast.error(message || "Invalid Room");
                }
                else{
                    toast.error("Failed to join room");
                }
            }
        }
    };

  return (

    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }} 
        className="
    bg-gradient-to-b from-slate-950/50 to-slate-800 backdrop-blur-md
    border border-cyan-400/60
    shadow-[0_0_25px_rgba(34,211,238,0.35)]
    rounded-2xl p-8
    w-full max-w-[420px] h-full flex flex-col
  ">
        <div className='space-y-5'>
            {/* Header Section */}
            <div className="space-y-2">
                <p className="italic text-white text-xl opacity-80">Player?</p>
                <h2 className="text-white text-3xl font-inter">Join Room</h2>
            </div>

            {/* Description */}
            <div className="">
                <p className="text-neutral-200 opacity-100">
                    Looking to join a room?
                </p>
                <p className="text-neutral-200 opacity-100">
                    Paste the code and get ready to buzz in!
                </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <input 
                type="text" 
                className="input input-bordered w-full bg-white text-neutral-700" 
                placeholder="Paste Room Code!"
                onChange={(e) => setRoomCode(e.target.value)}
                />
                <input 
                type="text" 
                className="input input-bordered w-full bg-white text-neutral-700" 
                placeholder="Display Name"
                onChange={(e) => setteamName(e.target.value)}
                />
                <label className="flex items-center gap-2 cursor-pointer text-sm pl-2 text-white">
                    <input type="checkbox" className="toggle toggle-info outline-collapse" onChange={(e)=> setRejoin(e.target.checked)}/>
                    Rejoining??
                </label>
 
            </div>

            {/* Action */}
            <motion.button whileTap={{ scale: 0.95 }} className="btn btn-wide bg-sky-500 hover:bg-sky-400 text-slate-900 mt-6" onClick={handleSubmit}>
            Let's Buzz!!
            </motion.button>


        </div>
    </motion.div>

  )
}

export default ChoiceCard1