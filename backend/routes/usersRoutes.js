import { Router } from "express";

import { userController } from "../controllers/usersController.js";

export const usersRouter = Router();

usersRouter.get("/", userController.getUsers);
