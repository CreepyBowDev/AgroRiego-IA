import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dbLocal from "db-local";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "database", "data");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

const { Schema } = new dbLocal({ path: dataPath });

// 1. Usuarios (Productores)
export const User = Schema("User", {
  _id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  zone: { type: String },
  user_type: { type: String },
  created_at: { type: String }
});

// 2. Parcelas
export const Plot = Schema("Plot", {
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  municipality: { type: String },
  community: { type: String },
  area_hectares: { type: Number },
  soil_type: { type: String },
  water_source: { type: String },
  created_at: { type: String }
});

// 3. Cultivos
export const Crop = Schema("Crop", {
  _id: { type: String, required: true },
  plot_id: { type: String, required: true },
  crop_name: { type: String, required: true },
  crop_stage: { type: String },
  sowing_date: { type: String },
  drought_sensitivity: { type: String },
  created_at: { type: String }
});

// 4. Bombas de Agua
export const Pump = Schema("Pump", {
  _id: { type: String, required: true },
  plot_id: { type: String, required: true },
  pump_type: { type: String },
  power_kw: { type: Number },
  flow_liters_minute: { type: Number },
  cost_kwh: { type: Number },
  energy_source: { type: String },
  created_at: { type: String }
});

// 5. Registros Climaticos
export const WeatherRecord = Schema("WeatherRecord", {
  _id: { type: String, required: true },
  plot_id: { type: String, required: true },
  temperature: { type: Number },
  humidity: { type: Number },
  rain_probability: { type: Number },
  wind_speed: { type: Number },
  record_date: { type: String },
  created_at: { type: String }
});

// 6. Recomendaciones de la IA
export const Recommendation = Schema("Recommendation", {
  _id: { type: String, required: true },
  plot_id: { type: String },
  crop_id: { type: String },
  pump_id: { type: String },
  weather_id: { type: String },
  should_irrigate: { type: Boolean },
  priority: { type: String },
  irrigation_time_minutes: { type: Number },
  recommended_schedule: { type: String },
  estimated_kwh: { type: Number },
  estimated_cost_bs: { type: Number },
  risk_score: { type: Number },
  ai_reasons: Array,
  recommendation_message: { type: String },
  producer_observation: { type: String },
  created_at: { type: String }
});
