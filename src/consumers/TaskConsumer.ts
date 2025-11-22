import { IMessengerProvider } from "../providers/messenger/IMessengerProvider";
import { TaskService } from "../services/TaskService";
import { TaskPublisher } from "../publishers/TaskPublisher";
import { TaskRepositoryFactory } from "../repositories/TaskRepositoryFactory";
import { CategoryRepositoryFactory } from "../repositories/CategoryRepositoryFactory";

interface Payload<T> {
  Type: string;
  Data: T;
  CorrelationId: string;
  OccurredAt: string;
}

interface CreateData {
  Description: string;
  ExpiredAt: string;
  CategoryId: number;
  UserId: string;
  DeviceToken: string;
}

interface DeleteData {
  TaskId: number;
  UserId: string;
}

export class TaskConsumer {
  static async init(messenger: IMessengerProvider): Promise<void> {
    const queueName = "task_queue";

    const taskRepository = TaskRepositoryFactory.create();
    const categoryRepository = CategoryRepositoryFactory.create();
    const service = new TaskService(taskRepository, categoryRepository);
    const publisher = new TaskPublisher(messenger);

    await messenger.consume(queueName, async (envelope: any) => {
      try {
        const cmd = envelope?.message as Payload<CreateData | DeleteData>;
        if (!cmd) {
          console.warn("[TaskConsumer] Envelope sem mensagem:", envelope);
          return;
        }

        const type = cmd.Type;
        const correlationId = cmd.CorrelationId ?? "unknown";

        console.log(`[TaskConsumer] Recebido: ${type} (cid=${correlationId}`);
        console.log("[TaskConsumer] Payload:", cmd.Data);

        if (!type || !cmd.Data) {
          throw new Error("Comando inválido");
        }

        switch (type) {
          case "task.create": {
            const data = cmd.Data as CreateData;
            if (!data.Description || !data.ExpiredAt) {
              throw new Error("Payload inválido para task.create");
            }
            await service.createTask({
              description: data.Description,
              userId: data.UserId,
              expiredAt: data.ExpiredAt,
              categoryId: data.CategoryId
            });
            console.log(`[TaskConsumer] Tarefa criada com sucesso (user=${data.UserId})`);
            break;
          }

          case "task.delete": {
            const data = cmd.Data as DeleteData;
            if (!data.TaskId) {
              throw new Error("Payload inválido para task.delete");
            }
            await service.deleteTask(data.UserId, Number(data.TaskId));
            console.log(`[TaskConsumer] Tarefa ${data.TaskId} removida (user=${data.UserId})`);
            break;
          }

          default:
            console.warn(`[TaskConsumer] Tipo de comando não suportado: ${type}`);
            break;
        }
      } catch (err: any) {
        const message = err?.message ?? String(err);
        console.error(`[TaskConsumer] Erro processando comando: ${message}`);
        try {
          await publisher.taskError({
            Type: "tasks.error",
            CorrelationId: err?.correlationId ?? "unknown",
            UserId: err?.userId ?? "unknown",
            Error: { code: "TASK_ERROR", message },
            OccurredAt: new Date().toISOString(),
          });
        } catch (pubErr) {
          console.error("[TaskConsumer] Falha ao publicar evento de erro: ", pubErr);
        }
      }
    });
    console.log(`[TaskConsumer] Consumer inicializado na fila "${queueName}"`);
  }
}
