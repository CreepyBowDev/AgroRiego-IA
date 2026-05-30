import { Router } from "express";

import { plotsController } from "../controllers/plotsController.js";

const router = Router();

router.post("/", plotController.createPlot);
router.get("/", plotController.getPlots);
router.get("/:id", plotController.getPlotById);

export default router;