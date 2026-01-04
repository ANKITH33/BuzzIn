import {useState,useEffect} from "react";

const HitHoldConfig=({onValidityChange,onConfigChange})=>{
  const[hitCorrect,setHitCorrect]=useState("");
  const[hitCorrectError,setHitCorrectError]=useState("");

  const[hitIncorrect,setHitIncorrect]=useState("");
  const[hitIncorrectError,setHitIncorrectError]=useState("");

  const[holdCorrect,setHoldCorrect]=useState("");
  const[holdCorrectError,setHoldCorrectError]=useState("");

  const[holdIncorrect,setHoldIncorrect]=useState("");
  const[holdIncorrectError,setHoldIncorrectError]=useState("");

  const[question,setQuestion]=useState("");
  const[questionError,setQuestionError]=useState("");

  const valid= hitCorrect!=="" && hitIncorrect!=="" && holdCorrect!=="" && holdIncorrect!==""&& question!==""
              && !hitCorrectError && !hitIncorrectError && !holdCorrectError && !holdIncorrectError && !questionError;

  const handlePCorrectChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setHitCorrect("");
      setHitCorrectError("");
      return;
    }
    if(!/^-?\d*$/.test(v)){
      return;
    }
    setHitCorrect(v);
  };

  const handlePCorrectBlur=()=>{
    if(hitCorrect===""){
      setHitCorrectError("Required");
      return;
    }
    const n=Number(hitCorrect);
    if(Number.isNaN(n)||n<0){
      setHitCorrectError("Must be non-negative");
      return;
    }
    setHitCorrectError("");
  };

  const handlePWrongChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setHitIncorrect("");
      setHitIncorrectError("");
      return;
    }
    if(!/^-?\d*$/.test(v)){
      return;
    }
    setHitIncorrect(v);
  };

  const handlePWrongBlur=()=>{
    if(hitIncorrect===""){
      setHitIncorrectError("Required");
      return;
    }
    const n=Number(hitIncorrect);
    if(Number.isNaN(n)||n>0){
      setHitIncorrectError("Must be negative");
      return;
    }
    setHitIncorrectError("");
  };

  const handleBCorrectChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setHoldCorrect("");
      setHoldCorrectError("");
      return;
    }
    if(!/^-?\d*$/.test(v)){
      return;
    }
    setHoldCorrect(v);
  };

  const handleBCorrectBlur=()=>{
    if(holdCorrect===""){
      setHoldCorrectError("Required");
      return;
    }
    const n=Number(holdCorrect);
    if(Number.isNaN(n)||n<0){
      setHoldCorrectError("Must be non negative");
      return;
    }
    setHoldCorrectError("");
  };

  const handleBWrongChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setHoldIncorrect("");
      setHoldIncorrectError("");
      return;
    }
    if(!/^-?\d*$/.test(v)){
      return;
    }
    setHoldIncorrect(v);
  };

  const handleBWrongBlur=()=>{
    if(holdIncorrect===""){
      setHoldIncorrectError("Required");
      return;
    }
    const n=Number(holdIncorrect);
    if(Number.isNaN(n)||n>0){
      setHoldIncorrectError("Must be negative");
      return;
    }
    setHoldIncorrectError("");
  };

  const handleQuestionChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setQuestion("");
      setQuestionError("");
      return;
    }
    if(!/^\d*$/.test(v)){
      return;
    }
    setQuestion(v);
  };

  const handleQuestionBlur=()=>{
    if(question===""){
      setQuestionError("Required");
      return;
    }
    const n=Number(question);
    if(Number.isNaN(n)||n<1){
      setQuestionError("Must be atleast 1");
      return;
    }
    setQuestionError("");
  };

  useEffect(()=>{
    onValidityChange(valid)
  },[valid,onValidityChange]);

  useEffect(()=>{
    if(!valid){
      return;
    }
    onConfigChange({
      questionsCount:Number(question),
      scoring:{
        riskCorrect:Number(hitCorrect),
        riskWrong:Number(hitIncorrect),
        safeCorrect:Number(holdCorrect),
        safeWrong:Number(holdIncorrect)
      }
    });
  },[valid,hitCorrect,hitIncorrect,holdCorrect,holdIncorrect,question,onConfigChange]);

  return(
    <div className="flex flex-col md:flex-row gap-4 mt-3 mb-2">
      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Hit correct" value={hitCorrect} onChange={handlePCorrectChange} onBlur={handlePCorrectBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${hitCorrectError?"border-red-600 border-2":""}`}/>
        {hitCorrectError&&<p className="text-red-600 text-sm ml-2">{hitCorrectError}</p>}
      </div>

      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Hit wrong" value={hitIncorrect} onChange={handlePWrongChange} onBlur={handlePWrongBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${hitIncorrectError?"border-red-600 border-2":""}`}/>
        {hitIncorrectError&&<p className="text-red-600 text-sm ml-2">{hitIncorrectError}</p>}
      </div>

      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Bounce correct" value={holdCorrect} onChange={handleBCorrectChange} onBlur={handleBCorrectBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${holdCorrectError?"border-red-600 border-2":""}`}/>
        {holdCorrectError&&<p className="text-red-600 text-sm ml-2">{holdCorrectError}</p>}
      </div>

      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Bounce wrong" value={holdIncorrect} onChange={handleBWrongChange} onBlur={handleBWrongBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${holdIncorrectError?"border-red-600 border-2":""}`}/>
        {holdIncorrectError&&<p className="text-red-600 text-sm ml-2">{holdIncorrectError}</p>}
      </div>

      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Number of questions" value={question} onChange={handleQuestionChange} onBlur={handleQuestionBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${questionError?"border-red-600 border-2":""}`}/>
        {questionError&&<p className="text-red-600 text-sm ml-2">{questionError}</p>}
      </div>
    </div>
  );
};

export default HitHoldConfig;
