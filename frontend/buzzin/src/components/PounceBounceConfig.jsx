import {useState,useEffect} from "react";

const PounceBounceConfig=({onValidityChange,onConfigChange})=>{
  const[pounceCorrect,setPounceCorrect]=useState("");
  const[pounceCorrectError,setPounceCorrectError]=useState("");

  const[pounceIncorrect,setPounceIncorrect]=useState("");
  const[pounceIncorrectError,setPounceIncorrectError]=useState("");

  const[bounceCorrect,setBounceCorrect]=useState("");
  const[bounceCorrectError,setBounceCorrectError]=useState("");

  const[bounceIncorrect,setBounceIncorrect]=useState("");
  const[bounceIncorrectError,setBounceIncorrectError]=useState("");

  const[question,setQuestion]=useState("");
  const[questionError,setQuestionError]=useState("");

  const valid= pounceCorrect!=="" && pounceIncorrect!=="" && bounceCorrect!=="" && bounceIncorrect!==""&& question!==""
              && !pounceCorrectError && !pounceIncorrectError && !bounceCorrectError && !bounceIncorrectError && !questionError;

  const handlePCorrectChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setPounceCorrect("");
      setPounceCorrectError("");
      return;
    }
    if(!/^-?\d*$/.test(v)){
      return;
    }
    setPounceCorrect(v);
  };

  const handlePCorrectBlur=()=>{
    if(pounceCorrect===""){
      setPounceCorrectError("Required");
      return;
    }
    const n=Number(pounceCorrect);
    if(Number.isNaN(n)||n<0){
      setPounceCorrectError("Must be non-negative");
      return;
    }
    setPounceCorrectError("");
  };

  const handlePWrongChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setPounceIncorrect("");
      setPounceIncorrectError("");
      return;
    }
    if(!/^-?\d*$/.test(v)){
      return;
    }
    setPounceIncorrect(v);
  };

  const handlePWrongBlur=()=>{
    if(pounceIncorrect===""){
      setPounceIncorrectError("Required");
      return;
    }
    const n=Number(pounceIncorrect);
    if(Number.isNaN(n)||n>0){
      setPounceIncorrectError("Must be negative");
      return;
    }
    setPounceIncorrectError("");
  };

  const handleBCorrectChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setBounceCorrect("");
      setBounceCorrectError("");
      return;
    }
    if(!/^-?\d*$/.test(v)){
      return;
    }
    setBounceCorrect(v);
  };

  const handleBCorrectBlur=()=>{
    if(bounceCorrect===""){
      setBounceCorrectError("Required");
      return;
    }
    const n=Number(bounceCorrect);
    if(Number.isNaN(n)||n<0){
      setBounceCorrectError("Must be non negative");
      return;
    }
    setBounceCorrectError("");
  };

  const handleBWrongChange=(e)=>{
    const v=e.target.value;
    if(v===""){
      setBounceIncorrect("");
      setBounceIncorrectError("");
      return;
    }
    if(!/^-?\d*$/.test(v)){
      return;
    }
    setBounceIncorrect(v);
  };

  const handleBWrongBlur=()=>{
    if(bounceIncorrect===""){
      setBounceIncorrectError("Required");
      return;
    }
    const n=Number(bounceIncorrect);
    if(Number.isNaN(n)||n>0){
      setBounceIncorrectError("Must be negative");
      return;
    }
    setBounceIncorrectError("");
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
        riskCorrect:Number(pounceCorrect),
        riskWrong:Number(pounceIncorrect),
        safeCorrect:Number(bounceCorrect),
        safeWrong:Number(bounceIncorrect)
      }
    });
  },[valid,pounceCorrect,pounceIncorrect,bounceCorrect,bounceIncorrect,question,onConfigChange]);

  return(
    <div className="flex flex-col md:flex-row gap-4 mt-3 mb-2">
      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Pounce correct" value={pounceCorrect} onChange={handlePCorrectChange} onBlur={handlePCorrectBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${pounceCorrectError?"border-red-600 border-2":""}`}/>
        {pounceCorrectError&&<p className="text-red-600 text-sm ml-2">{pounceCorrectError}</p>}
      </div>

      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Pounce wrong" value={pounceIncorrect} onChange={handlePWrongChange} onBlur={handlePWrongBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${pounceIncorrectError?"border-red-600 border-2":""}`}/>
        {pounceIncorrectError&&<p className="text-red-600 text-sm ml-2">{pounceIncorrectError}</p>}
      </div>

      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Bounce correct" value={bounceCorrect} onChange={handleBCorrectChange} onBlur={handleBCorrectBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${bounceCorrectError?"border-red-600 border-2":""}`}/>
        {bounceCorrectError&&<p className="text-red-600 text-sm ml-2">{bounceCorrectError}</p>}
      </div>

      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Bounce wrong" value={bounceIncorrect} onChange={handleBWrongChange} onBlur={handleBWrongBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${bounceIncorrectError?"border-red-600 border-2":""}`}/>
        {bounceIncorrectError&&<p className="text-red-600 text-sm ml-2">{bounceIncorrectError}</p>}
      </div>

      <div className="flex flex-col">
        <input type="text" inputMode="numeric" placeholder="Number of questions" value={question} onChange={handleQuestionChange} onBlur={handleQuestionBlur}
        className={`input bg-slate-900 text-zinc-200 w-56 ${questionError?"border-red-600 border-2":""}`}/>
        {questionError&&<p className="text-red-600 text-sm ml-2">{questionError}</p>}
      </div>
    </div>
  );
};

export default PounceBounceConfig;
