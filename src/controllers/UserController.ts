import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { UserPublisher } from "../publishers/UserPublisher";
import { RabbitMQProvider } from "../providers/rabbitmq/RabbitMQProvider";
import { UserRepositoryFactory } from "../repositories/UserRepositoryFactory";

export class UserController {
  private service: UserService;
  private publisher: UserPublisher;

  constructor() {
    const userRepository = UserRepositoryFactory.create();
    this.service = new UserService(userRepository);

    const rabbitProvider = new RabbitMQProvider();
    this.publisher = new UserPublisher(rabbitProvider);
  }

  health = (req: Request, res: Response) => {
    return res.status(200).json(true);
  }

  createUser = async (req: Request, res: Response) => {
    const user = await this.service.createUser(req.body);

    // 🔔 publicar evento para outros serviços
    // await this.publisher.userCreated(user);

    res.status(201).json(user);
  };
}
