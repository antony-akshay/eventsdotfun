"use client";

import { useState, useRef, useEffect } from "react";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMint: (code: string) => Promise<void>;
}

export default function MintModal({ isOpen, onClose, onMint }: MintModalProps) {
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtpValues(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [isOpen]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otpValues];
    newOtp[index] = value.toUpperCase();
    setOtpValues(newOtp);

    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Escape") onClose();
  };

  const handleMint = async () => {
    const code = otpValues.join("");
    await onMint(code);
    onClose();
  };

  const isComplete = otpValues.every((v) => v !== "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white border-2 border-black rounded-lg w-[90%] max-w-md p-6 z-10 shadow-[6px_6px_0_#000] font-['IBM_Plex_Mono',monospace]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold hover:text-red-500"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-center text-xl font-bold mb-6">Mint NFT</h2>

        {/* OTP Inputs */}
        <label className="block text-sm font-semibold mb-3 text-center">Enter Mint Code</label>

        <div className="flex justify-center gap-3 mb-6">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              className="
                w-14 h-14 
                text-2xl font-bold text-center 
                border-2 border-black rounded 
                focus:outline-none focus:shadow-[4px_4px_0_#000]
                transition-shadow
              "
            />
          ))}
        </div>

        {/* Progress bar (CreateEvent style) */}
        <div className="w-full bg-gray-200 h-2 rounded mb-6">
          <div
            className="bg-black h-2 rounded transition-all"
            style={{ width: `${otpValues.filter(v => v).length * 25}%` }}
          ></div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="
              px-6 py-2 bg-white border-2 border-black rounded 
              font-bold hover:bg-black hover:text-white 
              transition-colors
            "
          >
            cancel
          </button>

          <button
            onClick={handleMint}
            disabled={!isComplete}
            className={`
              px-6 py-2 rounded font-bold border-2 border-black
              transition-all shadow-[4px_4px_0_#000]
              active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
              ${isComplete 
                ? "bg-black text-white hover:bg-[#6315bbbc] hover:text-black"
                : "bg-gray-300 text-gray-600 cursor-not-allowed border-gray-400 shadow-none"}
            `}
          >
            mint
          </button>
        </div>
      </div>
    </div>
  );
}
