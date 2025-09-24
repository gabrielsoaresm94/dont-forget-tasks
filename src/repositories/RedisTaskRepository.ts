import { createClient, RedisClientType } from "redis";
import { ITaskRepository } from "./ITaskRepository";

export class RedisTaskRepository implements ITaskRepository {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    this.client.on("error", (err: any) => {
      console.error("❌ Erro no Redis:", err);
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("📦 Redis conectado com sucesso!");
    }
  }

  async save(task: any): Promise<void> {
    await this.connect();
    await this.client.hSet("tasks", task.id, JSON.stringify(task));
  }

  async findById(id: string): Promise<any | null> {
    await this.connect();
    const task = await this.client.hGet("tasks", id);
    return task ? JSON.parse(task) : null;
  }

  async findAll(): Promise<any[]> {
    await this.connect();
    const tasks = await this.client.hGetAll("tasks");
    return Object.values(tasks).map((u) => JSON.parse(u));
  }
}
