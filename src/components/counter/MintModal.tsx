"use client"

import { useState, useRef, useEffect } from "react";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMint: (code: string) => Promise<void>;
}

export default function MintModal({ isOpen, onClose, onMint }: MintModalProps) {
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset OTP when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtpValues(["", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Animated scan line effect
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Glitch effect on mint
  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.toUpperCase();
    setOtpValues(newOtpValues);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleMint = async () => {
    const code = otpValues.join("");
    triggerGlitch();
    setTimeout(async () => {
      try {
        await onMint(code);
        onClose();
      } catch (error) {
        console.error("Mint failed:", error);
        // Could add error handling UI here
      }
    }, 300);
  };

  const isComplete = otpValues.every(val => val);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-move 20s linear infinite'
          }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Modal container */}
      <div className={`relative w-96 z-10 ${isGlitching ? 'animate-pulse' : ''}`}>
        {/* Scan line effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 h-0.5 z-20 pointer-events-none"
          style={{
            top: `${scanLine}%`,
            transition: 'none'
          }}
        ></div>

        {/* Neon border container */}
        <div className="relative p-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 rounded-lg animate-gradient-x">
          <div className="bg-black rounded-lg p-8 relative overflow-hidden">
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors duration-200 text-2xl font-bold"
            >
              ×
            </button>
            
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

            {/* Header */}
            <div className="text-center mb-8 relative">
              <h2 className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-widest ${isGlitching ? 'animate-bounce' : ''}`}>
                ◊ MINT NFT ◊
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>

            {/* OTP Code inputs */}
            <div className="mb-8 relative">
              <label className="block text-cyan-300 text-sm font-bold mb-4 tracking-wider flex items-center justify-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                ENTER_MINT_CODE
                <span className="w-2 h-2 bg-purple-400 rounded-full ml-2 animate-pulse"></span>
              </label>
              <div className="flex justify-center gap-4">
                {otpValues.map((value, index) => (
                  <div key={index} className="relative">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-16 h-16 bg-gray-900 text-cyan-100 border-2 ${
                        value ? 'border-purple-400 shadow-lg shadow-purple-400/50' : 'border-gray-600'
                      } text-2xl font-black text-center focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/50 transition-all duration-300 rounded font-mono`}
                      maxLength={1}
                    />
                    {value && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-800 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${otpValues.filter(v => v).length * 25}%` }}
                ></div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 font-bold text-sm tracking-wider bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all duration-300 rounded border-2 border-gray-600"
              >
                CANCEL
              </button>
              
              <button
                onClick={handleMint}
                disabled={!isComplete}
                className={`px-8 py-3 font-black text-lg tracking-wider transition-all duration-300 rounded relative overflow-hidden ${
                  isComplete 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 transform hover:scale-105 shadow-lg shadow-purple-500/50' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border-2 border-gray-700'
                }`}
              >
                <span className="relative z-10">
                  {isComplete ? '◊ MINT NFT ◊' : '◊ ENTER CODE ◊'}
                </span>
                {isComplete && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                )}
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {otpValues.map((value, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${value ? 'bg-purple-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}