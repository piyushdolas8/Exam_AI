import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Subject, StrategyResponse } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { generateStrategy } from './services/aiService';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);

  const handleGenerate = async (subjects: Subject[], dailyHours: number, mode: string) => {
    setLoading(true);
    try {
      const data = await generateStrategy(subjects, dailyHours, mode);
      setStrategy(data);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to generate strategy. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStart={() => setView('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard 
              onGenerate={handleGenerate} 
              loading={loading} 
              strategy={strategy} 
              onBack={() => setView('landing')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
