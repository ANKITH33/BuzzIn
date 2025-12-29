import React from 'react'
import {useState} from "react";
import { useLocation, useParams } from "react-router-dom";

import Navbar2 from '../components/Navbar2';
import RateLimitedUI from '../components/RateLimitedUI';
import InfoBoxCreate from '../components/InfoBoxCreate';
import QuizRounds from '../components/QuizRounds';
import RoundDescription from '../components/RoundDescription';

const CreateQuiz = () => {
  const {roomCode} = useParams();
  const [isRateLimited, setIsRateLimited] = useState(false);

  const location = useLocation();
  const quizTitle = location.state?.quizTitle;
  return (
    <div className="h-screen overflow-y-auto  bg-gradient-to-b from-slate-950 to-slate-800 space-y-3">
      <Navbar2 />
      
      {isRateLimited && <RateLimitedUI/>}
      <InfoBoxCreate quizTitle={quizTitle} roomCode={roomCode}/>

      <QuizRounds/>
        
    </div>
  )
}

export default CreateQuiz