import { User } from "../models/User";
import { IUserRepository } from "../repositories/IUserRepository";

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async createUser(data: any): Promise<User> {
    if (!data.email) throw new Error("Email é obrigatório");

    const user = new User(data.id, data.name, data.email);
    await this.repository.save(user);

    return user;
  }

  async getUser(id: string) {
    return this.repository.findById(id);
  }

  async listUsers() {
    return this.repository.findAll();
  }
}
