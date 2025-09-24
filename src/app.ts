import express from "express";
import { json } from "body-parser";
import tasksRoutes from "./routes";

const app = express();

app.use(json());

app.use("/tasks/v1", tasksRoutes);

export default app;
