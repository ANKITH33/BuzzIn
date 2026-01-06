import { useState } from "react";

const Buzzer = ({onBuzz,pressed,buzzerLocked}) => {
  return (
    <div className=" flex justify-center">
      <button 
        type="button"
        onClick={onBuzz}
        disabled={buzzerLocked || pressed}
        className={`
          ${buzzerLocked ? "bg-warning" : pressed ? "bg-primary" : "bg-red-700"}
          ${buzzerLocked ? "text-accent-content" : pressed ? "text-accent-content" : "text-white"}
          text-4xl
          font-bold
          rounded-xl
          w-full md:w-[50vw]
          h-[65vh] md:h-[50vh]
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
