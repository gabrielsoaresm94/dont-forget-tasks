import { ITaskRepository } from "./ITaskRepository";
import { InMemoryTaskRepository } from "./InMemoryTaskRepository";
import { RedisTaskRepository } from "./RedisTaskRepository";

let inMemoryInstance: InMemoryTaskRepository | null = null;
let redisInstance: RedisTaskRepository | null = null;

export class TaskRepositoryFactory {
  static create(): ITaskRepository {
    const useRedis = process.env.USE_REDIS === "true";

    if (useRedis) {
      if (!redisInstance) {
        console.log("📦 Usando RedisTaskRepository");
        redisInstance = new RedisTaskRepository();
      }
      return redisInstance;
    }

    if (!inMemoryInstance) {
      console.log("📝 Usando InMemoryTaskRepository");
      inMemoryInstance = new InMemoryTaskRepository();
    }

    return inMemoryInstance;
  }
}
