import { Task } from "../models/Task";

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findAll(userId: string, categoryId?: number): Promise<Task[]>;
  findById(taskId: number, userId: string): Promise<Task | null>;
  delete(userId: string, taskId: number): Promise<void>;
}
