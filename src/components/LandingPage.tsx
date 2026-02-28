import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  Calendar, 
  ChevronRight, 
  Star,
  BrainCircuit,
  Rocket,
  Flame,
  BarChart3,
  Users,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="text-black fill-black" size={20} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">ExamAI</span>
        </div>
        <button 
          onClick={onStart}
          className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            v2.0 Elite Academic System
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-[1.1]">
            Turn Your Syllabus Into A <br className="hidden md:block" /> Strategic Advantage
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The world's first psychologically optimized, AI-powered exam domination engine. Stop studying hard. Start studying smart.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="group relative px-8 py-4 bg-emerald-500 text-black rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Generate My Strategy <ChevronRight size={20} />
              </span>
            </button>

          </div>
        </motion.div>


      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Engineered for Domination</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Built on cognitive science and elite performance psychology.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <BrainCircuit className="text-emerald-400" />,
              title: "Spaced Revision Engine",
              description: "Automatically schedules 24h, 3-day, and 7-day revision cycles to lock knowledge into long-term memory."
            },
            {
              icon: <Target className="text-violet-400" />,
              title: "Weak Topic Intelligence",
              description: "AI detects your struggle areas and dynamically reallocates study time to ensure 100% coverage."
            },
            {
              icon: <ShieldAlert className="text-orange-400" />,
              title: "Emergency Mode",
              description: "Exam in 7 days? Switch to high-compression mode focusing only on high-weight topics."
            },
            {
              icon: <Flame className="text-red-400" />,
              title: "Burnout Detection",
              description: "Monitors study load and suggests optimized breaks and recovery days to maintain peak performance."
            },
            {
              icon: <TrendingUp className="text-blue-400" />,
              title: "Predictive Scoring",
              description: "Real-time estimation of your final grade based on completion, confidence, and revision depth."
            },
            {
              icon: <Users className="text-pink-400" />,
              title: "Topper Mode",
              description: "Advanced strategies used by the top 0.1% of students globally to maintain consistent excellence."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-3xl hover:bg-white/[0.07] transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Zap className="text-emerald-500 fill-emerald-500" size={20} />
            <span className="text-xl font-display font-bold">ExamAI</span>
          </div>
          <div className="text-zinc-500 text-sm">
            © 2026 ExamAI Systems. All rights reserved.
          </div>
          <div className="flex gap-6 text-zinc-400 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
