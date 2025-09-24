import { ITaskRepository } from "./ITaskRepository";

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Record<string, any> = {};

  async save(task: any): Promise<void> {
    this.tasks[task.id] = task;
    console.log("Task salva:")
    console.log(this.tasks[task.id])
  }

  async findById(id: string): Promise<any | null> {
    return this.tasks[id] || null;
  }

  async findAll(): Promise<any[]> {
    return Object.values(this.tasks);
  }
}
