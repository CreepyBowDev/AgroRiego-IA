import {
  getPlots,
  getPlotById,
  createCrop,
  getCropsByPlot,
  createPump,
  getPumpByPlot,
  createWeather,
  getLatestWeatherByPlot,
  generateRecommendation,
  getRecommendationsByPlot
} from "./api.js";

// Estado interno
let selectedPlotId = null;
let selectedPlotData = null;
let selectedCropId = null;
let selectedPumpId = null;
let selectedWeatherId = null;

// DOM Elements
const plotSelector = document.getElementById("plotSelector");
const loadPlotButton = document.getElementById("loadPlotButton");
const plotLoadMessage = document.getElementById("plotLoadMessage");

const plotDetailsSection = document.getElementById("plotDetailsSection");
const plotDetailsContent = document.getElementById("plotDetailsContent");

const cropSection = document.getElementById("cropSection");
const cropStatusCard = document.getElementById("cropStatusCard");
const cropFormBlock = document.getElementById("cropFormBlock");
const cropCardContent = document.getElementById("cropCardContent");
const cropName = document.getElementById("cropName");
const cropStage = document.getElementById("cropStage");
const sowingDate = document.getElementById("sowingDate");
const droughtSensitivity = document.getElementById("droughtSensitivity");
const saveCropButton = document.getElementById("saveCropButton");
const cropMessage = document.getElementById("cropMessage");

const pumpSection = document.getElementById("pumpSection");
const pumpStatusCard = document.getElementById("pumpStatusCard");
const pumpFormBlock = document.getElementById("pumpFormBlock");
const pumpCardContent = document.getElementById("pumpCardContent");
const pumpType = document.getElementById("pumpType");
const powerKw = document.getElementById("powerKw");
const flowRate = document.getElementById("flowRate");
const costKwh = document.getElementById("costKwh");
const energySource = document.getElementById("energySource");
const savePumpButton = document.getElementById("savePumpButton");
const pumpMessage = document.getElementById("pumpMessage");

const weatherSection = document.getElementById("weatherSection");
const weatherStatusCard = document.getElementById("weatherStatusCard");
const weatherFormBlock = document.getElementById("weatherFormBlock");
const weatherCardContent = document.getElementById("weatherCardContent");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const rainProbability = document.getElementById("rainProbability");
const windSpeed = document.getElementById("windSpeed");
const recordDate = document.getElementById("recordDate");
const saveWeatherButton = document.getElementById("saveWeatherButton");
const weatherMessage = document.getElementById("weatherMessage");

const recommendationSection = document.getElementById("recommendationSection");
const validationAlerts = document.getElementById("validationAlerts");
const soilMoisture = document.getElementById("soilMoisture");
const producerObservation = document.getElementById("producerObservation");
const generateButton = document.getElementById("generateButton");
const generateMessage = document.getElementById("generateMessage");

const resultSection = document.getElementById("resultSection");
const resultTitle = document.getElementById("resultTitle");
const resultBadge = document.getElementById("resultBadge");
const resultPriority = document.getElementById("resultPriority");
const resultRisk = document.getElementById("resultRisk");
const resultTime = document.getElementById("resultTime");
const resultSchedule = document.getElementById("resultSchedule");
const resultEnergy = document.getElementById("resultEnergy");
const resultCost = document.getElementById("resultCost");
const resultReasonsList = document.getElementById("resultReasonsList");
const resultMessage = document.getElementById("resultMessage");

const historySection = document.getElementById("historySection");
const historyContent = document.getElementById("historyContent");

// Utilidades
const showMessage = (element, text, isSuccess = true) => {
  element.textContent = text;
  element.style.color = isSuccess ? "var(--success)" : "var(--error)";
};

const hideElement = (el) => el.classList.add("hidden");
const showElement = (el) => el.classList.remove("hidden");

// Cargar parcelas
const loadPlots = async () => {
  try {
    const result = await getPlots();
    const plots = result.data || [];
    if (plots.length === 0) {
      plotSelector.innerHTML = "<option value=''>No hay parcelas registradas. Registra una primero.</option>";
      loadPlotButton.disabled = true;
      return;
    }
    plotSelector.innerHTML = "<option value=''>Selecciona una parcela...</option>" +
      plots.map(p => `<option value="${p.id || p._id}">${p.name} (${p.community || p.municipality || "Sin ubicación"})</option>`).join("");
    loadPlotButton.disabled = false;
  } catch (error) {
    plotSelector.innerHTML = "<option value=''>Error al cargar parcelas</option>";
  }
};

// Cargar datos de parcela
const loadPlotDetails = async (plotId) => {
  selectedPlotId = plotId;
  selectedCropId = null;
  selectedPumpId = null;
  selectedWeatherId = null;

  try {
    const result = await getPlotById(plotId);
    selectedPlotData = result.data || result;
    
    // Mostrar detalles
    plotDetailsContent.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">Nombre:</span>
        <span>${selectedPlotData.name}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Municipio:</span>
        <span>${selectedPlotData.municipality || "-"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Comunidad:</span>
        <span>${selectedPlotData.community || "-"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Superficie:</span>
        <span>${selectedPlotData.area_hectares || "-"} ha</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Tipo de suelo:</span>
        <span>${selectedPlotData.soil_type || "-"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Fuente de agua:</span>
        <span>${selectedPlotData.water_source || "-"}</span>
      </div>
    `;
    showElement(plotDetailsSection);
    showMessage(plotLoadMessage, "Parcela cargada correctamente.", true);
    
    // Cargar datos asociados
    await loadCropForPlot(plotId);
    await loadPumpForPlot(plotId);
    await loadWeatherForPlot(plotId);
    await loadHistoryForPlot(plotId);
    
    // Mostrar secciones
    showElement(cropSection);
    showElement(pumpSection);
    showElement(weatherSection);
    showElement(recommendationSection);
    showElement(historySection);
  } catch (error) {
    showMessage(plotLoadMessage, "No se pudo cargar la parcela.", false);
  }
};

// Cargar cultivo para parcela
const loadCropForPlot = async (plotId) => {
  try {
    const result = await getCropsByPlot(plotId);
    const crops = result.data || [];
    if (crops.length > 0) {
      const latestCrop = crops[crops.length - 1];
      selectedCropId = latestCrop.id || latestCrop._id;
      displayCropCard(latestCrop);
    } else {
      hideCropCard();
    }
  } catch (error) {
    hideCropCard();
  }
};

// Cargar bomba para parcela
const loadPumpForPlot = async (plotId) => {
  try {
    const result = await getPumpByPlot(plotId);
    const pumps = result.data || [];
    if (pumps.length > 0) {
      const latestPump = pumps[pumps.length - 1];
      selectedPumpId = latestPump.id || latestPump._id;
      displayPumpCard(latestPump);
    } else {
      hidePumpCard();
    }
  } catch (error) {
    hidePumpCard();
  }
};

// Cargar clima para parcela
const loadWeatherForPlot = async (plotId) => {
  try {
    const result = await getLatestWeatherByPlot(plotId);
    if (result && (result.data || result._id)) {
      const weather = result.data || result;
      selectedWeatherId = weather.id || weather._id;
      displayWeatherCard(weather);
    } else {
      hideWeatherCard();
    }
  } catch (error) {
    hideWeatherCard();
  }
};

// Mostrar tarjeta de cultivo
const displayCropCard = (crop) => {
  hideElement(cropFormBlock);
  showElement(cropStatusCard);
  cropCardContent.innerHTML = `
    <p><strong>Cultivo:</strong> ${crop.crop_name}</p>
    <p><strong>Etapa:</strong> ${crop.crop_stage || "-"}</p>
    <p><strong>Fecha siembra:</strong> ${crop.sowing_date || "-"}</p>
    <p><strong>Sensibilidad:</strong> ${crop.drought_sensitivity || "-"}</p>
  `;
};

const hideCropCard = () => {
  hideElement(cropStatusCard);
  showElement(cropFormBlock);
  selectedCropId = null;
};

// Mostrar tarjeta de bomba
const displayPumpCard = (pump) => {
  hideElement(pumpFormBlock);
  showElement(pumpStatusCard);
  pumpCardContent.innerHTML = `
    <p><strong>Tipo:</strong> ${pump.pump_type}</p>
    <p><strong>Potencia:</strong> ${pump.power_kw} kW</p>
    <p><strong>Flujo:</strong> ${pump.flow_liters_minute} L/min</p>
    <p><strong>Costo:</strong> Bs ${pump.cost_kwh}/kWh</p>
    <p><strong>Fuente:</strong> ${pump.energy_source}</p>
  `;
};

const hidePumpCard = () => {
  hideElement(pumpStatusCard);
  showElement(pumpFormBlock);
  selectedPumpId = null;
};

// Mostrar tarjeta de clima
const displayWeatherCard = (weather) => {
  hideElement(weatherFormBlock);
  showElement(weatherStatusCard);
  weatherCardContent.innerHTML = `
    <p><strong>Temperatura:</strong> ${weather.temperature}°C</p>
    <p><strong>Humedad:</strong> ${weather.humidity}%</p>
    <p><strong>Prob. lluvia:</strong> ${weather.rain_probability}%</p>
    <p><strong>Vel. viento:</strong> ${weather.wind_speed}</p>
    <p><strong>Fecha:</strong> ${weather.record_date || weather.created_at}</p>
  `;
};

const hideWeatherCard = () => {
  hideElement(weatherStatusCard);
  showElement(weatherFormBlock);
  selectedWeatherId = null;
};

// Cargar historial
const loadHistoryForPlot = async (plotId) => {
  try {
    const result = await getRecommendationsByPlot(plotId);
    const recommendations = result.data || [];
    renderHistory(recommendations);
  } catch (error) {
    historyContent.textContent = "No se pudo cargar el historial.";
  }
};

const renderHistory = (recommendations) => {
  if (recommendations.length === 0) {
    historyContent.innerHTML = "<div class='info-card'>No hay recomendaciones para esta parcela aún.</div>";
    return;
  }
  historyContent.innerHTML = recommendations
    .slice(-10)
    .reverse()
    .map(rec => `
      <article class="history-card">
        <div class="history-header">
          <span class="history-decision ${rec.should_irrigate ? "irrigate" : "wait"}">
            ${rec.should_irrigate ? "Regar" : "Esperar"}
          </span>
          <span class="history-priority">${rec.priority}</span>
        </div>
        <p><strong>Riesgo:</strong> ${rec.risk_score}</p>
        <p><strong>Tiempo:</strong> ${rec.irrigation_time_minutes} min</p>
        <p><strong>kWh:</strong> ${rec.estimated_kwh}</p>
        <p><strong>Costo:</strong> Bs ${rec.estimated_cost_bs}</p>
      </article>
    `).join("");
};

// Validar antes de generar recomendación
const validateBeforeGenerate = () => {
  const alerts = [];
  if (!selectedPlotId) alerts.push("Debes seleccionar una parcela.");
  if (!selectedCropId) alerts.push("Falta registrar un cultivo para esta parcela.");
  if (!selectedPumpId) alerts.push("Falta registrar una bomba de riego para esta parcela.");
  if (!selectedWeatherId) alerts.push("Falta registrar datos climáticos para esta parcela.");
  if (!soilMoisture.value) alerts.push("Falta ingresar la humedad estimada del suelo.");
  
  if (alerts.length > 0) {
    validationAlerts.innerHTML = alerts.map(alert => `<div class="alert alert-error">⚠ ${alert}</div>`).join("");
    return false;
  }
  validationAlerts.innerHTML = "";
  return true;
};

// Event Listeners
loadPlotButton.addEventListener("click", async () => {
  if (!plotSelector.value) {
    showMessage(plotLoadMessage, "Selecciona una parcela.", false);
    return;
  }
  await loadPlotDetails(plotSelector.value);
});

saveCropButton.addEventListener("click", async () => {
  if (!selectedPlotId) {
    showMessage(cropMessage, "Selecciona una parcela primero.", false);
    return;
  }
  if (!cropName.value.trim()) {
    showMessage(cropMessage, "El nombre del cultivo es obligatorio.", false);
    return;
  }
  
  try {
    const payload = {
      plot_id: selectedPlotId,
      crop_name: cropName.value.trim(),
      crop_stage: cropStage.value.trim() || "",
      sowing_date: sowingDate.value || new Date().toISOString().slice(0, 10),
      drought_sensitivity: droughtSensitivity.value.trim() || ""
    };
    
    const result = await createCrop(payload);
    const crop = result.crop || result;
    selectedCropId = crop.id || crop._id;
    displayCropCard(crop);
    showMessage(cropMessage, "Cultivo guardado correctamente.", true);
    cropName.value = "";
    cropStage.value = "";
    sowingDate.value = "";
    droughtSensitivity.value = "";
  } catch (error) {
    showMessage(cropMessage, `Error: ${error.message}`, false);
  }
});

savePumpButton.addEventListener("click", async () => {
  if (!selectedPlotId) {
    showMessage(pumpMessage, "Selecciona una parcela primero.", false);
    return;
  }
  if (!pumpType.value.trim() || !powerKw.value) {
    showMessage(pumpMessage, "Tipo y potencia son obligatorios.", false);
    return;
  }
  
  try {
    const payload = {
      plot_id: selectedPlotId,
      pump_type: pumpType.value.trim(),
      power_kw: Number(powerKw.value),
      flow_liters_minute: Number(flowRate.value) || 0,
      cost_kwh: Number(costKwh.value) || 0,
      energy_source: energySource.value.trim() || ""
    };
    
    const result = await createPump(payload);
    const pump = result.pump || result;
    selectedPumpId = pump.id || pump._id;
    displayPumpCard(pump);
    showMessage(pumpMessage, "Bomba guardada correctamente.", true);
    pumpType.value = "";
    powerKw.value = "";
    flowRate.value = "";
    costKwh.value = "";
    energySource.value = "";
  } catch (error) {
    showMessage(pumpMessage, `Error: ${error.message}`, false);
  }
});

saveWeatherButton.addEventListener("click", async () => {
  if (!selectedPlotId) {
    showMessage(weatherMessage, "Selecciona una parcela primero.", false);
    return;
  }
  if (!temperature.value || !humidity.value || !rainProbability.value) {
    showMessage(weatherMessage, "Temperatura, humedad y probabilidad son obligatorios.", false);
    return;
  }
  
  try {
    const payload = {
      plot_id: selectedPlotId,
      temperature: Number(temperature.value),
      humidity: Number(humidity.value),
      rain_probability: Number(rainProbability.value),
      wind_speed: Number(windSpeed.value) || 0,
      record_date: recordDate.value || new Date().toISOString().slice(0, 10)
    };
    
    const result = await createWeather(payload);
    const weather = result.weather || result;
    selectedWeatherId = weather.id || weather._id;
    displayWeatherCard(weather);
    showMessage(weatherMessage, "Clima guardado correctamente.", true);
    temperature.value = "";
    humidity.value = "";
    rainProbability.value = "";
    windSpeed.value = "";
    recordDate.value = "";
  } catch (error) {
    showMessage(weatherMessage, `Error: ${error.message}`, false);
  }
});

generateButton.addEventListener("click", async () => {
  if (!validateBeforeGenerate()) return;
  
  try {
    const payload = {
      plot_id: selectedPlotId,
      crop_id: selectedCropId,
      pump_id: selectedPumpId,
      weather_id: selectedWeatherId,
      soil_moisture_estimated: Number(soilMoisture.value),
      producer_observation: producerObservation.value.trim() || ""
    };
    
    const result = await generateRecommendation(payload);
    let recommendation = result.recommendation || result.data?.recommendation || result;
    
    // Mostrar resultado
    const decision = recommendation.should_irrigate;
    resultTitle.textContent = decision ? "Se recomienda regar" : "No se recomienda regar por ahora";
    resultBadge.textContent = recommendation.priority;
    resultBadge.className = `status-pill priority-${recommendation.priority}`;
    
    resultPriority.textContent = recommendation.priority;
    resultRisk.textContent = `${recommendation.risk_score}`;
    resultTime.textContent = `${recommendation.irrigation_time_minutes} minutos`;
    resultSchedule.textContent = recommendation.recommended_schedule;
    resultEnergy.textContent = `${recommendation.estimated_kwh} kWh`;
    resultCost.textContent = `Bs ${recommendation.estimated_cost_bs}`;
    
    resultReasonsList.innerHTML = (recommendation.ai_reasons || []).map(r => `<li>${r}</li>`).join("");
    resultMessage.textContent = recommendation.recommendation_message || "Sin análisis adicional.";
    
    showElement(resultSection);
    showMessage(generateMessage, "Recomendación generada correctamente.", true);
    
    // Recargar historial
    await loadHistoryForPlot(selectedPlotId);
  } catch (error) {
    showMessage(generateMessage, `Error: ${error.message}`, false);
  }
});

// Iniciar
loadPlots();

  try {
    const result = await createCrop(payload);
    const crop = result.crop || result;
    createdCropId = crop.id || crop._id;
    updateSelectionTexts();
    showMessage(cropMessage, "Cultivo registrado correctamente.", true);
  } catch (error) {
    showMessage(cropMessage, `Error al crear cultivo: ${error.message}`, false);
  }
});

createPumpButton.addEventListener("click", async () => {
  if (!selectedPlotId) {
    showMessage(pumpMessage, "Selecciona una parcela antes de crear la bomba.", false);
    return;
  }
  const pumpType = document.getElementById("pumpType").value.trim();
  const powerKw = Number(document.getElementById("powerKw").value);
  const flowRate = Number(document.getElementById("flowRate").value);
  const costKwh = Number(document.getElementById("costKwh").value);
  const energySource = document.getElementById("energySource").value.trim();

  if (!pumpType || !Number.isFinite(powerKw)) {
    showMessage(pumpMessage, "Tipo de bomba y potencia son obligatorios.", false);
    return;
  }

  const payload = {
    plot_id: selectedPlotId,
    pump_type: pumpType,
    power_kw: powerKw,
    flow_liters_minute: Number.isFinite(flowRate) ? flowRate : 0,
    cost_kwh: Number.isFinite(costKwh) ? costKwh : 0,
    energy_source: energySource
  };

  try {
    const result = await createPump(payload);
    const pump = result.pump || result;
    createdPumpId = pump.id || pump._id;
    updateSelectionTexts();
    showMessage(pumpMessage, "Bomba registrada correctamente.", true);
  } catch (error) {
    showMessage(pumpMessage, `Error al crear bomba: ${error.message}`, false);
  }
});

createWeatherButton.addEventListener("click", async () => {
  if (!selectedPlotId) {
    showMessage(weatherMessage, "Selecciona una parcela antes de crear el clima.", false);
    return;
  }
  const temperature = Number(document.getElementById("temperature").value);
  const humidity = Number(document.getElementById("humidity").value);
  const rainProbability = Number(document.getElementById("rainProbability").value);
  const windSpeed = Number(document.getElementById("windSpeed").value);
  const recordDate = document.getElementById("recordDate").value || new Date().toISOString().slice(0, 10);

  if (!Number.isFinite(temperature) || !Number.isFinite(humidity) || !Number.isFinite(rainProbability)) {
    showMessage(weatherMessage, "Temperatura, humedad y probabilidad de lluvia son obligatorios.", false);
    return;
  }

  const payload = {
    plot_id: selectedPlotId,
    temperature,
    humidity,
    rain_probability: rainProbability,
    wind_speed: Number.isFinite(windSpeed) ? windSpeed : 0,
    record_date: recordDate
  };

  try {
    const result = await createWeather(payload);
    const weather = result.weather || result;
    createdWeatherId = weather.id || weather._id;
    updateSelectionTexts();
    showMessage(weatherMessage, "Clima registrado correctamente.", true);
  } catch (error) {
    showMessage(weatherMessage, `Error al crear clima: ${error.message}`, false);
  }
});

generateRecommendationButton.addEventListener("click", async () => {
  const soilMoisture = Number(document.getElementById("soilMoisture").value);
  const producerObservation = document.getElementById("producerObservation").value.trim();

  if (!selectedPlotId || !createdCropId || !createdPumpId || !createdWeatherId) {
    showMessage(recommendationStatus, "Faltan datos para generar la recomendación.", false);
    return;
  }

  if (!Number.isFinite(soilMoisture)) {
    showMessage(recommendationStatus, "La humedad estimada es obligatoria.", false);
    return;
  }

  const payload = {
    plot_id: selectedPlotId,
    crop_id: createdCropId,
    pump_id: createdPumpId,
    weather_id: createdWeatherId,
    soil_moisture_estimated: soilMoisture,
    producer_observation: producerObservation
  };

  try {
    const result = await generateRecommendation(payload);
    const recommendation = result.recommendation || result;
    showMessage(recommendationStatus, "Recomendación generada correctamente.", true);
    recommendationDecision.textContent = recommendation.should_irrigate ? "Se recomienda regar" : "No se recomienda regar por ahora";
    recommendationDecision.className = `status-pill ${recommendation.should_irrigate ? "status-success" : "status-warning"}`;
    recommendationPriority.textContent = recommendation.priority;
    recommendationRisk.textContent = recommendation.risk_score;
    recommendationTime.textContent = `${recommendation.irrigation_time_minutes} minutos`;
    recommendationSchedule.textContent = recommendation.recommended_schedule;
    recommendationEnergy.textContent = `${recommendation.estimated_kwh} kWh`;
    recommendationCost.textContent = `Bs ${recommendation.estimated_cost_bs}`;
    recommendationReasons.textContent = recommendation.ai_reasons?.join(", ") || "Sin razones";
    recommendationMessage.textContent = recommendation.recommendation_message || "Sin mensaje";
    recommendationResult.classList.remove("hidden");
    await loadHistory();
  } catch (error) {
    showMessage(recommendationStatus, `Error al generar recomendación: ${error.message}`, false);
  }
});

updateSelectionTexts();
loadPlots();
loadHistory();
