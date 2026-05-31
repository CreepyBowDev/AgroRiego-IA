export const generateIrrigationRecommendation = ({
  crop,
  pump,
  weather,
  soil_moisture_estimated,
  producer_observation
}) => {
  let risk_score = 0;
  const ai_reasons = [];

  const temperature = Number(weather.temperature ?? 0);
  const humidity = Number(weather.humidity ?? 0);
  const rain_probability = Number(weather.rain_probability ?? 0);
  const power_kw = Number(pump.power_kw ?? 0);
  const cost_kwh = Number(pump.cost_kwh ?? 0);
  const drought_sensitivity = String(crop.drought_sensitivity || "").toLowerCase();

  if (temperature >= 32) {
    risk_score += 2;
    ai_reasons.push("temperatura elevada");
  } else if (temperature >= 28) {
    risk_score += 1;
    ai_reasons.push("temperatura moderadamente alta");
  }

  if (humidity < 40) {
    risk_score += 2;
    ai_reasons.push("humedad ambiental baja");
  } else if (humidity < 60) {
    risk_score += 1;
    ai_reasons.push("humedad ambiental media");
  }

  if (soil_moisture_estimated < 30) {
    risk_score += 3;
    ai_reasons.push("humedad del suelo baja");
  } else if (soil_moisture_estimated < 50) {
    risk_score += 1;
    ai_reasons.push("humedad del suelo moderada");
  }

  if (rain_probability > 60) {
    risk_score -= 3;
    ai_reasons.push("alta probabilidad de lluvia");
  }

  if (drought_sensitivity === "alta") {
    risk_score += 1;
    ai_reasons.push("cultivo sensible a sequía");
  }

  let should_irrigate = false;
  let priority = "baja";
  let irrigation_time_minutes = 0;

  if (risk_score >= 5) {
    should_irrigate = true;
    priority = "alta";
    irrigation_time_minutes = 120;
  } else if (risk_score >= 3) {
    should_irrigate = true;
    priority = "media";
    irrigation_time_minutes = 75;
  }

  const estimated_kwh = Number((power_kw * (irrigation_time_minutes / 60)).toFixed(2));
  const estimated_cost_bs = Number((estimated_kwh * cost_kwh).toFixed(2));
  const recommended_schedule = should_irrigate ? "05:00 - 07:00" : "No se recomienda regar por ahora";

  const recommendation_message = `Se recomienda regar con prioridad ${priority}. Factores detectados: ${ai_reasons.join(", ")}. El horario sugerido es temprano para reducir evaporación. Consumo estimado: ${estimated_kwh} kWh. Costo aproximado: Bs ${estimated_cost_bs}.`;

  return {
    should_irrigate,
    priority,
    irrigation_time_minutes,
    recommended_schedule,
    estimated_kwh,
    estimated_cost_bs,
    risk_score,
    ai_reasons,
    recommendation_message,
    producer_observation: producer_observation || ""
  };
};
