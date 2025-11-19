export class Task {
  public id?: number;

  constructor(
    public description: string,
    public userId: string,
    public expiredAt: string  // ISO
  ) {}
}
