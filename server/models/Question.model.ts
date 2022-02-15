export class CreateQuestionRequest {
  constructor(
    public question: string,
    public answer: string,
    public timeout: number,
    public score: number,
    public quizId: number,
    public options: string[]
  ) {}
}

export class UpdateQuestionRequest {
  constructor(
    public id: number,
    public question?: string,
    public answer?: string,
    public timeout?: number,
    public score?: number,
    public quizId?: number
  ) {}
}

export class DeleteQuestionRequest {
  constructor(public id: number) {}
}

export class UpdateQuestionOptionRequest {
  constructor(public id: number, public option?: string) {}
}

export class DeleteQuestionOptionRequest {
  constructor(public id: number) {}
}
