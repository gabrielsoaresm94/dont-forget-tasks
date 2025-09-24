import { Router } from "express";
import { TaskController } from "./controllers/TaskController";

const router = Router();
const controller = new TaskController();

router.get("/", controller.health);
router.post("/", controller.createTask);

export default router;
