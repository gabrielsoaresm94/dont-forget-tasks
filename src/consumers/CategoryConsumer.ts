import { IMessengerProvider } from "../providers/messenger/IMessengerProvider";
import { CategoryRepositoryFactory } from "../repositories/CategoryRepositoryFactory";
import { TaskRepositoryFactory } from "../repositories/TaskRepositoryFactory";
import { CategoryService } from "../services/CategoryService";


export class CategoryConsumer {
  static async init(messenger: IMessengerProvider): Promise<void> {
    const queueName = "category_queue";

    const categoryRepo = CategoryRepositoryFactory.create();
    const taskRepo = TaskRepositoryFactory.create();
    const service = new CategoryService(categoryRepo, taskRepo);

    await messenger.consume(queueName, async (envelope: any) => {
      try {
        const cmd = envelope?.message;
        if (!cmd) return;

        const { type, userId, data } = cmd;

        switch (type) {
          case "category.create": {
            await service.createCategory({
              userId, 
              name: data.name
            });
            break;
          }

          case "category.delete": {
            await service.deleteCategory(userId, Number(data.categoryId));
            break;
          }

          default:
            console.warn("Comando de category não suportado:", type);
        }
      } catch (err: any) {
        console.error("[CategoryConsumer] Erro:", err.message);
      }
    });

    console.log(`[CategoryConsumer] Consumer inicializado: ${queueName}`);
  }
}
