import { Router } from "express";
import { pumpsController } from "../controllers/pumps.controller.js";

const router = Router();

router.post("/", pumpsController.createPump);
router.get("/", pumpsController.getPumps);
router.get("/plot/:plotId", pumpsController.getPumpsByPlot);
router.get("/:id", pumpsController.getPumpById);

export default router;
