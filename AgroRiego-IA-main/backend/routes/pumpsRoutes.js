import { Router } from "express";

import { pumpsController } from "../controllers/pumps.controller.js";

export const pumpsRouter = Router();

pumpsRouter.post("/", pumpsController.create);
pumpsRouter.get("/", pumpsController.getPumps);

pumpsRouter.get("/plot/:plotId", pumpsController.getPumpByPlot);

pumpsRouter.get("/:id", pumpsController.getPumpById);