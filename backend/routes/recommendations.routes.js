import { Router } from "express";
import { recommendationsController } from "../controllers/recommendations.controller.js";

const router = Router();

router.post("/generate", recommendationsController.generateRecommendation);
router.get("/", recommendationsController.getRecommendations);
router.get("/plot/:plotId", recommendationsController.getRecommendationsByPlot);

export default router;
