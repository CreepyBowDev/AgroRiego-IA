import { Router } from "express";

import { cropsController } from "../controllers/cropsController.js";

export const cropsRouter = Router();

cropsRouter.post("/", cropsController.createCrop);
cropsRouter.get("/", cropsController.getCrops);

cropsRouter.get("/plot/:plotId", cropsController.getCropsByPlot);

router.get("/:id", cropsController.getCropById);
