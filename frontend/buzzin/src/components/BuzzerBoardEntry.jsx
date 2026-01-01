import DifferentialEvaluation from './DifferentialEvaluation';
import ClassicEvaluation from './ClassicEvaluation';
import ChallengesEvaluation from './ChallengesEvaluation';
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
    <div className="flex flex-row items-center">
      <div className="bg-white text-slate-800 rounded-md flex justify-between p-2 border-2 border-slate-500 ml-6 mr-2 mb-1 w-full">
        <span>{name}</span>
        <span className="font-semibold">{response}</span>
      </div>

      {renderEvaluation()}
    </div>
  );
};

export default BuzzerBoardEntry;
