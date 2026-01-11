import React, { useState, useEffect,useRef } from 'react';
import axios from "axios";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import toast from 'react-hot-toast';

import Navbar2 from '../components/Navbar2';
import RateLimitedUI from '../components/RateLimitedUI';
import InfoBoxUser from '../components/InfoBoxUser';
import Buzzer from '../components/Buzzer';
import AnswerBox from '../components/AnswerBox';
import Leaderboard from '../components/LeaderBoard';

const UserPage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [players, setPlayers] = useState(0);
  const [roundNumber,setRoundNumber] = useState(1);
  const [questionNumber,setQuestionNumber]=useState(1);
  const [roundType,setRoundType]=useState("");

  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [answer,setAnswer] = useState("");
  const [pressed,setPressed] = useState(false);

  const teamName = location.state || localStorage.getItem("teamName");
  useEffect(() => {
  if (!teamName) {
    navigate("/", { replace: true });
  }
}, [teamName, navigate]);

  const [leaderboard, setLeaderboard] = useState([]);
  const socketRef = useRef(null);

  const [buzzerLocked,setBuzzersLocked]= useState(false);
  const [quizEnded, setQuizEnded] = useState(false);




  /////////////////////////////////////////////////////////////////////////////////////////////////
  const handleSubmit = async () => {
    if (pressed || buzzerLocked) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}/update`,
        { answer, teamName}
      );
      setPressed(true);
    } catch (err) {
      console.log(err.response?.data);
      setPressed(false);
      toast.error(err.response?.data?.error || "Answer not sent");
    }
  }



  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL);
    }
    const socket = socketRef.current;

    socket.emit("join-room", {roomCode,teamName});

    socket.on("connect", () => {
      socket.emit("join-room", {roomCode,teamName});
    });

    const onBuzzersLocked = (locked) => {
      setBuzzersLocked(locked);
    };
    socket.on("buzzers-locked", onBuzzersLocked);

    const onPlayersUpdated = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}`
      );
      setPlayers(res.data.playerCount || 0);

      const lb = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/teams/leaderboard/${roomCode}`
      );
      setLeaderboard(lb.data);
    };

    socket.on("players-updated", onPlayersUpdated);
    socket.on("buzzer-cleared", () => {
      setPressed(false);
      setAnswer("");
    })

    socket.on("updated-scores", async () => {
      if(quizEnded){return;}
      const game = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}/game`);

      setRoundNumber(game.data.roundNumber);
      setQuestionNumber(game.data.questionNumber);
      setRoundType(game.data.roundType);

      setPressed(false);
      setAnswer("");

      const buzzerRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}/buzzers`);
      setBuzzersLocked(buzzerRes.data.locked);

      const lb= await axios.get(`${import.meta.env.VITE_API_URL}/api/teams/leaderboard/${roomCode}`);
      setLeaderboard(lb.data);
    });

    socket.on("endof-quiz", async () =>{
      setQuizEnded(true);
      setBuzzersLocked(true);
      setQuestionNumber("ENDED");
      setRoundNumber("ENDED");
      setRoundType("ENDED");
    })

    return () => {
      socket.off("players-updated", onPlayersUpdated);
      socket.off("buzzers-locked", onBuzzersLocked); 
      socket.off("updated-scores");
      socket.off("buzzer-cleared");
      socket.off("endof-quiz");
    };
  }, [roomCode]);






  useEffect(() => {
    async function fetchRoomOnce() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}`);
        setQuizTitle(res.data.quiz?.title || "");
        setPlayers(res.data.playerCount || 0);

        const buzzRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}/buzz-status`,{params: {teamName} });
        setPressed(buzzRes.data.alreadyBuzzed);
        if(buzzRes.data.alreadyAnswered){setAnswer(buzzRes.data.submittedAnswer)};

        const lb = await axios.get(`${import.meta.env.VITE_API_URL}/api/teams/leaderboard/${roomCode}`);
        setLeaderboard(lb.data);

        const game = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}/game`);

        if(game.data.status === "ended"){
          setQuizEnded(true);
          setRoundNumber("ENDED");
          setQuestionNumber("ENDED");
          setRoundType("ENDED");
          setBuzzersLocked(true);
        }
        else{
          setQuizEnded(false);
          setRoundNumber(game.data.roundNumber);
          setQuestionNumber(game.data.questionNumber);
          setRoundType(game.data.roundType);
        }

        const buzzerRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}/buzzers`);
        setBuzzersLocked(buzzerRes.data.locked);
        
      } catch {
        navigate("/", { replace: true });
      }
    }

    fetchRoomOnce();
  }, [roomCode, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950/90 to-slate-800/90 space-y-3">
      <Navbar2 quizEnded={quizEnded}/>
      {isRateLimited && <RateLimitedUI />}
      <InfoBoxUser
        quizTitle={quizTitle}
        teamName={teamName}
        players={players}
        roomCode={roomCode}
        roundNumber={roundNumber}
        questionNumber={questionNumber}
        roundType={roundType}
        quizEnded={quizEnded}
      />

      {quizEnded && (
        <div className="mx-6 my-6 rounded-xl bg-gradient-bl from-slate-900 to-slate-600 p-6 text-center">
          <h1 className="text-4xl font-bold text-green-400 text-center">
            End of {quizTitle}
          </h1>

          <p className="text-slate-300 mt-2 mb-4 text-2xl">
            Here are the final standings
          </p>
          <Leaderboard teams={leaderboard} />
          <button className='btn btn-secondary rounded-xl text-xl mt-12' onClick={() =>{navigate("/")}}>🏠︎ Continue to Home</button>
        </div>
      )}
      {!quizEnded && <AnswerBox setAnswer={setAnswer} answer={answer} pressed={pressed || buzzerLocked}/>}

      <div className="flex flex-col md:flex-row justify-between items-start px-4 md:px-20 pt-2 gap-6">
        <div className="md:w-1/2 w-full">
          {!quizEnded && <Buzzer onBuzz={handleSubmit} pressed={pressed} buzzerLocked={buzzerLocked}/>}
        </div>
        <div className="md:w-1/2 w-full">
          {!quizEnded && <Leaderboard teams={leaderboard} />}
        </div>
        
      </div>
      
    </div>
  );
};

export default UserPage;
