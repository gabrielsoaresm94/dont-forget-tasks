import { Request, Response } from "express";
import { CategoryRepositoryFactory } from "../repositories/CategoryRepositoryFactory";
import { TaskRepositoryFactory } from "../repositories/TaskRepositoryFactory";
import { CategoryService } from "../services/CategoryService";

export class CategoryController {
  private service: CategoryService;
  constructor() {
      const taskRepository = TaskRepositoryFactory.create();
      const categoryRepository = CategoryRepositoryFactory.create();
      this.service = new CategoryService(categoryRepository, taskRepository);
  }

  health = (req: Request, res: Response) => res.status(200).json(true);

  listCategories = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({
          _Meta: {
            Message: "Todos os campos são obrigatórios"
          }
        });
      }
      const tasks = await this.service.listCategories(userId);
      return res.status(200).json({
        Data: tasks,
        _Meta: {
          Type: "category.listed",
          UserId: userId,
          OccurredAt: new Date().toISOString()
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

  getCategory = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const categoryId = req.query.CategoryId as string;
      if (!categoryId || !userId) {
        return res.status(400).json({
          _Meta: {
            Message: "Todos os campos são obrigatórios"
          }
        });
      }
      const category = await this.service.getCategory(userId, parseInt(categoryId, 10));
      if (!category) {
        return res.status(404).json({
          _Meta: {
            Message: "Categoria não encontrada"
          }
        });
      }
      return res.status(200).json({
        Data: category,
        _Meta: {
          Type: "category.get",
          UserId: userId,
          OccurredAt: new Date().toISOString()
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
