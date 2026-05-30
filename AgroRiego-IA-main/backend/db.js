import dbLocal from "db-local";
const { Schema } = new dbLocal({ path: "./database/data" });

// 1. Usuarios (Productores)
export const User = Schema("User", {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    zone: { type: String },
    user_type: { type: String }
});

// 2. Parcelas
export const Plot = Schema("Plot", {
    _id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    name: { type: String, required: true },
    municipality: { type: String },
    community: { type: String },
    area_hectares: { type: Number },
    soil_type: { type: String },
    water_source: { type: String }
});

// 3. Cultivos
export const Crop = Schema("Crop", {
    _id: { type: Number, required: true },
    plot_id: { type: Number, required: true },
    crop_name: { type: String, required: true },
    crop_stage: { type: String },
    sowing_date: { type: String },
    drought_sensitivity: { type: String }
});

// 4. Bombas de Agua
export const Pump = Schema("Pump", {
    _id: { type: Number, required: true },
    plot_id: { type: Number, required: true },
    pump_type: { type: String },
    power_kw: { type: Number },
    flow_liters_minute: { type: Number },
    cost_kwh: { type: Number },
    energy_source: { type: String }
});

// 5. Registros Climáticos
export const WeatherRecord = Schema("WeatherRecord", {
    _id: { type: Number, required: true },
    plot_id: { type: Number, required: true },
    temperature: { type: Number },
    humidity: { type: Number },
    rain_probability: { type: Number },
    wind_speed: { type: Number },
    record_date: { type: String }
});

// 6. Recomendaciones de la IA
export const Recommendation = Schema("Recommendation", {
    _id: { type: Number, required: true },
    plot_id: { type: Number },
    crop_id: { type: Number },
    pump_id: { type: Number },
    should_irrigate: { type: Boolean },
    priority: { type: String },
    irrigation_time_minutes: { type: Number },
    recommended_schedule: { type: String },
    estimated_kwh: { type: Number },
    estimated_cost_bs: { type: Number },
    recommendation_message: { type: String },
    date: { type: String }
});