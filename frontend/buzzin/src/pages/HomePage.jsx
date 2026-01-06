import React from 'react'
import {useState} from "react";
import axios from "axios";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";



import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI';
import ChoiceCard1 from '../components/ChoiceCard1';
import ChoiceCard2 from '../components/ChoiceCard2';

const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [teams,setTeams] = useState([]);
    const [loading,setLoading] = useState(true);
    const navigate =useNavigate();

    useEffect(() => {
        const roomCode = localStorage.getItem("hostRoomCode");
        if (roomCode) {
            navigate(`/host/${roomCode}`, { replace: true });
        }
    }, [navigate]);
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950/90 to-slate-800/90 space-y-2 md:space-y-7">
            <Navbar/>   
            
            {isRateLimited && <RateLimitedUI/>}
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch md:justify-center md:gap-24">
                    <ChoiceCard1 />
                    <ChoiceCard2 />
                </div>
            </div>
            
        </div>
    )
}

export default HomePage