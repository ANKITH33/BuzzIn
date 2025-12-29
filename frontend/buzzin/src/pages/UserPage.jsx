import React from 'react'
import {useState} from "react";
import axios from "axios";
import { useEffect } from 'react';

import Navbar2 from '../components/Navbar2';
import RateLimitedUI from '../components/RateLimitedUI';
import InfoBoxUser from '../components/InfoBoxUser';
import Buzzer from '../components/Buzzer';

const UserPage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  return (
    <div className="min-h-screen bg-slate-900 space-y-3">
      <Navbar2/>
      
      {isRateLimited && <RateLimitedUI/>}

      <InfoBoxUser/>
      <Buzzer/>
        
    </div>
  )
}

export default UserPage