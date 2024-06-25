import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ onClose, children }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => {
      setIsVisible(false);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return createPortal(
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-4 pt-9 rounded-lg max-w-sm mx-auto relative z-60 transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-90"
        }`}
      >
        <button
          className="absolute top-2 right-2 text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
