import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Navbar2 from '../components/Navbar2';
import RateLimitedUI from '../components/RateLimitedUI';
import InfoBoxHost from '../components/InfoBoxHost';
import QuizRounds from '../components/QuizRounds';
import RoundDescription from '../components/RoundDescription';

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

  useEffect(() => {
    let intervalId;

    async function fetchRoom() {
      try {
        const res = await axios.get(`http://localhost:5001/api/rooms/${roomCode}`);
        setRoom(res.data);
        setLoading(false);
        if (res.data.quiz) {//checks if quiz has appeared
          clearInterval(intervalId);//handler, stops if data comes
        }
      } catch {
        navigate("/", { replace: true });
      }
    }

    fetchRoom();              
    intervalId = setInterval(fetchRoom, 500); // poll until quiz exists for every 500 ms

    return () => clearInterval(intervalId);//clear the handler
  }, [roomCode, navigate]);//runs when website mounts or roomcode changes


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
    <div className="h-screen overflow-y-auto  bg-gradient-to-b from-slate-950 to-slate-800 space-y-3">
        <Navbar2 />
    
        {isRateLimited && <RateLimitedUI/>}
        <InfoBoxHost 
          quizTitle={room.quiz.title} 
          roomCode={roomCode}
          roundNumber={roundNumber}
          roundType={roundType}
          questionNumber={questionNumber}
          players={players}
          onNextQuestion={handleNextQuestion}/>
    </div>
  );
};

export default HostPage;
