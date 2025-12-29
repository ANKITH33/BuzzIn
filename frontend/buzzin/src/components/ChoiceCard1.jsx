import React from 'react'
import {Link} from 'react-router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ChoiceCard = () => {
    const [roomCode,setRoomCode]=useState("");
    const [teamName,setteamName]=useState("");

    const navigate = useNavigate();

    const handleSubmit = () =>{
        if(!teamName){
            toast.error("Enter Team Name");
            return;
        }
        else if(!roomCode){
            toast.error("Invalid Room Code");
            return;
        }
        navigate("/join");
    }
  return (

    <div className="bg-blue-900 p-8 rounded-2xl w-[420px]">
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
            </div>

            {/* Action */}
            <button className="btn btn-wide btn-info" onClick={handleSubmit}>
            Let's Buzz!!
            </button>


        </div>
    </div>

  )
}

export default ChoiceCard