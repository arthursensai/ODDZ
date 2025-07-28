import React, { useState, useEffect, useCallback } from 'react';

interface CountdownTimerProps {
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onComplete }) => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(3);
  const [showReady, setShowReady] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Number 3 (already showing)
    timeouts.push(setTimeout(() => {
      setCurrentNumber(2);
    }, 1000));

    // Number 2
    timeouts.push(setTimeout(() => {
      setCurrentNumber(1);
    }, 2000));

    // Number 1
    timeouts.push(setTimeout(() => {
      setCurrentNumber(null);
      setShowReady(true);
    }, 3000));

    // Complete after ready message shows
    timeouts.push(setTimeout(() => {
      setIsVisible(false);
      handleComplete();
    }, 4000));

    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [handleComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 transition-opacity duration-500">
      
      {/* Countdown Numbers */}
      {currentNumber && (
        <div 
          key={currentNumber}
          className="text-white font-black select-none countdown-number"
        >
          {currentNumber}
        </div>
      )}

      {/* Ready Message */}
      {showReady && (
        <div className="text-center ready-message">
          <div className="text-emerald-400 font-bold ready-text">
            Start!
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .countdown-number {
          font-size: clamp(8rem, 20vw, 20rem);
          text-shadow: 
            0 0 40px rgba(255, 255, 255, 0.9),
            0 0 80px rgba(139, 92, 246, 0.7),
            0 0 120px rgba(168, 85, 247, 0.5);
          animation: numberPop 0.8s ease-out forwards;
        }

        .ready-message {
          animation: readySlide 0.8s ease-out forwards;
        }

        .ready-text {
          font-size: clamp(2.5rem, 8vw, 5rem);
          text-shadow: 0 0 30px rgba(52, 211, 153, 0.8);
        }
        @keyframes numberPop {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes readySlide {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;