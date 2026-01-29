import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getDashboard,
  createTask,
  completeTask,
  deleteTask,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/dashboard", isAuth, getDashboard);
router.post("/tasks", isAuth, createTask);
router.post("/tasks/:id/complete", isAuth, completeTask);
router.post("/tasks/:id/delete", isAuth, deleteTask);

export default router;
