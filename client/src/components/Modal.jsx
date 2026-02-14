import React from "react";
import { useEffect } from "react";

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                    flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 
                      border border-[#e5caca] dark:border-slate-800
                      rounded-2xl shadow-xl w-full max-w-lg p-8">
        {children}
      </div>
    </div>
  );
};

export default Modal