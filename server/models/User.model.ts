export class UpdateUserRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string
  ) {}
}

export class DeleteUserActivityRequest {
  constructor(public id: number) {}
}
