import React, { useEffect, useState,useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

import Navbar2 from '../components/Navbar2';
import RateLimitedUI from '../components/RateLimitedUI';
import InfoBoxHost from '../components/InfoBoxHost';
import Leaderboard from "../components/Leaderboard";
import BuzzerBoard from "../components/BuzzerBoard";

const HostPage = () => {
  const { roomCode } = useParams(); // :roomcode is taken as parameter form url
  const navigate = useNavigate();

  const [isRateLimited, setIsRateLimited] = useState(false);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const[roundNumber,setRoundNumber]=useState(1);
  const[questionNumber,setQuestionNumber]=useState(1);
  const[players,setPlayers]=useState(0);
  const[roundType,setRoundType]=useState("");

  const [leaderboard, setLeaderboard] = useState([]);
  const socketRef = useRef(null);

  const [buzzerLocked, setBuzzerLocked] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5001");
    }
    const socket = socketRef.current;

    socket.emit("join-room", roomCode);

    socket.on("connect", () => {
      socket.emit("join-room", roomCode);
    });

    socket.on("buzzers-locked", (locked) => {
      setBuzzerLocked(locked);
    });


    const onPlayersUpdated = async () => {
      const res = await axios.get(
        `http://localhost:5001/api/rooms/${roomCode}`
      );
      setPlayers(res.data.playerCount || 0);

      const lb = await axios.get(
        `http://localhost:5001/api/teams/leaderboard/${roomCode}`
      );
      setLeaderboard(lb.data);
    };

    socket.on("players-updated", onPlayersUpdated);
    

    return () => {
      socket.off("players-updated", onPlayersUpdated);
      socket.off("buzzers-locked");
      
    };
  }, [roomCode]);

  useEffect(() => {
    async function fetchRoomOnce() {
      try {
        const res = await axios.get(`http://localhost:5001/api/rooms/${roomCode}`);
        setRoom(res.data);
        setPlayers(res.data.playerCount || 0);

        const lb = await axios.get(`http://localhost:5001/api/teams/leaderboard/${roomCode}`);
        setLeaderboard(lb.data);
        
        const game = await axios.get(`http://localhost:5001/api/rooms/${roomCode}/game`);

        setRoundNumber(game.data.roundNumber);
        setQuestionNumber(game.data.questionNumber);
        setRoundType(game.data.roundType);

        const buzzerRes = await axios.get(`http://localhost:5001/api/rooms/${roomCode}/buzzers`);
        setBuzzerLocked(buzzerRes.data.locked);

        setLoading(false);

      } catch {
        navigate("/", { replace: true });
      }
    }

    fetchRoomOnce();
  }, [roomCode, navigate]);



  if (loading) {
    return <div className="h-screen overflow-y-auto  bg-gradient-to-b from-slate-950 to-slate-800 p-6 text-white">Loading host page…</div>;
  }

  if (!room.quiz) {
    return (
      <div className="h-screen overflow-y-auto  bg-gradient-to-b from-slate-950 to-slate-800 p-6 text-white">
        Waiting for quiz to be created…
      </div>
    );
  }

  const handleNextQuestion = () => {
    setQuestionNumber(q => q + 1);
  };

  return (
    <div className="h-screen overflow-y-auto  bg-gradient-to-b from-slate-950 to-slate-700 space-y-3">
        <Navbar2 />
    
        {isRateLimited && <RateLimitedUI/>}
        <InfoBoxHost 
          quizTitle={room.quiz.title} 
          roomCode={roomCode}
          roundNumber={roundNumber}
          roundType={roundType}
          questionNumber={questionNumber}
          players={players}
          onNextQuestion={handleNextQuestion}
          buzzerLocked={buzzerLocked}
          setBuzzerLocked={setBuzzerLocked}
          />

          <div className="flex flex-col md:flex-row justify-between items-start px-20 pt-2 gap-6">
            <div className="md:w-1/2">
              <Leaderboard teams={leaderboard}/>
            </div>
            <div className="md:w-1/2">
              <BuzzerBoard />
            </div>
          </div>
    </div>
  );
};

export default HostPage;
