import { User, Plot, Crop, Pump, WeatherRecord } from "./db.js";

console.log("🌱 Iniciando la siembra de datos de prueba...");

// 1. Insertar el Productor Demo
User.create({
    _id: 1,
    name: "Productor Demo",
    phone: "77712345",
    zone: "Montero",
    user_type: "pequeño productor"
}).save();

// 2. Insertar Parcela
Plot.create({
    _id: 1,
    user_id: 1,
    name: "Parcela Norte",
    municipality: "Montero",
    community: "Comunidad Demo",
    area_hectares: 3.00,
    soil_type: "Franco arenoso",
    water_source: "Pozo"
}).save();

// 3. Insertar Cultivo
Crop.create({
    _id: 1,
    plot_id: 1,
    crop_name: "Maíz",
    crop_stage: "Crecimiento vegetativo",
    sowing_date: "2026-04-15",
    drought_sensitivity: "Alta"
}).save();

// 4. Insertar Bomba de agua
Pump.create({
    _id: 1,
    plot_id: 1,
    pump_type: "Eléctrica",
    power_kw: 2.50,
    flow_liters_minute: 120.00,
    cost_kwh: 1.20,
    energy_source: "Energía eléctrica"
}).save();

// 5. Insertar Clima Simulado
WeatherRecord.create({
    _id: 1,
    plot_id: 1,
    temperature: 34.00,
    humidity: 35.00,
    rain_probability: 15.00,
    wind_speed: 12.00,
    record_date: new Date().toISOString()
}).save();

console.log("✅ ¡Datos de prueba guardados con éxito!");