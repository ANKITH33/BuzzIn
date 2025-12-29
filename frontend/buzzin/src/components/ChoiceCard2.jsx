import React from 'react'
import {Link} from 'react-router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ChoiceCard2 = () => {
    const [quizTitle,setQuizTitle]=useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log("HANDLE SUBMIT CALLED");

        if (!quizTitle) {
            toast.error("Quiz title is required");
            return;
        }

        try {
            const { data } = await axios.post(
            "http://localhost:5001/api/rooms",
            { quizTitle }
            );

            console.log("ROOM CREATED:", data);

            navigate(`/create/${data.code}`, {
            state: { quizTitle },
            });
        } catch (err) {
            console.error("AXIOS ERROR:", err);
            toast.error("Failed to create room");
        }
    };



  return (
    <div className="bg-blue-900 p-8 rounded-2xl w-[420px] space-y-5">
        {/* Header Section */}
        <div className="space-y-2">
            <p className="italic text-white text-xl opacity-80">Host?</p>
            <h2 className="text-white text-3xl font-inter">Create Room</h2>
        </div>

        {/* Description */}
        <div className="">
            <p className="text-neutral-200 opacity-100">
                Host a quiz, free of cost!
            </p>
            <p className="text-neutral-200 opacity-100">
                Get a shareable link to invite more players.
            </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
            <input type="text" 
            className="input input-bordered w-full bg-white text-neutral-700" 
            placeholder="Enter Room Name"
            onChange={(e) => setQuizTitle(e.target.value)}/>
        </div>

        {/* Action */}
        <button type="button" className="btn btn-wide btn-info" onClick={handleSubmit}>
            Let's Go!!
        </button>

    </div>
  )
}

export default ChoiceCard2