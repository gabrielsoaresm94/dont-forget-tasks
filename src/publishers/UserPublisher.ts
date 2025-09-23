import { IRabbitMQProvider } from "../providers/rabbitmq/IRabbitMQProvider";

interface IUserPublisher {
  userCreated(user: any): Promise<void>;
}

export class UserPublisher implements IUserPublisher {
  private messaging: IRabbitMQProvider;

  constructor(messaging: IRabbitMQProvider) {
    this.messaging = messaging;
  }

  async userCreated(user: any) {
    await this.messaging.publish("user_created", user);
  }
}
