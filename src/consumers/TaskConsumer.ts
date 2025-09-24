import { IRabbitMQProvider } from "../providers/rabbitmq/IRabbitMQProvider";
import { TaskService } from "../services/TaskService";
import { TaskPublisher } from "../publishers/TaskPublisher";
import { TaskRepositoryFactory } from "../repositories/TaskRepositoryFactory";

export class TaskConsumer {
  static async init(rabbitProvider: IRabbitMQProvider) {
    const queueName = "task_queue";
    const taskRepository = TaskRepositoryFactory.create();
    const service = new TaskService(taskRepository);
    const publisher = new TaskPublisher(rabbitProvider);

    await rabbitProvider.consume(queueName, async (msg: any) => {
      console.log(`[TaskConsumer] Mensagem recebida:`, msg);

      await service.createTask(msg);

      // 🔔 também pode publicar o evento, se necessário
      // await publisher.taskCreated(task);
    });

    console.log(`[TaskConsumer] Consumer inicializado na fila "${queueName}"`);
  }
}
