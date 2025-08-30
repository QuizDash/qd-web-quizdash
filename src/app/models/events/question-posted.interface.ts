export interface IQuestionPosted {
  event: 'question',
  content: {
    question: number,
    targetUser: {
      sessionId: string,
      participantId: string,
      participantNickname: string,
      connectionId: string
    }
  }
}
