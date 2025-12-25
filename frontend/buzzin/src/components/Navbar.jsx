import React from 'react'
import CreateQuiz from '../pages/CreateQuiz'
import {Link} from "react-router";
import { PlusIcon } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="py-10 text-center">
      <h1 className="text-6xl font-extrabold tracking-tight text-warning">
        BuzzIN
      </h1>
      <p className="mt-2 text-white-content/60 text-m">
        Fast, fun quiz rooms
      </p>
</header>


  )
}

export default Navbar