import { Recommendation } from "../db.js";
import { generateId } from "../utils/id.js";

const normalizeRecommendation = (recommendation) => {
  if (!recommendation) return null;
  const plain = JSON.parse(JSON.stringify(recommendation));
  plain.id = plain._id;
  return plain;
};

export class recommendationsModel {
  static saveRecommendationModel = async (payload) => {
    const recommendation = Recommendation.create({
      _id: generateId("recommendation"),
      plot_id: payload.plot_id,
      crop_id: payload.crop_id,
      pump_id: payload.pump_id,
      weather_id: payload.weather_id,
      should_irrigate: payload.should_irrigate,
      priority: payload.priority,
      irrigation_time_minutes: payload.irrigation_time_minutes,
      recommended_schedule: payload.recommended_schedule,
      estimated_kwh: payload.estimated_kwh,
      estimated_cost_bs: payload.estimated_cost_bs,
      risk_score: payload.risk_score,
      ai_reasons: payload.ai_reasons,
      recommendation_message: payload.recommendation_message,
      producer_observation: payload.producer_observation,
      created_at: payload.created_at || new Date().toISOString()
    }).save();

    return normalizeRecommendation(recommendation);
  };

  static createRecommendation = async (payload) => {
    return recommendationsModel.saveRecommendationModel(payload);
  };

  static getRecommendationsModel = async () => {
    return Recommendation.find().map(normalizeRecommendation);
  };

  static getRecommendationsByPlotModel = async (plotId) => {
    return Recommendation.find({ plot_id: plotId }).map(normalizeRecommendation);
  };

  static getRecommendations = async () => {
    return Recommendation.find().map(normalizeRecommendation);
  };

  static getRecommendationsByPlot = async (plotId) => {
    return Recommendation.find({ plot_id: plotId }).map(normalizeRecommendation);
  };
}
