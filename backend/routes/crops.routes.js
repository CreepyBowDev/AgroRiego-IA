import { Router } from "express";
import { cropsController } from "../controllers/crops.controller.js";

const router = Router();

router.post("/", cropsController.createCrop);
router.get("/", cropsController.getCrops);
router.get("/plot/:plotId", cropsController.getCropsByPlot);
router.get("/:id", cropsController.getCropById);

export default router;
