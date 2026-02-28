export interface Subject {
  id: string;
  name: string;
  units: number;
  examDate: string;
  confidence: number;
  syllabusFile?: {
    data: string;
    mimeType: string;
    name: string;
  };
  questionPapers?: {
    data: string;
    mimeType: string;
    name: string;
  }[];
}

export interface Task {
  subject: string;
  topic: string;
  type: 'study' | 'revision';
  duration: number;
}

export interface DaySchedule {
  day: number;
  tasks: Task[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'test' | 'class' | 'other' | 'study';
  description?: string;
}

export interface StrategyResponse {
  schedule: DaySchedule[];
  revisionDays: number[];
  predictedScore: number;
  urgencyRanking: { subject: string; score: number }[];
  burnoutRisk: boolean;
  recommendations: string[];
  importantQuestions?: {
    subject: string;
    questions: string[];
  }[];
}
