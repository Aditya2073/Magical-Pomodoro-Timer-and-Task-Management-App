import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, CheckCircle2, Circle, Plus, 
  Trash2, Edit, Star, Sparkles, Moon, Sun, Volume2, VolumeX,
  Scroll, Award, BookOpen, Maximize, Minimize, LogOut
} from 'lucide-react';
import useSound from 'use-sound';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import MagicalParticles from './components/MagicalParticles';
import MascotGuide from './components/MascotGuide';
import { Task } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import { saveUserData, getUserData } from './services/userService';

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('magicalTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showMascot, setShowMascot] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Sound effects
  const [playTimerComplete] = useSound('/sounds/magical-chime.mp3', { volume: isMuted ? 0 : 0.5 });
  const [playButtonClick] = useSound('/sounds/button-click.mp3', { volume: isMuted ? 0 : 0.3 });
  
  useEffect(() => {
    localStorage.setItem('magicalTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);
  
  const handleTimerComplete = () => {
    playTimerComplete();
    
    if (!isBreak) {
      const currentLevel = calculateLevel(completedSessions);
      const newLevel = calculateLevel(completedSessions + 1);
      
      // Level up notification
      if (newLevel > currentLevel && Notification.permission === 'granted') {
        new Notification('Level Up! 🎉', {
          body: `You've reached Level ${newLevel}! Your magical powers are growing stronger!`,
          icon: '/path/to/magical-icon.png'
        });
        
        // Create extra sparkles for level up
        createSparkles(20); // More sparkles for level up!
      }
      
      setCompletedSessions(prev => prev + 1);
    }
    
    if (Notification.permission === 'granted') {
      new Notification(isBreak ? 'Mana Restored!' : 'Enchantment Complete!', {
        body: isBreak 
          ? 'Time to cast new spells!' 
          : 'Take a moment to regenerate your mana.',
        icon: '/path/to/magical-icon.png'
      });
    }
    
    // Create sparkle effect
    createSparkles();
    
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(25 * 60);
    } else {
      setIsBreak(true);
      setTimeLeft(5 * 60);
    }
    setIsTimerActive(false);
  };
  
  const createSparkles = (count = 10) => {
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'magical-sparkle';
      sparkle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
      sparkle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
      document.querySelector('.timer-container')?.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    }
  };
  
  const toggleTimer = () => {
    playButtonClick();
    setIsTimerActive(!isTimerActive);
  };
  
  const resetTimer = () => {
    playButtonClick();
    setIsTimerActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };
  
  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const editTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleMascot = () => {
    setShowMascot(!showMascot);
  };
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };
  
  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
  
  // Add these calculations
  const calculateLevel = (sessions: number) => {
    return Math.floor(sessions / 4) + 1;
  };

  const calculateExperience = (sessions: number) => {
    const totalXP = sessions * 100;
    const level = calculateLevel(sessions);
    const xpForNextLevel = level * 400;
    const currentLevelXP = totalXP % xpForNextLevel;
    return { currentLevelXP, xpForNextLevel };
  };
  
  // Load user data on mount
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        const userData = await getUserData(user.uid);
        if (userData) {
          setTasks(userData.tasks);
          setCompletedSessions(userData.completedSessions);
          setIsMuted(userData.settings.isMuted);
          setShowMascot(userData.settings.showMascot);
        }
      };
      loadUserData();
    }
  }, [user]);

  // Save user data when it changes
  useEffect(() => {
    if (user) {
      saveUserData(user.uid, {
        tasks,
        completedSessions,
        settings: {
          isMuted,
          showMascot
        }
      });
    }
  }, [tasks, completedSessions, isMuted, showMascot, user]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <MagicalParticles count={20} />
      
      <header className="py-6 border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-purple-600" size={28} />
              <h1 className="text-3xl text-magical header-title">Arcane Pomodoro</h1>
            </motion.div>
            
            <div className="flex gap-3">
              <button 
                onClick={toggleFullScreen} 
                className="p-2 rounded-full hover:bg-purple-100 hover:bg-opacity-20 transition-colors"
                aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullScreen ? 
                  <Minimize size={20} className="text-purple-400" /> : 
                  <Maximize size={20} className="text-purple-400" />
                }
              </button>
              
              <button 
                onClick={toggleMute} 
                className="p-2 rounded-full hover:bg-purple-100 hover:bg-opacity-20 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={20} className="text-purple-400" /> : <Volume2 size={20} className="text-purple-400" />}
              </button>
              
              <button 
                onClick={toggleMascot} 
                className="p-2 rounded-full hover:bg-purple-100 hover:bg-opacity-20 transition-colors"
                aria-label={showMascot ? "Hide mascot" : "Show mascot"}
              >
                <BookOpen size={20} className="text-purple-400" />
              </button>
              
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-purple-100 hover:bg-opacity-20 transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={20} className="text-purple-400" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-12 sm:mb-20 mt-8 sm:mt-16">
          <div className="flex-1 flex flex-col">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="flex justify-center mb-2">
                <Timer 
                  timeLeft={timeLeft}
                  isActive={isTimerActive}
                  isBreak={isBreak}
                  toggleTimer={toggleTimer}
                  resetTimer={resetTimer}
                />
              </div>
              
              <div className="p-4 sm:p-6 bg-gray-800 rounded-lg shadow-md w-full max-w-2xl magical-border magical-mastery">
                <h3 className="text-lg sm:text-xl text-magical mb-3 sm:mb-4 text-center text-purple-400">Magical Mastery</h3>
                <div className="magical-stats grid grid-cols-3 gap-2 sm:gap-6">
                  <div className="stat-item p-2 sm:p-4">
                    <p className="stat-value text-xl sm:text-2xl md:text-3xl">{completedSessions}</p>
                    <p className="stat-label text-xs sm:text-sm">Sessions</p>
                  </div>
                  <div className="stat-item p-2 sm:p-4">
                    <p className="stat-value text-xl sm:text-2xl md:text-3xl">Level {calculateLevel(completedSessions)}</p>
                    <p className="stat-label text-xs sm:text-sm">Mastery</p>
                  </div>
                  <div className="stat-item p-2 sm:p-4">
                    <p className="stat-value text-lg sm:text-xl font-mono tabular-nums">
                      {calculateExperience(completedSessions).currentLevelXP} / {calculateExperience(completedSessions).xpForNextLevel}
                    </p>
                    <p className="stat-label text-xs sm:text-sm">Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 lg:mt-0"
          >
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden scroll-bg">
              <div className="scroll-content">
                <TaskList 
                  tasks={tasks}
                  onToggleComplete={toggleTaskCompletion}
                  onDelete={deleteTask}
                  onEdit={editTask}
                  onAdd={addTask}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {showMascot && <MascotGuide isBreak={isBreak} completedSessions={completedSessions} />}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-32 mb-12"
        >
          <h4 className="text-2xl text-magical text-center text-purple-400 mb-8">
            Magical Mastery Guide
          </h4>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 space-y-8 border border-purple-500/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-sm text-gray-300">
                <h5 className="text-lg text-magical text-purple-400 mb-4">How to Level Up:</h5>
                <ul className="list-disc list-inside space-y-3">
                  <li>Complete Pomodoro sessions (25 minutes of focused work)</li>
                  <li>Each completed session grants you 100 XP</li>
                  <li>Level 1: 0-400 XP (4 sessions)</li>
                  <li>Level 2: 400-800 XP (8 sessions)</li>
                  <li>Level 3: 800-1200 XP (12 sessions)</li>
                  <li>And so on... Keep practicing to become a master mage!</li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-300">
                <h5 className="text-lg text-magical text-purple-400 mb-4">Tips for Success:</h5>
                <ul className="list-disc list-inside space-y-3">
                  <li>Complete the full 25-minute focus period</li>
                  <li>Take your 5-minute mana regeneration breaks</li>
                  <li>Track your quests in the Quest Log</li>
                  <li>Stay consistent to increase your magical powers</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <footer className="text-center py-6 mt-12">
          <p className="text-sm text-gray-400">
            Arcane Pomodoro 2025 | Enchant your productivity
          </p>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;