import app from "./app";
import { env } from "./config/env";
import { UserConsumer } from "./consumers/UserConsumer";
import { RabbitMQProviderFactory } from "./providers/rabbitmq/RabbitMQProviderFactory";

class Application {
  private readonly rabbitProvider;
  private readonly port: number;

  constructor() {
    const useFake = process.env.USE_RABBIT === "false";
    this.rabbitProvider = RabbitMQProviderFactory.create(useFake);
    this.port = env.port;
  }

  private async initRabbit() {
    await this.rabbitProvider.init();
    await UserConsumer.init(this.rabbitProvider);
    console.log("📡 RabbitMQ conectado e consumers iniciados.");

    // Se estiver usando Fake e quiser seed manual
    if (
      process.env.USE_RABBIT === "false" &&
      process.env.SEED_FAKE_MESSAGES === "true" &&
      typeof (this.rabbitProvider as any).seedMessage === "function"
    ) {
      console.log("💡 Enviando mensagem fake inicial...");
      await (this.rabbitProvider as any).seedMessage("user_queue", {
        id: 1,
        name: "Teste Fake",
        email: "teste@fake.com",
      });
    }
  }

  private initHttp() {
    app.listen(this.port, () => {
      console.log(`🚀 HTTP Server rodando na porta ${this.port}`);
    });
  }

  public async start() {
    try {
      await this.initRabbit();

      if (process.env.ENABLE_HTTP === "true") {
        this.initHttp();
      }

      console.log("✅ Aplicação iniciada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao iniciar a aplicação:", error);
      process.exit(1);
    }
  }
}

const application = new Application();
application.start();
