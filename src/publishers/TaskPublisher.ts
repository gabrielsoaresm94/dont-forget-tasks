import { IMessengerProvider } from "../providers/messenger/IMessengerProvider";

export interface EventBase<T = unknown> {
  Type: "tasks.error";
  CorrelationId: string;
  UserId: string;
  Data?: T;
  Error?: { code: string; message: string };
  OccurredAt: string;
}

const EVENT_ROUTES = {
  error: "tasks.error",
} as const;

export class TaskPublisher {
  constructor(private readonly messaging: IMessengerProvider) {}

  async taskError(evt: EventBase): Promise<void> {
    try {
      await this.messaging.publish(EVENT_ROUTES.error, evt);
      console.log(`[TaskPublisher] Evento de erro publicado: ${evt.CorrelationId}`);
    } catch (err) {
      console.error(`[TaskPublisher] Falha ao publicar erro: ${evt.CorrelationId}`, err);
    }
  }
}
