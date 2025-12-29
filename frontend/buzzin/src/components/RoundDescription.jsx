import React, { useState, useRef, useEffect} from "react";
import ClassicBuzzerConfig from "./ClassicBuzzerConfig";
import BuzzerWithChallengesConfig from "./BuzzerWithChallengesConfig";
import DifferentialScoringConfig from "./DifferentialScoringConfig";

const RoundDescription = ({ roundIndex, openRound, setOpenRound, setRoundValidity }) => {
  const [roundType, setRoundType] = useState(null);
  const isOpen = openRound === roundIndex;
  const containerRef = useRef(null);
  const [configValid, setConfigValid] =useState(false);

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
  };

    useEffect(() => {
        setRoundValidity(prev => ({
            ...prev,
            [roundIndex]: roundType !== null && configValid,
        }));
    }, [roundType, configValid]);
  

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
                        ? "Buzzer with Challenges"
                        : "Differential Scoring"
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
                    </ul>
                )}
            </div>
        </div>

      {roundType === "classic" && <ClassicBuzzerConfig onValidityChange={setConfigValid}/>}
      {roundType === "challenge" && <BuzzerWithChallengesConfig onValidityChange={setConfigValid} />}
      {roundType === "differential" && <DifferentialScoringConfig onValidityChange={setConfigValid}/>}
      {/* Add other configs later */}
    </div>
  );
};

export default RoundDescription;
