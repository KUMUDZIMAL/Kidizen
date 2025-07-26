export type AnswerLabel = 'A' | 'B' | 'C' | 'D';



export interface Question {
  text: string;
  options: Record<AnswerLabel, string>;
  correctAnswer: AnswerLabel;
  explanations: Partial<Record<AnswerLabel, string>>;
}

export interface Quiz {
  questions: Question[];
}

