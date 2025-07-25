"use client";
import { useState, useEffect } from "react";

const SmileyLoader = ({ text }: { text: string }) => {
  const [mood, setMood] = useState<"happy" | "worried">("happy");
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const moodInterval = setInterval(() => {
      setMood((prev) => (prev === "happy" ? "worried" : "happy"));
    }, 2800);

    const animationInterval = setInterval(() => {
      setAnimationTime((prev) => prev + 0.08);
    }, 40);

    return () => {
      clearInterval(moodInterval);
      clearInterval(animationInterval);
    };
  }, []);

  const isWorried = mood === "worried";
  const breathingScale = 1 + Math.sin(animationTime * 0.5) * 0.025;
  const floatY = Math.sin(animationTime * 0.3) * 1.5;
  const glowPulse = 0.7 + Math.sin(animationTime * 0.7) * 0.3;
  const eyeScale = isWorried ? 0.95 : 1;
  const eyeY = isWorried ? 2 : 0;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10 ">
      {/* Enhanced glow layers */}
      <div className="relative">
        {/* Outer glow */}
        <div 
          className="absolute inset-0 w-36 h-36 rounded-full blur-2xl opacity-40"
          style={{
            background: `radial-gradient(circle, rgba(6, 182, 212, ${glowPulse}) 0%, transparent 60%)`,
            transform: `scale(${breathingScale * 1.3}) translateY(${floatY * 0.8}px)`,
          }}
        />
        
        {/* Inner glow */}
        <div 
          className="absolute inset-2 w-32 h-32 rounded-full blur-lg opacity-60"
          style={{
            background: `radial-gradient(circle, rgba(6, 182, 212, ${glowPulse * 0.8}) 0%, transparent 50%)`,
            transform: `scale(${breathingScale * 1.1}) translateY(${floatY * 0.9}px)`,
          }}
        />
        
        {/* Main face with perfect proportions */}
        <div 
          className="relative w-28 h-28 rounded-full bg-cyan-400 flex items-center justify-center transition-all duration-1200 ease-out"
          style={{
            transform: `scale(${breathingScale}) translateY(${floatY}px)`,
            boxShadow: `
              0 0 0 1px rgba(6, 182, 212, 0.2),
              0 8px 32px rgba(6, 182, 212, 0.4),
              0 4px 16px rgba(0, 0, 0, 0.3)
            `,
          }}
        >
          {/* Left Eye - better positioned */}
          <div 
            className="absolute w-3.5 h-6 bg-slate-800 rounded-full transition-all duration-1200 ease-out"
            style={{
              top: '28px',
              left: '30px',
              transform: `scale(${eyeScale}) translateY(${eyeY}px)`,
            }}
          />
          
          {/* Right Eye - better positioned */}
          <div 
            className="absolute w-3.5 h-6 bg-slate-800 rounded-full transition-all duration-1200 ease-out"
            style={{
              top: '28px',
              right: '30px',
              transform: `scale(${eyeScale}) translateY(${eyeY}px) rotate(${isWorried ? '3deg' : '0deg'})`,
              transformOrigin: 'center bottom',
            }}
          />

          {/* Happy Mouth - much bigger and better positioned */}
          <div
            className={`absolute transition-all duration-1200 ease-out ${
              !isWorried ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{
              bottom: '22px',
              left: '50%',
              transform: `translateX(-50%) scale(${!isWorried ? 1 : 0.9})`,
            }}
          >
            <div 
              className="w-16 h-4"
              style={{
                background: 'transparent',
                borderBottom: '3px solid #1e293b',
                borderRadius: '0 0 80px 80px',
              }}
            />
          </div>
          
          {/* Worried Mouth - bigger frown */}
          <div
            className={`absolute transition-all duration-1200 ease-out ${
              isWorried ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{
              bottom: '20px',
              left: '50%',
              transform: `translateX(-50%) scale(${isWorried ? 1 : 0.9})`,
            }}
          >
            <div 
              className="w-12 h-4"
              style={{
                background: 'transparent',
                borderTop: '3px solid #1e293b',
                borderRadius: '80px 80px 0 0',
              }}
            />
          </div>

          {/* Worried Eyebrow - curved like in your image */}
          <div
            className={`absolute transition-all duration-1200 ease-out ${
              isWorried ? "opacity-100" : "opacity-0"
            }`}
            style={{
              top: '20px',
              right: '22px',
              transform: `rotate(${isWorried ? '15deg' : '0deg'}) scale(${isWorried ? 1 : 0.8})`,
              transformOrigin: 'left center',
            }}
          >
            <div 
              className="w-6 h-2"
              style={{
                background: 'transparent',
                borderTop: '2px solid #1e293b',
                borderRadius: '40px 40px 0 0',
              }}
            />
          </div>

          {/* Subtle highlight for depth */}
          <div 
            className="absolute top-3 left-5 w-4 h-3 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 70%)',
            }}
          />
        </div>
      </div>

      {/* Enhanced text section */}
      <div className="text-center space-y-5">
        <p 
          className="text-xl font-semibold text-cyan-200 transition-all duration-1200 ease-out tracking-wide"
          style={{
            opacity: 0.85 + Math.sin(animationTime * 0.5) * 0.15,
            transform: `translateY(${floatY * 0.2}px)`,
            textShadow: '0 2px 8px rgba(6, 182, 212, 0.3)',
          }}
        >
          {text}
        </p>
        
        {/* Refined loading dots */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2].map((i) => {
            const dotPhase = Math.sin(animationTime * 1.1 + i * 0.6);
            const dotScale = 0.7 + Math.abs(dotPhase) * 0.5;
            const dotOpacity = 0.4 + Math.abs(dotPhase) * 0.6;
            const dotY = dotPhase * 3;
            
            return (
              <div key={i} className="relative">
                {/* Dot glow */}
                <div
                  className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full blur-sm"
                  style={{
                    opacity: dotOpacity * 0.4,
                    transform: `scale(${dotScale * 1.5}) translateY(${dotY}px)`,
                  }}
                />
                {/* Main dot */}
                <div
                  className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-700 ease-out"
                  style={{
                    opacity: dotOpacity,
                    transform: `scale(${dotScale}) translateY(${dotY}px)`,
                    boxShadow: '0 2px 6px rgba(6, 182, 212, 0.4)',
                  }}
                />
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};

export default SmileyLoader;