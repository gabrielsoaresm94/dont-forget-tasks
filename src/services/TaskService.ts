import { Task } from "../models/Task";
import { ITaskRepository } from "../repositories/ITaskRepository";

interface TaskRequest {
  description: string;
  userId: string;
  createdAt: string;
}

export class TaskService {
  constructor(private readonly repository: ITaskRepository) {}

  async createTask(data: TaskRequest): Promise<Task> {
    const task = new Task(
      data.description,
      data.userId,
      data.createdAt
    );

    return await this.repository.save(task);
  }

  async listTasks(userId: string, from?: number, to?: number): Promise<Task[]> {
    return this.repository.findAll(userId, from, to);
  }

  async deleteTask(userId: string, taskId: number): Promise<void> {
    await this.repository.delete(userId, taskId);
  }

  async getTask(taskId: number, userId: string): Promise<Task | null> {
    return this.repository.findById(taskId, userId);
  }
}
