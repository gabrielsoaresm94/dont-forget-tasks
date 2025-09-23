export interface IUserRepository {
  save(user: any): Promise<void>;
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
}
