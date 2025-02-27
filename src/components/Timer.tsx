import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
  isBreak: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
}

const Timer: React.FC<TimerProps> = ({ 
  timeLeft, 
  isActive, 
  isBreak, 
  toggleTimer, 
  resetTimer 
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage for the circle
  const progress = isBreak 
    ? (timeLeft / (5 * 60)) * 100 
    : (timeLeft / (25 * 60)) * 100;
  
  // Calculate the stroke-dashoffset based on progress
  const circumference = 2 * Math.PI * 120; // 120 is the radius
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Reference to track previous offset for smoother animation
  const prevOffsetRef = useRef(strokeDashoffset);
  
  useEffect(() => {
    prevOffsetRef.current = strokeDashoffset;
  }, [strokeDashoffset]);
  
  return (
    <div className="flex flex-col items-center">
      {/* Timer SVG and display */}
      <div className="timer-container relative w-80 h-80">
        <div className="relative flex flex-col items-center justify-center h-full">
          <div className="spell-circle relative w-full h-full flex items-center justify-center">
            {/* Animated SVG circle */}
            <svg className="absolute w-full h-full" viewBox="0 0 250 250">
              {/* Background circle */}
              <circle
                cx="125"
                cy="125"
                r="120"
                fill="none"
                stroke={isBreak ? "#3a86ff" : "#8a2be2"}
                strokeWidth="4"
                strokeOpacity="0.2"
              />
              
              {/* Progress circle */}
              <motion.circle
                cx="125"
                cy="125"
                r="120"
                fill="none"
                stroke={isBreak ? "#3a86ff" : "#8a2be2"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 125 125)"
                transition={{ 
                  duration: isActive ? 1 : 0.5, 
                  ease: isActive ? "linear" : "easeOut"
                }}
              />
              
              {/* Decorative runes */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <text
                  key={index}
                  x="125"
                  y="15"
                  fill={isBreak ? "#3a86ff" : "#8a2be2"}
                  fontSize="12"
                  fontFamily="Cinzel Decorative"
                  textAnchor="middle"
                  opacity="0.7"
                  transform={`rotate(${angle} 125 125)`}
                >
                  ✧
                </text>
              ))}
              
              {/* Additional decorative elements */}
              <circle
                cx="125"
                cy="125"
                r="110"
                fill="none"
                stroke={isBreak ? "#3a86ff" : "#8a2be2"}
                strokeWidth="1"
                strokeOpacity="0.1"
                strokeDasharray="5,5"
              />
              
              <circle
                cx="125"
                cy="125"
                r="100"
                fill="none"
                stroke={isBreak ? "#3a86ff" : "#8a2be2"}
                strokeWidth="1"
                strokeOpacity="0.1"
              />
            </svg>
            
            {/* 3D Outer Rings */}
            <div className="outer-ring-3d absolute w-full h-full rounded-full border-2 border-purple-500/20"></div>
            <div className="middle-ring-3d absolute w-[95%] h-[95%] rounded-full border border-blue-400/20"></div>
            <div className="inner-ring-3d absolute w-[90%] h-[90%] rounded-full border border-yellow-400/20"></div>
            
            {/* Inner content - Only timer display */}
            <div className="z-10 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="timer-text-container"
              >
                <motion.h2 
                  className="text-6xl font-fantasy text-purple-700 dark:text-purple-400 timer-text"
                  animate={{ 
                    textShadow: isActive 
                      ? ['0 0 10px rgba(138, 43, 226, 0.5)', '0 0 20px rgba(138, 43, 226, 0.7)', '0 0 10px rgba(138, 43, 226, 0.5)'] 
                      : '0 0 10px rgba(138, 43, 226, 0.5)'
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {formatTime(timeLeft)}
                </motion.h2>
              </motion.div>
            </div>
            
            {/* Animated particles around the circle */}
            {isActive && Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-yellow-400"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0.7 
                }}
                animate={{ 
                  x: [0, Math.random() * 40 * (Math.random() > 0.5 ? 1 : -1)], 
                  y: [0, Math.random() * 40 * (Math.random() > 0.5 ? 1 : -1)],
                  opacity: [0.7, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: i * 0.2
                }}
                style={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%`,
                  boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.3)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Text below timer */}
      <h3 className="text-xl text-magical text-purple-400 mt-12">
        {isBreak ? "Mana Regeneration" : "Enchantment Period"}
      </h3>

      {/* Timer controls */}
      <div className="text-center mt-3 mb-8">
        <div className="button-container">
          <button 
            onClick={toggleTimer}
            className="primary-button"
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? "Pause Spell" : "Cast Spell"}
          </button>
          <button 
            onClick={resetTimer}
            className="secondary-button"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;