import { createPlot, getPlots } from "./api.js";

const plotForm = document.getElementById("plotForm");
const message = document.getElementById("message");
const plotsList = document.getElementById("plotsList");

async function loadPlots() {
    const response = await getPlots();

    const plots = response.data || response.plots || response || [];

    if (!Array.isArray(plots) || plots.length === 0) {
        plotsList.innerHTML = "<p>No hay parcelas cargadas todavía.</p>";
        return;
    }

    plotsList.innerHTML = "";

    plots.forEach((plot) => {
        const card = document.createElement("div");
        card.classList.add("mini-card");

        card.innerHTML = `
            <h4>${plot.name}</h4>
            <p><strong>Municipio:</strong> ${plot.municipality}</p>
            <p><strong>Comunidad:</strong> ${plot.community}</p>
            <p><strong>Superficie:</strong> ${plot.area_hectares} hectáreas</p>
            <p><strong>Suelo:</strong> ${plot.soil_type}</p>
            <p><strong>Agua:</strong> ${plot.water_source}</p>
        `;

        plotsList.appendChild(card);
    });
}

plotForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
        user_id: "demo-user-1",
        name: document.getElementById("name").value,
        municipality: document.getElementById("municipality").value,
        community: document.getElementById("community").value,
        area_hectares: Number(document.getElementById("area_hectares").value),
        soil_type: document.getElementById("soil_type").value,
        water_source: document.getElementById("water_source").value
    };

    const response = await createPlot(data);

    if (response.success === false) {
        message.textContent = "❌ Error al guardar la parcela.";
        message.className = "error";
        return;
    }

    message.textContent = "✅ Parcela guardada correctamente.";
    message.className = "success";

    plotForm.reset();
    loadPlots();
});

loadPlots();