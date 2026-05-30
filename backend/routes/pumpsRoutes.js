import { Router } from "express";

import { pumpsController } from "../controllers/pumps.controller.js";

const pumpsRouter = Router();

pumpsRouter.post("/", createPump);
pumpsRouter.get("/", getPumps);

// Esta ruta debe ir antes de "/:id"
router.get("/plot/:plotId", getPumpByPlot);

router.get("/:id", getPumpById);

export default router;