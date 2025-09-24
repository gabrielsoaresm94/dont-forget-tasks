import { ITaskRepository } from "./ITaskRepository";
import { InMemoryTaskRepository } from "./InMemoryTaskRepository";
import { RedisTaskRepository } from "./RedisTaskRepository";

export class TaskRepositoryFactory {
  static create(): ITaskRepository {
    const useRedis = process.env.USE_REDIS === "true";

    if (useRedis) {
      console.log("📦 Usando RedisTaskRepository");
      return new RedisTaskRepository();
    }

    console.log("📝 Usando InMemoryTaskRepository");
    return new InMemoryTaskRepository();
  }
}
