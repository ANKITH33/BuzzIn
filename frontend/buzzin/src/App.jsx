import React from 'react'
import {Route, Routes} from "react-router-dom";
import HomePage from './pages/HomePage';
import CreateQuiz from './pages/CreateQuiz';
import UserPage from './pages/UserPage';
import toast from "react-hot-toast";

const App = () => {
  return (
    <div data-theme="forest">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/create/:roomCode" element={<CreateQuiz/>}/>
        <Route path="/join" element={<UserPage/>}/>

      </Routes>
    </div>
  )
}

export default App