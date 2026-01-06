import React, { useState, useRef, useEffect } from "react";

const PounceBounceEvaluation = ({ handleEvaluate }) => {
  const [open,setOpen] = useState(false);
  const [selectedLabel,setSelectedLabel] = useState("Evaluate");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(containerRef.current && !containerRef.current.contains(e.target)){
        setOpen(false);
      }
    };

    if(open){
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative mr-2 mb-1 mt-1 ">
      <button
        className={`btn btn-sm bg-slate-900 border border-slate-600 hover:bg-slate-800 transition-colors w-[120px] text-center 
                    ${selectedLabel === "Evaluate" ? "text-teal-300" :selectedLabel === "Pounce ✓" || selectedLabel === "Bounce ✓" ? "text-green-500" : "text-red-500"}          
                  justify-center`
                }
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedLabel}
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 menu bg-slate-900 text-slate-100 rounded-box w-52 p-2 shadow-xl z-50">
          <li>
            <button onClick={() => {
                setSelectedLabel("Pounce ✓");
                handleEvaluate("RISK_CORRECT");
                setOpen(false);
              }}
              className="text-green-500"
            >
              Pounce ✓
            </button>
          </li>

          <li>
            <button onClick={() => {
                setSelectedLabel("Pounce X");
                handleEvaluate("RISK_WRONG");
                setOpen(false);
              }}
              className="text-red-500"
            >
              Pounce X
            </button>
          </li>

          <li>
            <button onClick={() => {
                setSelectedLabel("Bounce ✓");
                handleEvaluate("SAFE_CORRECT");
                setOpen(false);
              }}
              className="text-green-500"
            >
              Bounce ✓
            </button>
          </li>

          <li>
            <button onClick={() => {
                setSelectedLabel("Bounce X");
                handleEvaluate("SAFE_WRONG");
                setOpen(false);
              }}
              className="text-red-500"
            >
              Bounce X
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default PounceBounceEvaluation;
