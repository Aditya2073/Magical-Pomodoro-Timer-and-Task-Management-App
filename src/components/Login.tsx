import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20"
      >
        <h1 className="text-3xl text-magical text-center text-purple-400 mb-8">
          Arcane Pomodoro
        </h1>
        
        <div className="text-center">
          <button
            onClick={signInWithGoogle}
            className="magical-btn px-6 py-3 rounded-lg flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 mx-auto"
          >
            <img 
              src="/google-icon.svg" 
              alt="Google" 
              className="w-5 h-5 bg-white rounded-full p-0.5" 
            />
            Sign in with Google
          </button>
          
          <p className="mt-4 text-sm text-gray-400">
            Begin your magical productivity journey
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 