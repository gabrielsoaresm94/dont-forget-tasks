import { IUserRepository } from "./IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
  private users: Record<string, any> = {};

  async save(user: any): Promise<void> {
    this.users[user.id] = user;
    console.log("Usuário salvo:")
    console.log(this.users[user.id])
  }

  async findById(id: string): Promise<any | null> {
    return this.users[id] || null;
  }

  async findAll(): Promise<any[]> {
    return Object.values(this.users);
  }
}
