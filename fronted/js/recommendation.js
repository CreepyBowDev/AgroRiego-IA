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

sowingDateInput.value = new Date().toISOString().split("T")[0];

function getResponseData(response, key) {
    return response.data || response[key] || response;
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

function clearPlotDetails() {
    selectedPlotId = null;
    selectedCropId = null;
    selectedPumpId = null;
    selectedWeatherId = null;
    plotInfo.innerHTML = "<p>Seleccione una parcela para ver los datos guardados.</p>";
    cropInfo.innerHTML = "";
    pumpInfo.innerHTML = "";
    weatherInfo.innerHTML = "";
    historyList.innerHTML = "<p>Selecciona una parcela para ver el historial.</p>";
    resultCard.style.display = "none";
}

async function loadPlots() {
    const response = await getPlots();
    const plots = response.data || response.plots || response || [];

    plotSelect.innerHTML = "";

    if (!Array.isArray(plots) || plots.length === 0) {
        plotSelect.innerHTML = `<option value="">Primero registra una parcela</option>`;
        clearPlotDetails();
        return;
    }

    plotSelect.innerHTML = `<option value="">Selecciona una parcela</option>`;
    plots.forEach((plot) => {
        const option = document.createElement("option");
        option.value = plot.id;
        option.textContent = `${plot.name} - ${plot.municipality}`;
        plotSelect.appendChild(option);
    });

    clearPlotDetails();
}

async function loadPlotData(plotId) {
    selectedPlotId = plotId;
    selectedCropId = null;
    selectedPumpId = null;
    selectedWeatherId = null;
    resultCard.style.display = "none";
    plotInfo.innerHTML = "<p>Cargando datos de la parcela...</p>";
    cropInfo.innerHTML = "";
    pumpInfo.innerHTML = "";
    weatherInfo.innerHTML = "";
    historyList.innerHTML = "<p>Cargando historial...</p>";
    showMessage("", "");

    const [cropsResponse, pumpsResponse, weatherResponse, historyResponse] = await Promise.all([
        getCropsByPlot(plotId),
        getPumpsByPlot(plotId),
        getLatestWeatherByPlot(plotId),
        getRecommendationsByPlot(plotId)
    ]);

    const crops = Array.isArray(cropsResponse.data)
        ? cropsResponse.data
        : cropsResponse.data || cropsResponse || [];

    const pumps = Array.isArray(pumpsResponse.data)
        ? pumpsResponse.data
        : pumpsResponse.data || pumpsResponse || [];

    plotInfo.innerHTML = `<p>Parcela seleccionada: <strong>${plotSelect.selectedOptions[0]?.text || plotId}</strong></p>`;

    if (Array.isArray(crops) && crops.length > 0) {
        const latestCrop = crops[crops.length - 1];
        selectedCropId = latestCrop.id;
        cropInfo.innerHTML = `
            <p><strong>Cultivo cargado:</strong> ${latestCrop.crop_name}</p>
            <p><strong>Etapa:</strong> ${latestCrop.crop_stage}</p>
            <p><strong>Siembra:</strong> ${latestCrop.sowing_date}</p>
            <p><strong>Sensibilidad a sequía:</strong> ${latestCrop.drought_sensitivity}</p>
        `;
    } else {
        cropInfo.innerHTML = "<p>Aún no hay cultivo registrado.</p>";
    }

    if (Array.isArray(pumps) && pumps.length > 0) {
        const latestPump = pumps[pumps.length - 1];
        selectedPumpId = latestPump.id;
        pumpInfo.innerHTML = `
            <p><strong>Bomba cargada:</strong> ${latestPump.pump_type}</p>
            <p><strong>Potencia:</strong> ${latestPump.power_kw} kW</p>
            <p><strong>Caudal:</strong> ${latestPump.flow_liters_minute} L/min</p>
            <p><strong>Costo kWh:</strong> Bs ${latestPump.cost_kwh}</p>
        `;
    } else {
        pumpInfo.innerHTML = "<p>Aún no hay bomba registrada.</p>";
    }

    if (weatherResponse.success === false) {
        weatherInfo.innerHTML = "<p>Aún no hay clima registrado.</p>";
    } else {
        const weather = getResponseData(weatherResponse, "data");
        selectedWeatherId = weather.id;
        weatherInfo.innerHTML = `
            <p><strong>Clima cargado:</strong></p>
            <p><strong>Temperatura:</strong> ${weather.temperature} °C</p>
            <p><strong>Humedad:</strong> ${weather.humidity} %</p>
            <p><strong>Probabilidad de lluvia:</strong> ${weather.rain_probability} %</p>
            <p><strong>Viento:</strong> ${weather.wind_speed} km/h</p>
        `;
    }

    if (historyResponse.success === false || !Array.isArray(historyResponse.data) || historyResponse.data.length === 0) {
        historyList.innerHTML = "<p>No hay recomendaciones registradas para esta parcela.</p>";
    } else {
        const recommendations = historyResponse.data;
        historyList.innerHTML = "";
        recommendations.forEach((recommendation) => {
            const item = document.createElement("div");
            item.classList.add("mini-card");
            item.innerHTML = `
                <p><strong>Fecha:</strong> ${recommendation.created_at || "-"}</p>
                <p><strong>Decisión:</strong> ${recommendation.should_irrigate ? "Regar" : "No regar"}</p>
                <p><strong>Prioridad:</strong> ${recommendation.priority}</p>
                <p><strong>Tiempo:</strong> ${recommendation.irrigation_time_minutes} min</p>
                <p><strong>kWh:</strong> ${recommendation.estimated_kwh}</p>
                <p><strong>Costo:</strong> Bs ${recommendation.estimated_cost_bs}</p>
                <p><strong>Mensaje:</strong> ${recommendation.recommendation_message || "Sin mensaje."}</p>
            `;
            historyList.appendChild(item);
        });
    }
}

plotSelect.addEventListener("change", async () => {
    if (!plotSelect.value) {
        clearPlotDetails();
        return;
    }

    await loadPlotData(plotSelect.value);
});

recommendationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!selectedPlotId) {
        showMessage("❌ Debes seleccionar una parcela.", "error");
        return;
    }

    const soilMoistureValue = document.getElementById("soil_moisture_estimated").value;
    const soilMoisture = soilMoistureValue !== "" ? Number(soilMoistureValue) : NaN;
    const producerObservation = document.getElementById("producer_observation").value;

    if (soilMoistureValue === "" || Number.isNaN(soilMoisture)) {
        showMessage("❌ Debe ingresar la humedad estimada del suelo.", "error");
        return;
    }

    showMessage("⏳ Procesando datos...", "loading");

    try {
        if (!selectedCropId) {
            const cropData = {
                plot_id: selectedPlotId,
                crop_name: document.getElementById("crop_name").value,
                crop_stage: document.getElementById("crop_stage").value,
                sowing_date: document.getElementById("sowing_date").value,
                drought_sensitivity: document.getElementById("drought_sensitivity").value
            };
            const cropResponse = await createCrop(cropData);
            if (cropResponse.success === false) {
                showMessage("❌ No se pudo guardar el cultivo.", "error");
                return;
            }
            const crop = getResponseData(cropResponse, "crop");
            selectedCropId = crop.id;
        }

        if (!selectedPumpId) {
            const pumpData = {
                plot_id: selectedPlotId,
                pump_type: document.getElementById("pump_type").value,
                power_kw: Number(document.getElementById("power_kw").value),
                flow_liters_minute: Number(document.getElementById("flow_liters_minute").value),
                cost_kwh: Number(document.getElementById("cost_kwh").value),
                energy_source: document.getElementById("energy_source").value
            };
            const pumpResponse = await createPump(pumpData);
            if (pumpResponse.success === false) {
                showMessage("❌ No se pudo guardar la bomba.", "error");
                return;
            }
            const pump = getResponseData(pumpResponse, "pump");
            selectedPumpId = pump.id;
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
            const weatherResponse = await createWeather(weatherData);
            if (weatherResponse.success === false) {
                showMessage("❌ No se pudo guardar el clima.", "error");
                return;
            }
            const weather = getResponseData(weatherResponse, "weather");
            selectedWeatherId = weather.id;
        }

        if (!selectedCropId) {
            showMessage("❌ Falta registrar un cultivo para esta parcela.", "error");
            return;
        }
        if (!selectedPumpId) {
            showMessage("❌ Falta registrar una bomba para esta parcela.", "error");
            return;
        }
        if (!selectedWeatherId) {
            showMessage("❌ Falta registrar datos climáticos para esta parcela.", "error");
            return;
        }

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
            showMessage("❌ No se pudo generar la recomendación.", "error");
            return;
        }

        const recommendation = getResponseData(recommendationResponse, "recommendation");
        showMessage("✅ Recomendación generada correctamente.", "success");
        showRecommendation(recommendation);
        await loadPlotData(selectedPlotId);
    } catch (error) {
        console.error(error);
        showMessage("❌ No se pudo conectar con el servidor.", "error");
    }
});

function showRecommendation(recommendation) {
    resultCard.style.display = "block";

    const shouldIrrigateText = recommendation.should_irrigate
        ? "Se recomienda regar"
        : "No se recomienda regar por ahora";

    const reasons = Array.isArray(recommendation.ai_reasons)
        ? recommendation.ai_reasons.map((reason) => `<li>${reason}</li>`).join("")
        : null;

    recommendationResult.innerHTML = `
        <div class="resultado-principal">
            <h2>${recommendation.should_irrigate ? "💧" : "⏳"} ${shouldIrrigateText}</h2>
            <p><strong>Prioridad:</strong> ${recommendation.priority || "-"}</p>
        </div>

        <div class="grid-resultados">
            <div class="dato">
                <span>Riesgo hídrico</span>
                <strong>${recommendation.risk_score ?? "-"}</strong>
            </div>
            <div class="dato">
                <span>Tiempo recomendado</span>
                <strong>${recommendation.irrigation_time_minutes ?? "-"} minutos</strong>
            </div>
            <div class="dato">
                <span>Horario recomendado</span>
                <strong>${recommendation.recommended_schedule || "-"}</strong>
            </div>
            <div class="dato">
                <span>Consumo estimado</span>
                <strong>${recommendation.estimated_kwh ?? "-"} kWh</strong>
            </div>
            <div class="dato">
                <span>Costo aproximado</span>
                <strong>Bs ${recommendation.estimated_cost_bs ?? "-"}</strong>
            </div>
        </div>

        <div class="explicacion">
            <h3>Razones de la IA</h3>
            <div>${reasons ? `<ul>${reasons}</ul>` : "<p>Sin razones registradas.</p>"}</div>
            <p><strong>Mensaje IA:</strong> ${recommendation.recommendation_message || "Sin mensaje registrado."}</p>
        </div>
    `;
}

loadPlots();