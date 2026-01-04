import React, { useState, useRef, useEffect} from "react";
import ClassicBuzzerConfig from "./ClassicBuzzerConfig";
import BuzzerWithChallengesConfig from "./BuzzerWithChallengesConfig";
import DifferentialScoringConfig from "./DifferentialScoringConfig";
import PounceBounceConfig from "./PounceBounceConfig";
import HitHoldConfig from "./HitHoldConfig";

const RoundDescription = ({ roundIndex, openRound, setOpenRound, setRoundValidity, setRoundConfigs }) => {
  const [roundType, setRoundType] = useState(null);
  const isOpen = openRound === roundIndex;
  const containerRef = useRef(null);
  const [configValid, setConfigValid] =useState(false);
  const [configData, setConfigData] = useState(null);//null because {} means empty and null means round hasnt been chosen yet

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
            containerRef.current &&
            !containerRef.current.contains(e.target)
            ) {
            setOpenRound(null);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setOpenRound]);


  const handleSelect = (type) => {
    setRoundType(type);
    setOpenRound(null);
    setConfigData(null);
    setConfigValid(false);
  };

    useEffect(() => {
        setRoundValidity(prev => ({
            ...prev,
            [roundIndex]: roundType !== null && configValid,
        }));
    }, [roundType, configValid]);

    useEffect(() => {
        if(!roundType || !configValid || !configData){
            return;
        }

        setRoundConfigs( prev => ({
            ...prev,
            [roundIndex]: {
                order: roundIndex,
                type:
                roundType === "classic"
                    ? "classic_buzzer"
                    : roundType === "challenge"
                    ? "buzzer_with_challenges"
                    : roundType === "differential"
                    ? "differential_scoring"
                    : roundType === "pounce"
                    ? "pounce_bounce"
                    : "hit_hold",
                questionsCount: configData.questionsCount,
                scoring: configData.scoring
            }
        })
        );
    },[roundType,configData,configValid])
  

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl m-6 p-4">

        <div className="flex items-center gap-4 relative">
            <h1 className="text-slate-100 text-2xl ml-2 font-bold">
            Round {roundIndex}
            </h1>


            <div ref={containerRef} className="relative">
                <button
                    className="btn bg-slate-800 text-teal-300 border border-slate-600 hover:bg-slate-900"
                    onClick={() => setOpenRound(isOpen ? null : roundIndex)}
                >
                    {roundType 
                    ? roundType === "classic"
                        ? "Classic Buzzer"
                        : roundType === "challenge"
                        ? "Buzzer With Challenges"
                        : roundType === "differential"
                        ? "Differential Scoring"
                        : roundType === "pounce"
                        ? "Pounce Bounce"
                        : "Hit and Hold"
                    : "Select Round Type"}
                </button>

                {isOpen && (
                    <ul className="absolute mt-2 menu bg-slate-900 text-slate-100  rounded-box w-56 p-2 shadow-xl z-50">
                    <li>
                        <button onClick={() => handleSelect("classic")}>
                        Classic Buzzer
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleSelect("challenge")}>
                        Buzzer with Challenges
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleSelect("differential")}>
                        Differential Scoring
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleSelect("pounce")}>
                        Pounce Bounce
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleSelect("hit")}>
                        Hit and Hold
                        </button>
                    </li>
                    </ul>
                )}
            </div>
        </div>

      {roundType === "classic" && <ClassicBuzzerConfig onValidityChange={setConfigValid} onConfigChange={setConfigData}/>}
      {roundType === "challenge" && <BuzzerWithChallengesConfig onValidityChange={setConfigValid} onConfigChange={setConfigData}/>}
      {roundType === "differential" && <DifferentialScoringConfig onValidityChange={setConfigValid} onConfigChange={setConfigData}/>}
      {roundType === "pounce" && <PounceBounceConfig onValidityChange={setConfigValid} onConfigChange={setConfigData}/>}
      {roundType === "hit" && <HitHoldConfig onValidityChange={setConfigValid} onConfigChange={setConfigData}/>}
      {/* Add other configs later */}
    </div>
  );
};

export default RoundDescription;
