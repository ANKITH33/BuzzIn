import DifferentialEvaluation from './DifferentialEvaluation';
import ClassicEvaluation from './ClassicEvaluation';
import ChallengesEvaluation from './ChallengesEvaluation';
import PounceBounceEvaluation from './PounceBounceEvaluation';
import HitHoldEvaluation from './HitHoldEvaluation';

import axios from "axios";
import toast from "react-hot-toast";

const BuzzerBoardEntry = ({ name, response, roundType,roomCode }) => {
  const renderEvaluation = () => {
    switch (roundType) {
      case "differential_scoring":
        return <DifferentialEvaluation handleEvaluate={handleEvaluate}/>;

      case "classic_buzzer":
        return <ClassicEvaluation handleEvaluate={handleEvaluate}/>;

      case "buzzer_with_challenges":
        return <ChallengesEvaluation handleEvaluate={handleEvaluate}/>;
      
      case "pounce_bounce":
        return <PounceBounceEvaluation handleEvaluate={handleEvaluate}/>;

      case "hit_hold":
        return <HitHoldEvaluation handleEvaluate={handleEvaluate}/>;
      
      default:
        return null;
    }
  };

  const handleEvaluate = async (evaluation) => {
    try {
      await axios.post(`http://localhost:5001/api/rooms/${roomCode}/evaluation`,{teamName:name,evaluation});
    } catch (err) {
      console.error("Evaluation failed", err);
      toast.error(err.response?.data?.error || "Failed to evaluate");
    }
  };

  return (
    <div className={`flex flex-row items-start ${roundType === "buzzer_with_challenges" ? "mb-3" : "mb-1"}`}>
      <div className="bg-white text-black rounded-md flex flex-col gap-1 p-2 border-2 border-slate-500 ml-6 mr-2 w-full">
        <span className="font-semibold text-sm">{name}</span>

        <p className="text-slate-800 break-words whitespace-pre-wrap">
          {response}
        </p>
      </div>


      {renderEvaluation()}
    </div>
  );
};

export default BuzzerBoardEntry;
