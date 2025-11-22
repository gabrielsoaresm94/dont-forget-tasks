import { IMessengerProvider } from "../providers/messenger/IMessengerProvider";
import { CategoryPublisher } from "../publishers/CategoryPublisher";
import { CategoryRepositoryFactory } from "../repositories/CategoryRepositoryFactory";
import { TaskRepositoryFactory } from "../repositories/TaskRepositoryFactory";
import { CategoryService } from "../services/CategoryService";

interface Payload<T> {
  Type: string;
  Data: T;
  CorrelationId: string;
  OccurredAt: string;
}

interface CreateData {
  Name: string;
  UserId: string;
}

interface DeleteData {
  CategoryId: number;
  UserId: string;
}

export class CategoryConsumer {
  static async init(messenger: IMessengerProvider): Promise<void> {
    const queueName = "category_queue";

    const categoryRepo = CategoryRepositoryFactory.create();
    const taskRepo = TaskRepositoryFactory.create();
    const service = new CategoryService(categoryRepo, taskRepo);
    const publisher = new CategoryPublisher(messenger);

    await messenger.consume(queueName, async (envelope: any) => {
      try {
        const cmd = envelope?.message as Payload<CreateData | DeleteData>;
        if (!cmd) {
          console.warn("[CategoryConsumer] Envelope sem mensagem:", envelope);
          return;
        }

        const type = cmd.Type;
        const correlationId = cmd.CorrelationId ?? "unknown";

        console.log(`[CategoryConsumer] Recebido: ${type} (cid=${correlationId}`);
        console.log("[CategoryConsumer] Payload:", cmd.Data);

        if (!type || !cmd.Data) {
          throw new Error("Comando inválido");
        }

        switch (type) {
          case "category.create": {
            const data = cmd.Data as CreateData;
            await service.createCategory({
              userId: data.UserId, 
              name: data.Name
            });
            console.log(`[CategoryConsumer] Categoria criada com sucesso (user=${data.UserId})`);
            break;
          }

          case "category.delete": {
            const data = cmd.Data as DeleteData;
            if (!data.CategoryId) {
              throw new Error("Payload inválido para category.delete");
            }
            await service.deleteCategory(data.UserId, Number(data.CategoryId));
            console.log(`[CategoryConsumer] Categoria ${data.CategoryId} removida (user=${data.UserId})`);
            break;
          }

          default:
            console.warn(`[CategoryConsumer] Tipo de comando não suportado: ${type}`);
            break;
        }
      } catch (err: any) {
        const message = err?.message ?? String(err);
        console.error(`[CategoryConsumer] Erro processando comando: ${message}`);
        try {
          await publisher.categoryError({
            Type: "categories.error",
            CorrelationId: err?.correlationId ?? "unknown",
            UserId: err?.userId ?? "unknown",
            Error: { code: "CATEGORY_ERROR", message },
            OccurredAt: new Date().toISOString(),
          });
        } catch (pubErr) {
          console.error("[CategoryConsumer] Falha ao publicar evento de erro: ", pubErr);
        }
      }
    });
    console.log(`[CategoryConsumer] Consumer inicializado na fila ${queueName}`);
  }
}
