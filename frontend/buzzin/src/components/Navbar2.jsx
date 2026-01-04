import React from 'react'
import CreateQuiz from '../pages/CreateQuiz'
import {Link} from "react-router";
import { PlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const Navbar2 = ({quizEnded}) => {
  const navigate=useNavigate();
  return (
    <header className="py-3 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-warning" onClick={() =>{if(quizEnded){navigate("/")}}}>
        BuzzIN
      </h1>
    </header>

  )
}

export default Navbar2