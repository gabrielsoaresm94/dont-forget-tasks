export interface ITaskRepository {
  save(task: any): Promise<void>;
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
}
