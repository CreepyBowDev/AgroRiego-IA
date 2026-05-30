import {
    getPlots,
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

sowingDateInput.value = new Date().toISOString().split("T")[0];

function getResponseData(response, key) {
    return response.data || response[key] || response;
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

async function loadPlots() {
    const response = await getPlots();
    const plots = response.data || response.plots || response || [];

    plotSelect.innerHTML = "";

    if (!Array.isArray(plots) || plots.length === 0) {
        plotSelect.innerHTML = `<option value="">Primero registra una parcela</option>`;
        return;
    }

    plotSelect.innerHTML = `<option value="">Selecciona una parcela</option>`;

    plots.forEach((plot) => {
        const option = document.createElement("option");
        option.value = plot.id;
        option.textContent = `${plot.name} - ${plot.municipality}`;
        plotSelect.appendChild(option);
    });
}

recommendationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const plotId = plotSelect.value;

    if (!plotId) {
        showMessage("❌ Debes seleccionar una parcela.", "error");
        return;
    }

    showMessage("⏳ Generando recomendación IA...", "loading");

    const cropData = {
        plot_id: plotId,
        crop_name: document.getElementById("crop_name").value,
        crop_stage: document.getElementById("crop_stage").value,
        sowing_date: document.getElementById("sowing_date").value,
        drought_sensitivity: document.getElementById("drought_sensitivity").value
    };

    const pumpData = {
        plot_id: plotId,
        pump_type: document.getElementById("pump_type").value,
        power_kw: Number(document.getElementById("power_kw").value),
        flow_liters_minute: Number(document.getElementById("flow_liters_minute").value),
        cost_kwh: Number(document.getElementById("cost_kwh").value),
        energy_source: document.getElementById("energy_source").value
    };

    const weatherData = {
        plot_id: plotId,
        temperature: Number(document.getElementById("temperature").value),
        humidity: Number(document.getElementById("humidity").value),
        rain_probability: Number(document.getElementById("rain_probability").value),
        wind_speed: Number(document.getElementById("wind_speed").value),
        record_date: new Date().toISOString().split("T")[0]
    };

    const soilMoisture = Number(document.getElementById("soil_moisture_estimated").value);
    const producerObservation = document.getElementById("producer_observation").value;

    try {
        const cropResponse = await createCrop(cropData);
        const pumpResponse = await createPump(pumpData);
        const weatherResponse = await createWeather(weatherData);

        if (
            cropResponse.success === false ||
            pumpResponse.success === false ||
            weatherResponse.success === false
        ) {
            showMessage("❌ Error al guardar datos agrícolas.", "error");
            return;
        }

        const crop = getResponseData(cropResponse, "crop");
        const pump = getResponseData(pumpResponse, "pump");
        const weather = getResponseData(weatherResponse, "weather");

        const recommendationData = {
            plot_id: plotId,
            crop_id: crop.id,
            pump_id: pump.id,
            weather_id: weather.id,
            crop,
            pump,
            weather,
            soil_moisture_estimated: soilMoisture,
            producer_observation: producerObservation
        };

        const recommendationResponse = await generateRecommendation(recommendationData);

        if (recommendationResponse.success === false) {
            showMessage("❌ Error al generar la recomendación IA.", "error");
            return;
        }

        const recommendation = getResponseData(recommendationResponse, "recommendation");

        showMessage("✅ Recomendación generada correctamente.", "success");
        showRecommendation(recommendation);

    } catch (error) {
        console.error(error);
        showMessage("❌ No se pudo conectar con el servidor.", "error");
    }
});

function showRecommendation(recommendation) {
    resultCard.style.display = "block";

    const shouldIrrigateText = recommendation.should_irrigate
        ? "Sí se recomienda regar"
        : "No se recomienda regar por ahora";

    const reasons = Array.isArray(recommendation.ai_reasons)
        ? recommendation.ai_reasons.join(", ")
        : "Condiciones evaluadas por la IA";

    recommendationResult.innerHTML = `
        <div class="resultado-principal">
            <h2>${recommendation.should_irrigate ? "💧" : "⏳"} ${shouldIrrigateText}</h2>
            <p><strong>Prioridad:</strong> ${recommendation.priority}</p>
        </div>

        <div class="grid-resultados">
            <div class="dato">
                <span>Riesgo hídrico</span>
                <strong>${recommendation.risk_score}</strong>
            </div>

            <div class="dato">
                <span>Tiempo de riego</span>
                <strong>${recommendation.irrigation_time_minutes} min</strong>
            </div>

            <div class="dato">
                <span>Horario sugerido</span>
                <strong>${recommendation.recommended_schedule}</strong>
            </div>

            <div class="dato">
                <span>Consumo estimado</span>
                <strong>${recommendation.estimated_kwh} kWh</strong>
            </div>

            <div class="dato">
                <span>Costo aproximado</span>
                <strong>Bs ${recommendation.estimated_cost_bs}</strong>
            </div>
        </div>

        <div class="explicacion">
            <h3>Explicación IA</h3>
            <p>${recommendation.recommendation_message}</p>
            <p><strong>Factores detectados:</strong> ${reasons}</p>
        </div>
    `;
}

loadPlots();