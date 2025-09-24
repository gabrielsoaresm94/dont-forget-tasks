import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { TaskPublisher } from "../publishers/TaskPublisher";
import { RabbitMQProvider } from "../providers/rabbitmq/RabbitMQProvider";
import { TaskRepositoryFactory } from "../repositories/TaskRepositoryFactory";

export class TaskController {
  private service: TaskService;
  private publisher: TaskPublisher;

  constructor() {
    const taskRepository = TaskRepositoryFactory.create();
    this.service = new TaskService(taskRepository);

    const rabbitProvider = new RabbitMQProvider();
    this.publisher = new TaskPublisher(rabbitProvider);
  }

  health = (req: Request, res: Response) => {
    return res.status(200).json(true);
  }

  createTask = async (req: Request, res: Response) => {
    const task = await this.service.createTask(req.body);

    // 🔔 publicar evento para outros serviços
    // await this.publisher.taskCreated(task);

    res.status(201).json(task);
  };
}
