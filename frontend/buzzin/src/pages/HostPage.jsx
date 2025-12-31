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
  const socketRef = useRef(null);//Holds one persistent socket instance that survives re-renders

  const [responses,setResponses]=useState([]);
  const [buzzedTeams, setBuzzedTeams]= useState([]);

  const [buzzerLocked, setBuzzerLocked] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {//Creates the socket only the first time, doesnt create when roomCode changes
      socketRef.current = io("http://localhost:5001"); //Opens a socket connection to backend,Triggers backend io.on("connection"),Creates a socket object on backend
    }
    const socket = socketRef.current;//use existing socket

    socket.emit("join-room", roomCode);

    socket.on("connect", () => {
      socket.emit("join-room", roomCode);
    });//incase socket connection is lost and it retries (Socket.io detects this and enters reconnect mode)
    //When a socket disconnects (including laptop sleep), it is removed from the room on the backend.

    socket.on("buzzers-locked", (locked) => {
      setBuzzerLocked(locked);
    });//listens for emit, which comes from backend


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

    socket.on("players-updated", onPlayersUpdated);//listens for emit from backend

    const onResponseUpdated = async () => {
      const responsesData =  await axios.get(`http://localhost:5001/api/rooms/${roomCode}/buzzerboard`);
      setResponses(responsesData.data.submittedAnswers);
      setBuzzedTeams(responsesData.data.buzzedTeams);
    }

    socket.on("response-updated", onResponseUpdated);
    

    return () => {
      socket.off("players-updated", onPlayersUpdated);
      socket.off("buzzers-locked");
      socket.off("responses-updated");
    };
  }, [roomCode]);//runs on mount and if roomCode changes

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

        const responsesData =  await axios.get(`http://localhost:5001/api/rooms/${roomCode}/buzzerboard`);
        setResponses(responsesData.data.submittedAnswers);
        setBuzzedTeams(responsesData.data.buzzedTeams);

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

  const handleClearAll = async () => {
    const clearAll = await axios.post(`http://localhost:5001/api/rooms/${roomCode}/clearbuzzerboard`);
    setResponses(clearAll.data.submittedAnswers);
    setBuzzedTeams(clearAll.data.buzzedTeams);

  }

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
              <BuzzerBoard responses={responses} handleClearAll={handleClearAll}/>
            </div>
          </div>
    </div>
  );
};

export default HostPage;
