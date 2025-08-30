export interface QuestionVM {
  questionId?: string;
  subject: string;
  category?: string;
  questionText: string;
  difficulty: number;
  createdOnUtc?: string;
  choices: QuestionChoiceVM[]
}

export interface QuestionChoiceVM {
  choiceId: string;
  choiceText: string;
  isCorrect: boolean;
}
