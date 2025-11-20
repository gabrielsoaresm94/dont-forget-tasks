export class Task {
  constructor(
    public description: string,
    public userId: string,
    public expiredAt: string,  // ISO
    public categoryId: number,
    public id?: number
  ) {}
}
