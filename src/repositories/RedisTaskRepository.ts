import { createClient, RedisClientType } from "redis";
import { ITaskRepository } from "./ITaskRepository";
import { Task } from "../models/Task";

export class RedisTaskRepository implements ITaskRepository {
  private static client: RedisClientType | null = null;
  private client: RedisClientType;

  constructor() {
    if (!RedisTaskRepository.client) {
      RedisTaskRepository.client = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
      });

      RedisTaskRepository.client.on("error", (err: any) => {
        console.error("❌ Erro no Redis:", err);
      });
    }
    this.client = RedisTaskRepository.client!;
  }

  private async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("📦 Redis conectado com sucesso!");
    }
  }

  private counterKey(userId: string) {
    return `tasks:${userId}:counter`;
  }

  private userTasksKey(userId: string) {
    return `tasks:${userId}`;
  }

  private taskKey(userId: string, taskId: number) {
    return `task:${userId}:${taskId}`;
  }

  async save(task: Task): Promise<Task> {
    await this.connect();
    const id = await this.client.incr(this.counterKey(task.userId));
    task.id = id;
    await this.client.hSet(this.taskKey(task.userId, id), {
      Id: id.toString(),
      UserId: task.userId,
      Description: task.description,
      ExpiredAt: task.expiredAt,
    });
    await this.client.rPush(this.userTasksKey(task.userId), id.toString());
    return task;
  }

  async findAll(userId: string): Promise<Task[]> {
    await this.connect();
    const ids = await this.client.lRange(this.userTasksKey(userId), 0, -1);
    const tasks: Task[] = [];
    for (const idStr of ids) {
      const id = parseInt(idStr, 10);
      const data = await this.client.hGetAll(this.taskKey(userId, id));
      if (!data || Object.keys(data).length === 0) continue;
      const t = new Task(data.Description, data.UserId, data.ExpiredAt);
      t.id = id;
      tasks.push(t);
    }
    return tasks;
  }

  async delete(userId: string, taskId: number): Promise<void> {
    await this.connect();
    await Promise.all([
      this.client.del(this.taskKey(userId, taskId)),
      this.client.lRem(this.userTasksKey(userId), 0, taskId.toString()),
    ]);
  }

  async findById(taskId: number, userId: string): Promise<Task | null> {
    await this.connect();
    const data = await this.client.hGetAll(this.taskKey(userId, taskId));
    if (Object.keys(data).length === 0) return null;
    const task = new Task(data.Description, data.UserId, data.ExpiredAt);
    task.id = taskId;
    return task;
  }
}
