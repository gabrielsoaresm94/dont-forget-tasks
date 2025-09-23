import { IUserRepository } from "./IUserRepository";
import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { RedisUserRepository } from "./RedisUserRepository";

export class UserRepositoryFactory {
  static create(): IUserRepository {
    const useRedis = process.env.USE_REDIS === "true";

    if (useRedis) {
      console.log("📦 Usando RedisUserRepository");
      return new RedisUserRepository();
    }

    console.log("📝 Usando InMemoryUserRepository");
    return new InMemoryUserRepository();
  }
}
