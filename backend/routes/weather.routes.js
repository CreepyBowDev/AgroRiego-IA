import { Router } from "express";
import { weatherController } from "../controllers/weather.controller.js";

const router = Router();

router.post("/", weatherController.createWeather);
router.get("/", weatherController.getWeatherRecords);
router.get("/latest/:plotId", weatherController.getLatestWeatherByPlot);
router.get("/:id", weatherController.getWeatherById);

export default router;
