export interface IQuestion {
  subject: string;
  category: string;
  questionId: string;
  questionText: string;
  difficulty: number;
  createdOnUtc?: string;
  createdOnUtcDisplay?: string;
  choices: IQuestionChoice[]
}

export interface IQuestionChoice {
  choiceId: string;
  choiceText: string;
  isCorrect: boolean;
}
