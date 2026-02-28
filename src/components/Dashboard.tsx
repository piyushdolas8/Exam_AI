import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Trophy,
  Zap,
  Clock,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Flame,
  Target,
  BarChart3,
  FileText,
  Paperclip,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { Subject, StrategyResponse, CalendarEvent } from '../types';
import { cn } from '../lib/utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  onGenerate: (subjects: Subject[], dailyHours: number, mode: string) => Promise<void>;
  loading: boolean;
  strategy: StrategyResponse | null;
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onGenerate, loading, strategy, onBack }) => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '', units: 5, examDate: '', confidence: 3 }
  ]);
  const [dailyHours, setDailyHours] = useState(6);
  const [mode, setMode] = useState('Topper');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'assignment',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const addSubject = () => {
    setSubjects([...subjects, { id: Math.random().toString(), name: '', units: 5, examDate: '', confidence: 3 }]);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      updateSubject(id, 'syllabusFile', {
        data: base64String,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (id: string) => {
    updateSubject(id, 'syllabusFile', undefined);
  };

  const handleQuestionPaperUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        const currentPapers = subjects.find(s => s.id === id)?.questionPapers || [];
        updateSubject(id, 'questionPapers', [
          ...currentPapers,
          {
            data: base64String,
            mimeType: file.type,
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeQuestionPaper = (subjectId: string, paperName: string) => {
    const currentPapers = subjects.find(s => s.id === subjectId)?.questionPapers || [];
    updateSubject(subjectId, 'questionPapers', currentPapers.filter(p => p.name !== paperName));
  };

  const addCalendarEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const event: CalendarEvent = {
      id: Math.random().toString(),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type as any,
      description: newEvent.description
    };
    setCalendarEvents([...calendarEvents, event]);
    setShowEventModal(false);
    setNewEvent({ type: 'assignment', date: format(new Date(), 'yyyy-MM-dd') });
  };

  const removeCalendarEvent = (id: string) => {
    setCalendarEvents(calendarEvents.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-[#030303]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-zinc-500 hover:text-white mr-1"
            title="Back to Home"
          >
            <ChevronLeft size={20} />
          </button>
          <Zap className="text-emerald-500 fill-emerald-500" size={24} />
          <span className="text-xl font-display font-bold">ExamAI</span>
        </div>
        
        <nav className="space-y-2 flex-grow">
          {[
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { icon: <CalendarIcon size={20} />, label: 'Schedule' },
            { icon: <Trophy size={20} />, label: 'Achievements' },
            { icon: <Settings size={20} />, label: 'Settings' },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === item.label ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>


      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all text-zinc-500 hover:text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">
                  {activeTab === 'Dashboard' && "Academic Command Center"}
                  {activeTab === 'Schedule' && "Deployment Schedule"}
                  {activeTab === 'Achievements' && "Academic Honors"}
                  {activeTab === 'Settings' && "System Configuration"}
                </h1>
                <p className="text-zinc-500">
                  {activeTab === 'Dashboard' && "Configure your battlefield and generate your elite strategy."}
                  {activeTab === 'Schedule' && "Your comprehensive roadmap to academic dominance."}
                  {activeTab === 'Achievements' && "Track your progress and unlocked milestones."}
                  {activeTab === 'Settings' && "Manage your preferences and system parameters."}
                </p>
              </div>
            </div>
          </header>

          {activeTab === 'Dashboard' ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Input Form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass p-6 rounded-3xl">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BookOpen size={20} className="text-emerald-400" />
                  Syllabus Configuration
                </h2>
                
                <div className="space-y-4 mb-8">
                  {subjects.map((subject, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={subject.id} 
                      className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4 relative group"
                    >
                      {subjects.length > 1 && (
                        <button 
                          onClick={() => removeSubject(subject.id)}
                          className="absolute top-2 right-2 p-1.5 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Subject Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Quantum Physics"
                          className="w-full bg-transparent border-b border-white/10 py-1 text-sm focus:border-emerald-500 outline-none transition-all"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Units</label>
                          <input 
                            type="number" 
                            className="w-full bg-transparent border-b border-white/10 py-1 text-sm focus:border-emerald-500 outline-none transition-all"
                            value={subject.units}
                            onChange={(e) => updateSubject(subject.id, 'units', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Exam Date</label>
                          <input 
                            type="date" 
                            className="w-full bg-transparent border-b border-white/10 py-1 text-sm focus:border-emerald-500 outline-none transition-all"
                            value={subject.examDate}
                            onChange={(e) => updateSubject(subject.id, 'examDate', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Confidence: {subject.confidence}/5</label>
                        <input 
                          type="range" 
                          min="1" 
                          max="5" 
                          className="w-full accent-emerald-500"
                          value={subject.confidence}
                          onChange={(e) => updateSubject(subject.id, 'confidence', parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2 block">Syllabus Details (PDF/Image)</label>
                        {!subject.syllabusFile ? (
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileUpload(subject.id, e)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full py-2 px-4 rounded-xl border border-dashed border-white/10 text-zinc-500 text-xs flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                              <Paperclip size={14} />
                              Upload Syllabus
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText size={14} className="text-emerald-400 flex-shrink-0" />
                              <span className="text-[10px] text-emerald-400 font-medium truncate">{subject.syllabusFile.name}</span>
                            </div>
                            <button 
                              onClick={() => removeFile(subject.id)}
                              className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2 block">Previous Question Papers</label>
                        <div className="space-y-2">
                          <div className="relative">
                            <input 
                              type="file" 
                              multiple
                              accept="image/*,application/pdf"
                              onChange={(e) => handleQuestionPaperUpload(subject.id, e)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full py-2 px-4 rounded-xl border border-dashed border-white/10 text-zinc-500 text-xs flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                              <Plus size={14} />
                              Add Question Papers
                            </div>
                          </div>
                          
                          {subject.questionPapers && subject.questionPapers.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {subject.questionPapers.map((paper, i) => (
                                <div key={i} className="flex items-center gap-1.5 p-1.5 px-2 rounded-lg bg-white/5 border border-white/5 text-[10px] text-zinc-400">
                                  <FileText size={10} />
                                  <span className="truncate max-w-[80px]">{paper.name}</span>
                                  <button 
                                    onClick={() => removeQuestionPaper(subject.id, paper.name)}
                                    className="hover:text-red-400 transition-colors"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={addSubject}
                  className="w-full py-3 rounded-xl border border-dashed border-white/20 text-zinc-400 text-sm hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center gap-2 mb-8"
                >
                  <Plus size={16} /> Add Subject
                </button>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3 block">Daily Study Capacity</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="2" 
                        max="16" 
                        className="flex-grow accent-emerald-500"
                        value={dailyHours}
                        onChange={(e) => setDailyHours(parseInt(e.target.value) || 2)}
                      />
                      <span className="text-lg font-bold w-12">{dailyHours}h</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3 block">Operation Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Casual', 'Topper', 'Emergency'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMode(m)}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all",
                            mode === m ? "bg-emerald-500 text-black" : "bg-white/5 text-zinc-400 hover:bg-white/10"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => onGenerate(subjects, dailyHours, mode)}
                    disabled={loading || subjects.some(s => !s.name || !s.examDate)}
                    className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Analyzing Battlefield...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate Strategy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-2 space-y-8">
              {!strategy && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-3xl border-dashed">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Target size={40} className="text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Strategy Active</h3>
                  <p className="text-zinc-500 max-w-xs">Fill in your subject details to generate an AI-powered academic battle plan.</p>
                </div>
              )}

              {loading && (
                <div className="space-y-6">
                  <div className="h-64 glass rounded-3xl animate-pulse" />
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-40 glass rounded-3xl animate-pulse" />
                    <div className="h-40 glass rounded-3xl animate-pulse" />
                  </div>
                </div>
              )}

              {strategy && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Top Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass p-6 rounded-3xl">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Predicted Score</div>
                      <div className="text-3xl font-display font-bold text-emerald-400">{strategy.predictedScore}%</div>
                    </div>
                    <div className="glass p-6 rounded-3xl">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Burnout Risk</div>
                      <div className={cn(
                        "text-xl font-bold",
                        strategy.burnoutRisk ? "text-red-400" : "text-emerald-400"
                      )}>
                        {strategy.burnoutRisk ? "HIGH" : "LOW"}
                      </div>
                    </div>
                    <div className="glass p-6 rounded-3xl">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Revision Days</div>
                      <div className="text-3xl font-display font-bold">{strategy.revisionDays.length}</div>
                    </div>
                    <div className="glass p-6 rounded-3xl">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Tasks</div>
                      <div className="text-3xl font-display font-bold">
                        {strategy.schedule.reduce((acc, day) => acc + day.tasks.length, 0)}
                      </div>
                    </div>
                  </div>

                  {/* Urgency Chart */}
                  <div className="glass p-8 rounded-3xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <BarChart3 size={20} className="text-violet-400" />
                      Subject Urgency Ranking
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={strategy.urgencyRanking}>
                          <defs>
                            <linearGradient id="colorUrgency" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="subject" stroke="#ffffff40" fontSize={12} />
                          <YAxis stroke="#ffffff40" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                            itemStyle={{ color: '#10b981' }}
                          />
                          <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={1} fill="url(#colorUrgency)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Daily Battle Plan */}
                  <div className="glass p-8 rounded-3xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Zap size={20} className="text-emerald-400" />
                      Today's Battle Plan (Day 1)
                    </h3>
                    <div className="space-y-4">
                      {strategy.schedule[0]?.tasks.map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              task.type === 'revision' ? "bg-violet-500/20 text-violet-400" : "bg-emerald-500/20 text-emerald-400"
                            )}>
                              {task.type === 'revision' ? <Zap size={18} /> : <BookOpen size={18} />}
                            </div>
                            <div>
                              <div className="font-bold">{task.topic}</div>
                              <div className="text-xs text-zinc-500">{task.subject} • {task.type}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Clock size={14} />
                            {task.duration}h
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Questions Analysis */}
                  {strategy.importantQuestions && strategy.importantQuestions.length > 0 && (
                    <div className="glass p-8 rounded-3xl">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <FileText size={20} className="text-blue-400" />
                        Important Questions Analysis
                      </h3>
                      <div className="space-y-6">
                        {strategy.importantQuestions.map((item, i) => (
                          <div key={i} className="space-y-3">
                            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{item.subject}</h4>
                            <div className="grid gap-3">
                              {item.questions.map((q, j) => (
                                <div key={j} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-zinc-300 flex items-start gap-3">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                  {q}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full Schedule Preview */}
                  <div className="glass p-8 rounded-3xl">
                    <h3 className="text-lg font-bold mb-6">Full Deployment Schedule</h3>
                    <div className="space-y-8">
                      {strategy.schedule.slice(0, 5).map((day) => (
                        <div key={day.day} className="relative pl-8 border-l border-white/10">
                          <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-zinc-300">Day {day.day}</h4>
                            {strategy.revisionDays.includes(day.day) && (
                              <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-widest border border-violet-500/20">
                                Revision Focus
                              </span>
                            )}
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {day.tasks.map((task, i) => (
                              <div key={i} className="p-3 rounded-xl bg-white/5 text-sm flex items-center justify-between">
                                <span className="text-zinc-400">{task.subject}</span>
                                <span className="font-medium">{task.topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button className="w-full py-3 text-sm text-zinc-500 hover:text-white transition-all">
                        View Full 30-Day Schedule
                      </button>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {strategy.recommendations.length > 0 && (
                    <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
                      <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                        <Sparkles size={18} />
                        Strategic Recommendations
                      </h3>
                      <ul className="space-y-3">
                        {strategy.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-zinc-300 flex items-start gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
          ) : activeTab === 'Schedule' ? (
            <div className="space-y-6">
              <div className="glass p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold font-display">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 text-xs font-bold hover:bg-white/10 rounded-lg transition-all">
                        Today
                      </button>
                      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <ChevronRightIcon size={20} />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEventModal(true)}
                    className="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2"
                  >
                    <Plus size={18} /> Add Event
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mb-6 px-2">
                  {[
                    { label: 'Assignment', color: 'bg-blue-500' },
                    { label: 'Class Test', color: 'bg-red-500' },
                    { label: 'Class', color: 'bg-emerald-500' },
                    { label: 'Study', color: 'bg-violet-500' },
                    { label: 'Strategy', color: 'bg-violet-500 border-dashed border-white/50' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", item.color)} />
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-[#0a0a0a] py-3 text-center text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      {day}
                    </div>
                  ))}
                  {(() => {
                    const monthStart = startOfMonth(currentMonth);
                    const monthEnd = endOfMonth(monthStart);
                    const startDate = startOfWeek(monthStart);
                    const endDate = endOfWeek(monthEnd);
                    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

                    return calendarDays.map((day, i) => {
                      const dayEvents = calendarEvents.filter(e => isSameDay(new Date(e.date), day));
                      
                      // Map strategy tasks to dates starting from today
                      const strategyTasks: any[] = [];
                      if (strategy) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const diffTime = day.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                        
                        if (diffDays > 0) {
                          const dayPlan = strategy.schedule.find(s => s.day === diffDays);
                          if (dayPlan) {
                            dayPlan.tasks.forEach(task => {
                              strategyTasks.push({
                                id: `strategy-${diffDays}-${task.topic}`,
                                title: `${task.topic} (${task.subject})`,
                                type: 'study',
                                isStrategy: true
                              });
                            });
                          }
                        }
                      }

                      const isCurrentMonth = isSameMonth(day, monthStart);
                      const isTodayDate = isToday(day);

                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "min-h-[120px] bg-[#030303] p-2 border-t border-l border-white/5 transition-all hover:bg-white/[0.02]",
                            !isCurrentMonth && "opacity-30"
                          )}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className={cn(
                              "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                              isTodayDate ? "bg-emerald-500 text-black" : "text-zinc-400"
                            )}>
                              {format(day, 'd')}
                            </span>
                          </div>
                          <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                            {[...dayEvents, ...strategyTasks].map((event, idx) => (
                              <div 
                                key={event.id || idx}
                                className={cn(
                                  "text-[10px] p-1 px-1.5 rounded-md truncate font-medium border group relative",
                                  event.type === 'assignment' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                  event.type === 'test' && "bg-red-500/10 text-red-400 border-red-500/20",
                                  event.type === 'class' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                  event.type === 'study' && "bg-violet-500/10 text-violet-400 border-violet-500/20",
                                  event.type === 'other' && "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
                                  event.isStrategy && "border-dashed opacity-80"
                                )}
                              >
                                {event.title}
                                {!event.isStrategy && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeCalendarEvent(event.id);
                                    }}
                                    className="absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-sm"
                                  >
                                    <X size={8} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Event Modal */}
              {showEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass w-full max-w-md p-8 rounded-3xl border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Add New Event</h3>
                      <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Title</label>
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
                          placeholder="e.g. Physics Assignment"
                          value={newEvent.title || ''}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Date</label>
                          <input 
                            type="date" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
                            value={newEvent.date || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Type</label>
                          <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 appearance-none"
                            value={newEvent.type || 'assignment'}
                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                          >
                            <option value="assignment">Assignment</option>
                            <option value="test">Class Test</option>
                            <option value="class">Class/Lecture</option>
                            <option value="study">Study Session</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Description</label>
                        <textarea 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 min-h-[100px]"
                          placeholder="Optional details..."
                          value={newEvent.description || ''}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                      </div>
                      <button 
                        onClick={addCalendarEvent}
                        className="w-full bg-emerald-500 text-black py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all mt-4"
                      >
                        Create Event
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          ) : activeTab === 'Achievements' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Early Bird', desc: 'Started studying before 6 AM', icon: <Zap className="text-yellow-500" />, unlocked: true },
                { title: 'Consistency King', desc: 'Maintained a 7-day streak', icon: <Flame className="text-orange-500" />, unlocked: true },
                { title: 'Subject Master', desc: 'Completed all units in one subject', icon: <Target className="text-emerald-500" />, unlocked: false },
                { title: 'Revision Pro', desc: 'Completed 5 revision sessions', icon: <Sparkles className="text-violet-500" />, unlocked: true },
                { title: 'Top Scorer', desc: 'Achieved 90%+ in mock test', icon: <Trophy className="text-blue-500" />, unlocked: false },
              ].map((ach, i) => (
                <div key={i} className={cn(
                  "glass p-6 rounded-3xl border transition-all",
                  ach.unlocked ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 opacity-50"
                )}>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    {ach.icon}
                  </div>
                  <h3 className="font-bold mb-1">{ach.title}</h3>
                  <p className="text-xs text-zinc-500">{ach.desc}</p>
                  {ach.unlocked && <div className="mt-4 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Unlocked</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl space-y-6">
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-lg font-bold mb-6">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Display Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500" defaultValue="Elite Student" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1 block">Email Address</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500" defaultValue="student@examai.com" />
                  </div>
                </div>
              </div>
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-lg font-bold mb-6">Notifications</h3>
                <div className="space-y-4">
                  {[
                    'Daily Study Reminders',
                    'Achievement Alerts',
                    'Strategy Updates',
                    'Exam Countdown'
                  ].map((label, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">{label}</span>
                      <div className="w-10 h-5 rounded-full bg-emerald-500/20 relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
