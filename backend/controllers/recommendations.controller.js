import { plotsModel } from "../models/plots.model.js";
import { cropsModel } from "../models/crops.model.js";
import { pumpsModel } from "../models/pumps.model.js";
import { weatherModel } from "../models/weather.model.js";
import { recommendationsModel } from "../models/recommendations.model.js";
import { generateIrrigationRecommendation } from "../services/irrigation.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class recommendationsController {
  static generateRecommendation = async (req, res) => {
    try {
      const {
        plot_id,
        crop_id,
        pump_id,
        weather_id,
        soil_moisture_estimated,
        producer_observation
      } = req.body;

      if (!plot_id || !crop_id || !pump_id || !weather_id) {
        return sendError(res, 400, "plot_id, crop_id, pump_id y weather_id son obligatorios");
      }

      if (soil_moisture_estimated === undefined) {
        return sendError(res, 400, "soil_moisture_estimated es obligatorio");
      }

      const isPlaceholderId = (value) => typeof value === "string" && value.includes("PEGAR_ID");
      if (
        isPlaceholderId(plot_id) ||
        isPlaceholderId(crop_id) ||
        isPlaceholderId(pump_id) ||
        isPlaceholderId(weather_id)
      ) {
        return sendError(
          res,
          400,
          "Reemplaza plot_id, crop_id, pump_id y weather_id con IDs reales en api.http antes de llamar a /recommendations/generate"
        );
      }

      const estimatedSoilMoisture = Number(soil_moisture_estimated);
      if (Number.isNaN(estimatedSoilMoisture)) {
        return sendError(res, 400, "soil_moisture_estimated debe ser un número válido");
      }

      const plot = await plotsModel.getPlotById(plot_id);
      const crop = await cropsModel.getCropById(crop_id);
      const pump = await pumpsModel.getPumpById(pump_id);
      const weather = await weatherModel.getWeatherById(weather_id);

      if (!plot) {
        return sendError(res, 404, "Parcela no encontrada");
      }
      if (!crop) {
        return sendError(res, 404, "Cultivo no encontrado");
      }
      if (!pump) {
        return sendError(res, 404, "Bomba no encontrada");
      }
      if (!weather) {
        return sendError(res, 404, "Registro climatico no encontrado");
      }

      const aiPayload = {
        crop: {
          id: crop.id,
          crop_name: crop.crop_name,
          crop_stage: crop.crop_stage,
          drought_sensitivity: crop.drought_sensitivity
        },
        pump: {
          id: pump.id,
          pump_type: pump.pump_type,
          power_kw: pump.power_kw,
          flow_liters_minute: pump.flow_liters_minute,
          cost_kwh: pump.cost_kwh,
          energy_source: pump.energy_source
        },
        weather: {
          id: weather.id,
          temperature: weather.temperature,
          humidity: weather.humidity,
          rain_probability: weather.rain_probability,
          wind_speed: weather.wind_speed
        },
        soil_moisture_estimated: estimatedSoilMoisture,
        producer_observation: producer_observation || ""
      };

      const aiResponse = generateIrrigationRecommendation(aiPayload);

      const recommendation = await recommendationsModel.saveRecommendationModel({
        plot_id,
        crop_id,
        pump_id,
        weather_id,
        should_irrigate: aiResponse.should_irrigate,
        priority: aiResponse.priority,
        irrigation_time_minutes: aiResponse.irrigation_time_minutes,
        recommended_schedule: aiResponse.recommended_schedule,
        estimated_kwh: aiResponse.estimated_kwh,
        estimated_cost_bs: aiResponse.estimated_cost_bs,
        risk_score: aiResponse.risk_score,
        ai_reasons: aiResponse.ai_reasons,
        recommendation_message: aiResponse.recommendation_message,
        producer_observation: producer_observation || "",
        created_at: new Date().toISOString()
      });

      return res.status(201).json({
        message: "Recomendacion generada correctamente",
        plot,
        crop,
        pump,
        weather,
        recommendation
      });
    } catch (error) {
      return sendError(res, 500, "Error al generar recomendación", error);
    }
  };

  static getRecommendations = async (req, res) => {
    try {
      const recommendations = await recommendationsModel.getRecommendations();
      return sendSuccess(res, "Recomendaciones obtenidas correctamente", { data: recommendations });
    } catch (error) {
      return sendError(res, 500, "Error al obtener recomendaciones", error);
    }
  };

  static getRecommendationsByPlot = async (req, res) => {
    try {
      const { plotId } = req.params;
      const recommendations = await recommendationsModel.getRecommendationsByPlot(plotId);
      return sendSuccess(res, "Recomendaciones de la parcela obtenidas correctamente", { data: recommendations });
    } catch (error) {
      return sendError(res, 500, "Error al obtener recomendaciones por parcela", error);
    }
  };
}
