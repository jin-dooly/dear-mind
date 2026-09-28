export type AgeGroup = '10대' | '20대' | '30대' | '40대' | '50대 이상';

export type Level = 1 | 2 | 3 | 4;

export interface UserProfile {
  ageGroup: AgeGroup;
  baseLevel: Level;
  nickname: string;
}

export interface Question {
  id: string;
  content: string;
  level: Level;
  type: string;
}

export interface AIAnalysis {
  summary: string;
  toneKeywords: string[];
  message: string;
  isSafetyFallback: boolean;
}

export interface Journal {
  id: string;
  questionId: string;
  questionContent: string;
  level: Level;
  content: string;
  createdAt: string;
  analysis: AIAnalysis;
}
