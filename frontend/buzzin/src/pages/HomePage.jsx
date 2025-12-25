import React from 'react'
import {useState} from "react";
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI';
import axios from "axios";
import { useEffect } from 'react';
import ChoiceCard from '../components/ChoiceCard1';
import ChoiceCard2 from '../components/ChoiceCard2';

const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [teams,setTeams] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() =>{
        const fetchTeams= async() =>{
            try{
                const res = await axios.get("http://localhost:5001/");
                console.log(res.data);
            } catch (error){
                console.log("Error fetching teams");
            }
        };

        fetchTeams();
    },[]);
    return (
        <div className="min-h-screen bg-slate-900 space-y-8">
            <Navbar/>
            
            {isRateLimited && <RateLimitedUI/>}
            <div className="flex items-center justify-center">
                <div className="flex gap-24 flex-wrap">
                    <ChoiceCard />
                    <ChoiceCard2 />
                </div>
            </div>
            
        </div>
    )
}

export default HomePage