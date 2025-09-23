import { RabbitMQProvider } from "../providers/rabbitmq/RabbitMQProvider";
import { UserPublisher } from "../publishers/UserPublisher";

export class UserService {
  async create(data: any) {
    const rabbitMQProvider = new RabbitMQProvider();
    const publisher = new UserPublisher(rabbitMQProvider);
    const user = { id: Date.now(), ...data };
    await publisher.userCreated(user);
    return user;
  }
}
