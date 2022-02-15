export class CreateAnswerRequest {
  constructor(
    public questionId: number,
    public studentId: number,
    public answer: string
  ) {}
}
