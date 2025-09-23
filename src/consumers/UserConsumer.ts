import { IRabbitMQProvider } from "../providers/rabbitmq/IRabbitMQProvider";
import { UserService } from "../services/UserService";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { UserPublisher } from "../publishers/UserPublisher";
import { UserRepositoryFactory } from "../repositories/UserRepositoryFactory";

export class UserConsumer {
  static async init(rabbitProvider: IRabbitMQProvider) {
    const queueName = "user_queue";
    const userRepository = UserRepositoryFactory.create();
    const service = new UserService(userRepository);
    const publisher = new UserPublisher(rabbitProvider);

    await rabbitProvider.consume(queueName, async (msg: any) => {
      console.log(`[UserConsumer] Mensagem recebida:`, msg);

      await service.createUser(msg);

      // 🔔 também pode publicar o evento, se necessário
      // await publisher.userCreated(user);
    });

    console.log(`[UserConsumer] Consumer inicializado na fila "${queueName}"`);
  }
}
