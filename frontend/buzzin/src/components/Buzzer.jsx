import { useState } from "react";

const Buzzer = ({answer,pressed,setPressed,buzzerLocked}) => {
  const handleSubmit =() =>{
    console.log("Submitted Answer is:", answer);
    setPressed(true);
  }

  return (
    <div className=" flex justify-center">
      <button
        onClick={handleSubmit}
        disabled={buzzerLocked}
        className={`
          ${buzzerLocked ? "bg-warning" : pressed ? "bg-warning" : "bg-error"}
          ${buzzerLocked ? "text-accent-content" : pressed ? "text-accent-content" : "text-white"}
          ${buzzerLocked ? "text-accent-content" : pressed ? "text-accent-content" : "text-white"}
          text-4xl
          font-bold
          rounded-xl
          w-[50vw]
          h-[50vh]
          transition-colors
          duration-200
          active:scale-95
        `}
      >
        {buzzerLocked ? "Buzzer Locked" : pressed ? "Buzzed!" : "Click to buzz!"}
      </button>
    </div>
  );
};

export default Buzzer;
