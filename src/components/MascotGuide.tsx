import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface MascotGuideProps {
  isBreak: boolean;
  completedSessions: number;
}

const MascotGuide: React.FC<MascotGuideProps> = ({ isBreak, completedSessions }) => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Messages for different states
  const workMessages = [
    "Focus your magical energy! You can do this!",
    "Every minute of focus strengthens your arcane abilities!",
    "The path to mastery requires dedication. Keep going!",
    "Your concentration is creating powerful magic!",
    "The greatest wizards maintain their focus. So can you!"
  ];
  
  const breakMessages = [
    "Time to regenerate your mana! Take a proper break.",
    "Rest your mind, young mage. The next challenge awaits.",
    "Even the most powerful wizards need to restore their energy.",
    "Your magical reserves are replenishing. Breathe deeply.",
    "A wise mage knows when to rest. Enjoy this moment."
  ];
  
  const achievementMessages = [
    "You've completed your first enchantment! Well done!",
    "Your magical abilities are growing stronger!",
    "Another successful spell cast! Your power increases!",
    "The arcane council would be impressed with your progress!",
    "Your dedication to the magical arts is admirable!"
  ];
  
  // Update message based on current state
  useEffect(() => {
    let newMessage = '';
    
    if (completedSessions > 0 && completedSessions % 4 === 0) {
      // Show achievement message for every 4 completed sessions
      newMessage = achievementMessages[Math.min(Math.floor(completedSessions / 4) - 1, achievementMessages.length - 1)];
    } else {
      // Show work or break message
      const messages = isBreak ? breakMessages : workMessages;
      newMessage = messages[Math.floor(Math.random() * messages.length)];
    }
    
    setMessage(newMessage);
  }, [isBreak, completedSessions]);
  
  const hideGuide = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 p-4 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-purple-500/30 max-w-sm"
          >
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
            >
              <X size={16} />
            </button>
            <p className="text-purple-300 text-sm">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
        >
          <MessageCircle className="text-white" size={24} />
        </button>
        {!isChatOpen && message && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800" />
        )}
      </motion.div>
    </div>
  );
};

export default MascotGuide;