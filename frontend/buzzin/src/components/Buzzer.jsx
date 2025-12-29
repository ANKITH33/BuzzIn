import { useState } from "react";

const BUzzer = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="m-6 flex justify-center">
      <button
        onClick={() => setPressed(true)}
        className={`
          ${pressed ? "bg-warning" : "bg-error"}
          ${pressed ? "text-accent-content" : "text-white"}
          text-white
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
        {pressed ? "Buzzed!" : "Click to buzz!"}
      </button>
    </div>
  );
};

export default BUzzer;
