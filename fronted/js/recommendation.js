import {
    getPlots,
    getCropsByPlot,
    getPumpsByPlot,
    getLatestWeatherByPlot,
    getRecommendationsByPlot,
    createCrop,
    createPump,
    createWeather,
    generateRecommendation
} from "./api.js";

const recommendationForm = document.getElementById("recommendationForm");
const plotSelect = document.getElementById("plot_id");
const message = document.getElementById("message");
const resultCard = document.getElementById("resultCard");
const recommendationResult = document.getElementById("recommendationResult");
const sowingDateInput = document.getElementById("sowing_date");

const plotInfo = document.getElementById("plotInfo");
const cropInfo = document.getElementById("cropInfo");
const pumpInfo = document.getElementById("pumpInfo");
const weatherInfo = document.getElementById("weatherInfo");
const historyList = document.getElementById("historyList");

let selectedPlotId = null;
let selectedCropId = null;
let selectedPumpId = null;
let selectedWeatherId = null;
let plotsStore = [];

if (sowingDateInput) {
    sowingDateInput.value = new Date().toISOString().split("T")[0];
}

function getResponseData(response, key) {
    if (!response) return null;

    if (key && response[key]) {
        return response[key];
    }

    if (response.data && key && response.data[key]) {
        return response.data[key];
    }

    if (response.data) {
        return response.data;
    }

    return response;
}

function normalizeArrayResponse(response, key) {
    const data = getResponseData(response, key);

    if (Array.isArray(data)) {
        return data;
    }

    if (data && typeof data === "object" && !data.success) {
        return [data];
    }

    return [];
}

function normalizeSingleResponse(response, key) {
    if (!response || response.success === false) {
        return null;
    }

    const data = getResponseData(response, key);

    if (Array.isArray(data)) {
        return data.length > 0 ? data[data.length - 1] : null;
    }

    if (data && typeof data === "object") {
        return data;
    }

    return null;
}

function showMessage(text, type = "") {
    if (!message) return;

    message.textContent = text;
    message.className = type;
}

function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatNumber(value, decimals = 2) {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "-";
    }

    return number.toFixed(decimals);
}

function getPriorityBadgeClass(priority = "") {
    const normalized = String(priority).toLowerCase();

    if (normalized === "alta") return "badge-danger";
    if (normalized === "media") return "badge-warning";
    return "badge-success";
}

function renderEmptyCard(container, icon, text) {
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state compact">
            <span>${icon}</span>
            <p>${text}</p>
        </div>
    `;
}

function resetSelectedData() {
    selectedCropId = null;
    selectedPumpId = null;
    selectedWeatherId = null;
}

function clearPlotDetails() {
    selectedPlotId = null;
    resetSelectedData();

    renderEmptyCard(plotInfo, "📍", "Seleccione una parcela para ver sus datos.");
    renderEmptyCard(cropInfo, "🌽", "Aún no hay cultivo cargado.");
    renderEmptyCard(pumpInfo, "⚡", "Aún no hay bomba cargada.");
    renderEmptyCard(weatherInfo, "☀️", "Aún no hay clima cargado.");
    renderEmptyCard(historyList, "📋", "Selecciona una parcela para ver el historial.");

    if (resultCard) {
        resultCard.hidden = true;
    }

    showMessage("", "");
}

function findSelectedPlot(plotId) {
    return plotsStore.find((plot) => plot.id === plotId) || null;
}

function renderPlotInfo(plot) {
    if (!plot) {
        renderEmptyCard(plotInfo, "📍", "No se pudo cargar la información de la parcela.");
        return;
    }

    plotInfo.innerHTML = `
        <span class="tag">Parcela activa</span>
        <h3>📍 ${plot.name || "Parcela sin nombre"}</h3>
        <p><strong>Municipio:</strong> ${plot.municipality || "-"}</p>
        <p><strong>Comunidad:</strong> ${plot.community || "-"}</p>
        <p><strong>Superficie:</strong> ${plot.area_hectares ?? "-"} ha</p>
        <p><strong>Suelo:</strong> ${plot.soil_type || "-"}</p>
        <p><strong>Agua:</strong> ${plot.water_source || "-"}</p>
    `;
}

function renderCropInfo(crop) {
    if (!crop) {
        renderEmptyCard(cropInfo, "🌽", "Aún no hay cultivo registrado para esta parcela.");
        return;
    }

    selectedCropId = crop.id;

    cropInfo.innerHTML = `
        <span class="tag">Cultivo cargado</span>
        <h3>🌽 ${crop.crop_name || "Cultivo"}</h3>
        <p><strong>Etapa:</strong> ${crop.crop_stage || "-"}</p>
        <p><strong>Siembra:</strong> ${crop.sowing_date || "-"}</p>
        <p><strong>Sensibilidad:</strong> ${crop.drought_sensitivity || "-"}</p>
    `;
}

function renderPumpInfo(pump) {
    if (!pump) {
        renderEmptyCard(pumpInfo, "⚡", "Aún no hay bomba registrada para esta parcela.");
        return;
    }

    selectedPumpId = pump.id;

    pumpInfo.innerHTML = `
        <span class="tag">Bomba cargada</span>
        <h3>⚡ ${pump.pump_type || "Bomba"}</h3>
        <p><strong>Potencia:</strong> ${formatNumber(pump.power_kw, 1)} kW</p>
        <p><strong>Caudal:</strong> ${formatNumber(pump.flow_liters_minute, 0)} L/min</p>
        <p><strong>Costo kWh:</strong> Bs ${formatNumber(pump.cost_kwh, 2)}</p>
        <p><strong>Energía:</strong> ${pump.energy_source || "-"}</p>
    `;
}

function renderWeatherInfo(weather) {
    if (!weather) {
        renderEmptyCard(weatherInfo, "☀️", "Aún no hay datos climáticos registrados para esta parcela.");
        return;
    }

    selectedWeatherId = weather.id;

    weatherInfo.innerHTML = `
        <span class="tag">Clima cargado</span>
        <h3>☀️ Registro climático</h3>
        <p><strong>Temperatura:</strong> ${formatNumber(weather.temperature, 1)} °C</p>
        <p><strong>Humedad:</strong> ${formatNumber(weather.humidity, 0)} %</p>
        <p><strong>Lluvia:</strong> ${formatNumber(weather.rain_probability, 0)} %</p>
        <p><strong>Viento:</strong> ${formatNumber(weather.wind_speed, 1)} km/h</p>
    `;
}

async function loadPlots() {
    if (!plotSelect) return;

    const response = await getPlots();

    if (response.success === false) {
        plotSelect.innerHTML = `<option value="">No se pudieron cargar parcelas</option>`;
        clearPlotDetails();
        return;
    }

    const plots = getResponseData(response, "plots") || [];
    plotsStore = Array.isArray(plots) ? plots : [];

    plotSelect.innerHTML = "";

    if (plotsStore.length === 0) {
        plotSelect.innerHTML = `<option value="">Primero registra una parcela</option>`;
        clearPlotDetails();
        return;
    }

    plotSelect.innerHTML = `<option value="">Selecciona una parcela</option>`;

    plotsStore.forEach((plot) => {
        const option = document.createElement("option");
        option.value = plot.id;
        option.textContent = `${plot.name || "Parcela"} · ${plot.municipality || "Sin municipio"}`;
        plotSelect.appendChild(option);
    });

    clearPlotDetails();
}

async function loadPlotData(plotId, options = {}) {
    const { keepResult = false } = options;

    selectedPlotId = plotId;
    resetSelectedData();

    if (!keepResult && resultCard) {
        resultCard.hidden = true;
    }

    showMessage("", "");

    renderEmptyCard(plotInfo, "⏳", "Cargando información de la parcela...");
    renderEmptyCard(cropInfo, "⏳", "Cargando cultivo...");
    renderEmptyCard(pumpInfo, "⏳", "Cargando bomba...");
    renderEmptyCard(weatherInfo, "⏳", "Cargando clima...");
    renderEmptyCard(historyList, "⏳", "Cargando historial...");

    const selectedPlot = findSelectedPlot(plotId);
    renderPlotInfo(selectedPlot);

    const [
        cropsResponse,
        pumpsResponse,
        weatherResponse,
        historyResponse
    ] = await Promise.all([
        getCropsByPlot(plotId),
        getPumpsByPlot(plotId),
        getLatestWeatherByPlot(plotId),
        getRecommendationsByPlot(plotId)
    ]);

    const crops = normalizeArrayResponse(cropsResponse, "crops");
    const latestCrop = crops.length > 0 ? crops[crops.length - 1] : null;
    renderCropInfo(latestCrop);

    const pump = normalizeSingleResponse(pumpsResponse, "pump")
        || normalizeSingleResponse(pumpsResponse, "pumps");
    renderPumpInfo(pump);

    const weather = normalizeSingleResponse(weatherResponse, "weather");
    renderWeatherInfo(weather);

    renderHistory(historyResponse);
}

function renderHistory(historyResponse) {
    if (!historyList) return;

    if (historyResponse?.success === false) {
        renderEmptyCard(historyList, "📋", "No hay recomendaciones registradas para esta parcela.");
        return;
    }

    const recommendations = getResponseData(historyResponse, "recommendations") || [];

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
        renderEmptyCard(historyList, "📋", "No hay recomendaciones registradas para esta parcela.");
        return;
    }

    historyList.innerHTML = "";

    [...recommendations].reverse().forEach((recommendation) => {
        const item = document.createElement("article");
        item.classList.add("history-item");

        const decisionText = recommendation.should_irrigate ? "Regar" : "Esperar";
        const decisionClass = recommendation.should_irrigate ? "badge-success" : "badge-warning";

        item.innerHTML = `
            <div class="history-top">
                <span class="badge ${decisionClass}">
                    ${decisionText}
                </span>

                <span class="history-date">
                    ${formatDate(recommendation.created_at)}
                </span>
            </div>

            <div class="history-metrics">
                <div>
                    <span>Prioridad</span>
                    <strong>${recommendation.priority || "-"}</strong>
                </div>

                <div>
                    <span>Tiempo</span>
                    <strong>${recommendation.irrigation_time_minutes ?? "-"} min</strong>
                </div>

                <div>
                    <span>Costo</span>
                    <strong>Bs ${formatNumber(recommendation.estimated_cost_bs, 2)}</strong>
                </div>
            </div>

            <p>
                ${recommendation.recommendation_message || "Sin mensaje registrado."}
            </p>
        `;

        historyList.appendChild(item);
    });
}

if (plotSelect) {
    plotSelect.addEventListener("change", async () => {
        if (!plotSelect.value) {
            clearPlotDetails();
            return;
        }

        await loadPlotData(plotSelect.value);
    });
}

if (recommendationForm) {
    recommendationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!selectedPlotId) {
            showMessage("❌ Debes seleccionar una parcela antes de generar la recomendación.", "error");
            return;
        }

        const soilMoistureValue = document.getElementById("soil_moisture_estimated").value;
        const soilMoisture = soilMoistureValue !== "" ? Number(soilMoistureValue) : NaN;
        const producerObservation = document.getElementById("producer_observation").value.trim();

        if (soilMoistureValue === "" || Number.isNaN(soilMoisture)) {
            showMessage("❌ Debes ingresar la humedad estimada del suelo.", "error");
            return;
        }

        showMessage("⏳ Preparando datos para la IA...", "loading");

        try {
            if (!selectedCropId) {
                const cropData = {
                    plot_id: selectedPlotId,
                    crop_name: document.getElementById("crop_name").value.trim(),
                    crop_stage: document.getElementById("crop_stage").value.trim(),
                    sowing_date: document.getElementById("sowing_date").value,
                    drought_sensitivity: document.getElementById("drought_sensitivity").value
                };

                if (!cropData.crop_name) {
                    showMessage("❌ Falta registrar el nombre del cultivo.", "error");
                    return;
                }

                const cropResponse = await createCrop(cropData);

                if (cropResponse.success === false) {
                    showMessage(`❌ No se pudo guardar el cultivo. ${cropResponse.message || ""}`, "error");
                    return;
                }

                const crop = getResponseData(cropResponse, "crop");
                selectedCropId = crop?.id;
                renderCropInfo(crop);
            }

            if (!selectedPumpId) {
                const pumpData = {
                    plot_id: selectedPlotId,
                    pump_type: document.getElementById("pump_type").value.trim(),
                    power_kw: Number(document.getElementById("power_kw").value),
                    flow_liters_minute: Number(document.getElementById("flow_liters_minute").value),
                    cost_kwh: Number(document.getElementById("cost_kwh").value),
                    energy_source: document.getElementById("energy_source").value.trim()
                };

                if (!pumpData.power_kw || Number.isNaN(pumpData.power_kw)) {
                    showMessage("❌ Falta registrar la potencia de la bomba.", "error");
                    return;
                }

                const pumpResponse = await createPump(pumpData);

                if (pumpResponse.success === false) {
                    showMessage(`❌ No se pudo guardar la bomba. ${pumpResponse.message || ""}`, "error");
                    return;
                }

                const pump = getResponseData(pumpResponse, "pump");
                selectedPumpId = pump?.id;
                renderPumpInfo(pump);
            }

            if (!selectedWeatherId) {
                const weatherData = {
                    plot_id: selectedPlotId,
                    temperature: Number(document.getElementById("temperature").value),
                    humidity: Number(document.getElementById("humidity").value),
                    rain_probability: Number(document.getElementById("rain_probability").value),
                    wind_speed: Number(document.getElementById("wind_speed").value),
                    record_date: new Date().toISOString().split("T")[0]
                };

                if (Number.isNaN(weatherData.temperature)) {
                    showMessage("❌ Falta registrar la temperatura.", "error");
                    return;
                }

                if (Number.isNaN(weatherData.humidity)) {
                    showMessage("❌ Falta registrar la humedad ambiental.", "error");
                    return;
                }

                if (Number.isNaN(weatherData.rain_probability)) {
                    showMessage("❌ Falta registrar la probabilidad de lluvia.", "error");
                    return;
                }

                const weatherResponse = await createWeather(weatherData);

                if (weatherResponse.success === false) {
                    showMessage(`❌ No se pudo guardar el clima. ${weatherResponse.message || ""}`, "error");
                    return;
                }

                const weather = getResponseData(weatherResponse, "weather");
                selectedWeatherId = weather?.id;
                renderWeatherInfo(weather);
            }

            if (!selectedCropId) {
                showMessage("❌ Falta registrar un cultivo para esta parcela.", "error");
                return;
            }

            if (!selectedPumpId) {
                showMessage("❌ Falta registrar una bomba de riego para esta parcela.", "error");
                return;
            }

            if (!selectedWeatherId) {
                showMessage("❌ Falta registrar datos climáticos para esta parcela.", "error");
                return;
            }

            showMessage("⏳ Generando recomendación inteligente...", "loading");

            const recommendationData = {
                plot_id: selectedPlotId,
                crop_id: selectedCropId,
                pump_id: selectedPumpId,
                weather_id: selectedWeatherId,
                soil_moisture_estimated: soilMoisture,
                producer_observation: producerObservation
            };

            const recommendationResponse = await generateRecommendation(recommendationData);

            if (recommendationResponse.success === false) {
                showMessage(`❌ No se pudo generar la recomendación. ${recommendationResponse.message || ""}`, "error");
                return;
            }

            const recommendation = getResponseData(recommendationResponse, "recommendation");

            if (!recommendation) {
                showMessage("❌ La recomendación no llegó con el formato esperado.", "error");
                return;
            }

            showRecommendation(recommendation);
            showMessage("✅ Recomendación generada correctamente.", "success");

            const historyResponse = await getRecommendationsByPlot(selectedPlotId);
            renderHistory(historyResponse);
        } catch (error) {
            console.error(error);
            showMessage("❌ No se pudo completar la operación. Revisa la consola.", "error");
        }
    });
}

function showRecommendation(recommendation) {
    if (!resultCard || !recommendationResult) return;

    resultCard.hidden = false;

    const shouldIrrigateText = recommendation.should_irrigate
        ? "Se recomienda regar"
        : "No se recomienda regar por ahora";

    const decisionIcon = recommendation.should_irrigate ? "💧" : "⏳";

    const reasons = Array.isArray(recommendation.ai_reasons) && recommendation.ai_reasons.length > 0
        ? recommendation.ai_reasons.map((reason) => `<li>${reason}</li>`).join("")
        : null;

    recommendationResult.innerHTML = `
        <div class="resultado-principal">
            <h2>${decisionIcon} ${shouldIrrigateText}</h2>
            <p>
                Prioridad:
                <strong>${recommendation.priority || "-"}</strong>
            </p>
        </div>

        <div class="grid-resultados">
            <div class="dato">
                <span>Riesgo hídrico</span>
                <strong>${recommendation.risk_score ?? "-"}</strong>
            </div>

            <div class="dato">
                <span>Tiempo recomendado</span>
                <strong>${recommendation.irrigation_time_minutes ?? "-"} min</strong>
            </div>

            <div class="dato">
                <span>Horario recomendado</span>
                <strong>${recommendation.recommended_schedule || "-"}</strong>
            </div>

            <div class="dato">
                <span>Consumo estimado</span>
                <strong>${formatNumber(recommendation.estimated_kwh, 2)} kWh</strong>
            </div>

            <div class="dato">
                <span>Costo aproximado</span>
                <strong>Bs ${formatNumber(recommendation.estimated_cost_bs, 2)}</strong>
            </div>

            <div class="dato">
                <span>Prioridad</span>
                <strong>
                    <span class="badge ${getPriorityBadgeClass(recommendation.priority)}">
                        ${recommendation.priority || "-"}
                    </span>
                </strong>
            </div>
        </div>

        <div class="explicacion">
            <h3>Razones detectadas por la IA</h3>

            ${reasons
            ? `<ul>${reasons}</ul>`
            : "<p>Sin razones registradas.</p>"
        }

            <p>
                <strong>Mensaje IA:</strong>
                ${recommendation.recommendation_message || "Sin mensaje registrado."}
            </p>
        </div>
    `;

    resultCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

loadPlots();