import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { TaskRepositoryFactory } from "../repositories/TaskRepositoryFactory";
import { CategoryRepositoryFactory } from "../repositories/CategoryRepositoryFactory";

export class TaskController {
  private service: TaskService;
  constructor() {
    const taskRepository = TaskRepositoryFactory.create();
    const categoryRepository = CategoryRepositoryFactory.create();
    this.service = new TaskService(taskRepository, categoryRepository);
  }

  health = (res: Response) => res.status(200).json(true);

  listTasks = async (req: Request, res: Response) => {
    try {
      const categoryId = req.query!!.categoryId && 
        typeof req.query.categoryId == 'string' ? parseInt(req.query.categoryId) : undefined;
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({
          _Meta: {
            Message: "Campo para consulta é obrigatório"
          }
        });
      }
      const tasks = await this.service.listTasks(userId, categoryId);
      return res.status(200).json({
        Data: tasks,
        _Meta: {
          Type: "task.listed",
          UserId: userId,
          OccurredAt: new Date().toISOString(),
        }
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        _Meta: {
          Error: error.message
        }
      });
    }
  };

  getTask = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const taskId = req.query.taskId as string;
      if (!taskId || !userId) {
        return res.status(400).json({
          _Meta: {
            Message: "Todos os campos são obrigatórios"
          }
        });
      }
      const task = await this.service.getTask(parseInt(taskId), userId);
      if (!task) {
        return res.status(404).json({
          _Meta: {
            Message: "Task não encontrada"
          }
        });
      }
      return res.status(200).json({
        Data: task,
        _Meta: {
          Type: "task.get",
          UserId: userId,
          OccurredAt: new Date().toISOString(),
        }
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        _Meta: {
          Error: error.message
        }
      });
    }
  };
}
