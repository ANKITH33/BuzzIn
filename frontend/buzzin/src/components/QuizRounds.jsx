import React, { useState, useEffect} from "react";
import RoundDescription from "./RoundDescription";
import toast from 'react-hot-toast';
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";

const QuizRounds = ({roomCode, quizTitle}) => {
  const [rounds, setRounds] = useState("0");
  const [roundValidity, setRoundValidity] = useState({});
  const [openRound, setOpenRound] = useState(null);
  const [roundConfigs, setRoundConfigs] = useState ({}); // string state

  const handleChange = (e) => {
    if (/^\d*$/.test(e.target.value)) {
      setRounds(e.target.value);
    }
    else{
        toast.error("Invalid format");
    }
  };

  const hasInvalidRound = Object.values(roundValidity).some(v => v === false);

  const navigate= useNavigate();

  const roundsNumber = rounds === "" ? 0 : Number(rounds);

    useEffect(() => {
        setRoundValidity(prev => {
            const next = {};
            for (let i = 1; i <= roundsNumber; i++) {
                if (prev[i] !== undefined) { //when roundsIncrease prev[i] may not be defined
                    next[i] = prev[i];
                }
            }
            return next;
        });
    }, [roundsNumber]);

    const createQuiz = async () => {
        console.log("Create Quiz called");

        try{
            const payload={
                title: quizTitle,
                roomCode, //as both names are same
                rounds: Object.values(roundConfigs)
            }

            await axios.post("http://localhost:5001/api/quizzes",payload);
            console.log("Quiz created");
            navigate(`/host/${roomCode}`,{ replace: true });

        } catch(error){
            console.log("Axios error: ",error);
            toast.error("Failed to create quiz (backend)");
        }

    }
    useEffect(() => {
        async function checkRoom() {
            try {
                const res = await axios.get(`/api/rooms/${roomCode}`);

                if (res.data.quiz) {
                    localStorage.setItem("hostRoomCode", roomCode);
                    navigate(`/host/${roomCode}`, { replace: true });
                }
            } catch (err) {
                console.error("Room check failed", err);
            }
        }

        checkRoom();
    }, [roomCode, navigate]);

    
  return (
    <>
    <div className="bg-gradient-to-b from-green-600 to-slate-800 backdrop-blur-md  m-6 rounded-xl shadwo-sm p-5">
        <div className="flex flex-row md:flex-row text-sm md:text-lg gap-12 md:gap-8">

            <div className="flex flex-col">
                <div className="flex items-center gap-3">
                    <button
                    className="btn btn-sm bg-green-950 border-emerald-950"
                    onClick={() =>
                        setRounds((r) => String(Math.max(1, Number(r || 1) - 1)))
                    }
                    >−</button>

                    <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={rounds}
                    onChange={handleChange}
                    className="input input-bordered w-24 bg-white text-slate-800 text-center "
                    />


                    <button
                    className="btn btn-sm bg-green-950 border-emerald-950"
                    onClick={() =>
                        setRounds((r) => String(Math.min(20, Number(r || 1) + 1)))
                    }
                    >+</button>

                </div>

                <p className="text-sm opacity-80 mt-2 ml-1 text-slate-200">
                    Number of Rounds:{" "}
                    <span className="font-bold text-white">{roundsNumber}</span>
                </p>
            </div>

            <div>
                <button className="btn btn-warning font-semibold px-8" disabled={roundsNumber === 0 || hasInvalidRound } onClick={createQuiz} >
                    Create
                </button>
            </div>

        </div>
    </div>

    {Array.from({ length: roundsNumber }, (_, i) => (
        <RoundDescription
            key={i}
            roundIndex={i + 1}
            openRound={openRound}
            setOpenRound={setOpenRound}
            setRoundValidity={setRoundValidity}
            setRoundConfigs={setRoundConfigs}
        />
    ))}
    </>
  );
};

export default QuizRounds;
