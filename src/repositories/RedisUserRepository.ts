import { createClient, RedisClientType } from "redis";
import { IUserRepository } from "./IUserRepository";

export class RedisUserRepository implements IUserRepository {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    this.client.on("error", (err: any) => {
      console.error("❌ Erro no Redis:", err);
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("📦 Redis conectado com sucesso!");
    }
  }

  async save(user: any): Promise<void> {
    await this.connect();
    await this.client.hSet("users", user.id, JSON.stringify(user));
  }

  async findById(id: string): Promise<any | null> {
    await this.connect();
    const user = await this.client.hGet("users", id);
    return user ? JSON.parse(user) : null;
  }

  async findAll(): Promise<any[]> {
    await this.connect();
    const users = await this.client.hGetAll("users");
    return Object.values(users).map((u) => JSON.parse(u));
  }
}
