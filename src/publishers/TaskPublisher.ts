import { IRabbitMQProvider } from "../providers/rabbitmq/IRabbitMQProvider";

interface ITaskPublisher {
  taskCreated(task: any): Promise<void>;
}

export class TaskPublisher implements ITaskPublisher {
  private messaging: IRabbitMQProvider;

  constructor(messaging: IRabbitMQProvider) {
    this.messaging = messaging;
  }

  async taskCreated(task: any) {
    await this.messaging.publish("task_created", task);
  }
}
