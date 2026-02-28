import { GoogleGenAI } from "@google/genai";
import { Subject, StrategyResponse } from "../types";

export async function generateStrategy(subjects: Subject[], dailyHours: number, mode: string): Promise<StrategyResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key not configured. Please add it to your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Prepare parts for multimodal input
  const parts: any[] = [
    {
      text: `You are an elite academic strategist. Generate a day-wise optimized exam strategy for the following subjects: ${JSON.stringify(subjects.map(s => ({ name: s.name, units: s.units, examDate: s.examDate, confidence: s.confidence })))}. 
      Daily study hours available: ${dailyHours}. 
      Mode: ${mode}.
      
      I have attached syllabus documents and previous year question papers for some subjects. 
      
      YOUR TASKS:
      1. Analyze the syllabus to identify key topics and weightage.
      2. Analyze the question papers to identify recurring themes, frequently asked questions, and high-priority topics.
      3. List out the most important/recurring questions for each subject based on the question papers.
      4. Generate a schedule that prioritizes these high-weightage topics.
      
      Apply spaced repetition (1-day, 3-day, 7-day).
      Adjust for confidence levels (1 is low, 5 is high).
      Insert revision days.
      Prioritize urgent exams.
      
      Return a structured JSON format with the following schema:
      {
        "schedule": [
          { "day": number, "tasks": [{ "subject": string, "topic": string, "type": "study" | "revision", "duration": number }] }
        ],
        "revisionDays": [number],
        "predictedScore": number (0-100),
        "urgencyRanking": [{ "subject": string, "score": number }],
        "burnoutRisk": boolean,
        "recommendations": string[],
        "importantQuestions": [
          { "subject": string, "questions": string[] }
        ]
      }`
    }
  ];

  // Add syllabus files and question papers as parts
  subjects.forEach(subject => {
    if (subject.syllabusFile) {
      parts.push({
        inlineData: {
          data: subject.syllabusFile.data,
          mimeType: subject.syllabusFile.mimeType
        }
      });
      parts.push({
        text: `The above document is the syllabus for the subject: ${subject.name}`
      });
    }
    
    if (subject.questionPapers && subject.questionPapers.length > 0) {
      subject.questionPapers.forEach((paper, idx) => {
        parts.push({
          inlineData: {
            data: paper.data,
            mimeType: paper.mimeType
          }
        });
        parts.push({
          text: `The above document is a previous year question paper for the subject: ${subject.name} (Paper ${idx + 1})`
        });
      });
    }
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate strategy: Empty response from AI");
  }

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response:", response.text);
    throw new Error("Failed to parse strategy data");
  }
}
