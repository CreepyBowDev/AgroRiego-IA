import { createPlot, getPlots } from "./api.js";

const plotForm = document.getElementById("plotForm");
const message = document.getElementById("message");
const plotsList = document.getElementById("plotsList");

function showMessage(text, type) {
    if (!message) return;

    message.textContent = text;
    message.className = type;
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

function renderEmptyPlots() {
    plotsList.innerHTML = `
        <div class="empty-state">
            <span>🌱</span>
            <p>No hay parcelas cargadas todavía. Registra la primera parcela para iniciar la demo.</p>
        </div>
    `;
}

function renderPlotCard(plot) {
    const card = document.createElement("article");
    card.classList.add("plot-card");

    card.innerHTML = `
        <h4>${plot.name || "Parcela sin nombre"}</h4>

        <p><strong>Municipio:</strong> ${plot.municipality || "-"}</p>
        <p><strong>Comunidad:</strong> ${plot.community || "-"}</p>
        <p><strong>Superficie:</strong> ${plot.area_hectares ?? "-"} hectáreas</p>
        <p><strong>Tipo de suelo:</strong> ${plot.soil_type || "-"}</p>
        <p><strong>Fuente de agua:</strong> ${plot.water_source || "-"}</p>

        <div class="plot-actions">
            <a href="recommendation.html" class="btn btn-secondary">
                Usar en recomendación
            </a>
        </div>
    `;

    return card;
}

async function loadPlots() {
    if (!plotsList) return;

    plotsList.innerHTML = `
        <div class="empty-state">
            <span>⏳</span>
            <p>Cargando parcelas registradas...</p>
        </div>
    `;

    const response = await getPlots();

    if (response.success === false) {
        plotsList.innerHTML = `
            <div class="empty-state">
                <span>⚠️</span>
                <p>No se pudieron cargar las parcelas. Verifica que el backend esté activo.</p>
            </div>
        `;
        return;
    }

    const plots = getResponseData(response, "plots") || [];

    if (!Array.isArray(plots) || plots.length === 0) {
        renderEmptyPlots();
        return;
    }

    plotsList.innerHTML = "";

    plots.forEach((plot) => {
        plotsList.appendChild(renderPlotCard(plot));
    });
}

if (plotForm) {
    plotForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
            name: document.getElementById("name").value.trim(),
            municipality: document.getElementById("municipality").value.trim(),
            community: document.getElementById("community").value.trim(),
            area_hectares: Number(document.getElementById("area_hectares").value),
            soil_type: document.getElementById("soil_type").value.trim(),
            water_source: document.getElementById("water_source").value.trim()
        };

        if (!data.name) {
            showMessage("❌ El nombre de la parcela es obligatorio.", "error");
            return;
        }

        showMessage("⏳ Guardando parcela...", "loading");

        const response = await createPlot(data);

        if (response.success === false) {
            console.error("Error guardar parcela:", response);
            showMessage(`❌ Error al guardar la parcela. ${response.message || "Ver consola para más detalles."}`, "error");
            return;
        }

        showMessage("✅ Parcela guardada correctamente.", "success");

        plotForm.reset();
        await loadPlots();
    });
}

loadPlots();