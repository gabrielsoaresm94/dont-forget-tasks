import { Task } from "../models/Task";
import { ITaskRepository } from "../repositories/ITaskRepository";

interface TaskRequest {
  id: number;
  task: string;
  userId: string;
  timestamp: number;
}

export class TaskService {
  constructor(private readonly repository: ITaskRepository) {}

  async createTask(data: TaskRequest): Promise<Task> {

    const task = new Task(
      data.id,
      data.task,
      data.userId,
      new Date(data.timestamp)
    );
    await this.repository.save(task);

    return task;
  }

  async getTask(id: string) {
    return this.repository.findById(id);
  }

  async listTasks() {
    return this.repository.findAll();
  }
}
