import { Router } from "express";

import { plotsController } from "../controllers/plotsController.js";

const router = Router();

router.post("/", plotsController.createPlot);
router.get("/", plotsController.getPlots);
router.get("/:id", plotsController.getPlotById);

export default router;