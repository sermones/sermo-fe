export interface Word {
  id: number;
  word: string;
  meaning: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface Sentence {
  id: number;
  sentence: string;
  meaning: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface QuizSettings {
  wordCount: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
}

export interface QuizResult {
  wordId: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  timeSpent: number;
}
