import { Task } from "../models/Task";
import { ITaskRepository } from "./ITaskRepository";

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Record<string, Task[]> = {};
  private counters: Record<string, number> = {};

  async save(task: Task): Promise<Task> {
    if (!this.counters[task.userId]) {
      this.counters[task.userId] = 0;
    }
    const newId = ++this.counters[task.userId];
    task.id = newId;
    if (!this.tasks[task.userId]) {
      this.tasks[task.userId] = [];
    }
    this.tasks[task.userId].push(task);
    return task;
  }

  async findAll(userId: string, categoryId?: number): Promise<Task[]> {
    const list = this.tasks[userId] || [];
    if (!categoryId) return list;
    return list.filter(t => t.categoryId === categoryId);
  }

  async delete(userId: string, taskId: number): Promise<void> {
    const userTasks = this.tasks[userId];
    if (!userTasks) return;
    this.tasks[userId] = userTasks.filter(t => t.id !== taskId);
  }

  async findById(taskId: number, userId: string): Promise<Task | null> {
    const userTasks = this.tasks[userId];
    if (!userTasks) return null;
    return userTasks.find(t => t.id === taskId) || null;
  }
}
