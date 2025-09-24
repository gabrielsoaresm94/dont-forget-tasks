export class Task {
  constructor(
    public readonly id: number,
    public task: string,
    public userId: string,
    public dateTime: Date
  ) {}
}
