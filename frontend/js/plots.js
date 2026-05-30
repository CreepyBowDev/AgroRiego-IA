import { createPlot, getPlots } from "./api.js";

const plotForm = document.getElementById("plotForm");
const plotMessage = document.getElementById("plotMessage");
const plotsList = document.getElementById("plotsList");

const showMessage = (element, text, success = true) => {
  element.textContent = text;
  element.style.color = success ? "var(--success)" : "var(--error)";
};

const renderPlots = (plots) => {
  if (!plots || plots.length === 0) {
    plotsList.innerHTML = "<div class='info-card'>No hay parcelas registradas aún.</div>";
    return;
  }
  plotsList.innerHTML = plots
    .map(
      (plot) => `
      <article class="info-card">
        <h3>${plot.name || "Parcela sin nombre"}</h3>
        <p><strong>Municipio:</strong> ${plot.municipality || "-"}</p>
        <p><strong>Comunidad:</strong> ${plot.community || "-"}</p>
        <p><strong>Área:</strong> ${plot.area_hectares || "-"} ha</p>
        <p><strong>Suelo:</strong> ${plot.soil_type || "-"}</p>
        <p><strong>Agua:</strong> ${plot.water_source || "-"}</p>
        <p><strong>ID:</strong> ${plot.id || plot._id}</p>
      </article>
    `
    )
    .join("");
};

const loadPlots = async () => {
  plotsList.textContent = "Cargando parcelas...";
  try {
    const data = await getPlots();
    const plots = data.plots || data.data || [];
    renderPlots(plots);
  } catch (error) {
    plotsList.textContent = "No se pudo cargar las parcelas.";
  }
};

plotForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("plotName").value.trim();
  const municipality = document.getElementById("municipality").value.trim();
  const community = document.getElementById("community").value.trim();
  const area_hectares = Number(document.getElementById("areaHectares").value);
  const soil_type = document.getElementById("soilType").value.trim();
  const water_source = document.getElementById("waterSource").value.trim();

  if (!name) {
    showMessage(plotMessage, "El nombre de parcela es obligatorio.", false);
    return;
  }

  const payload = {
    name,
    municipality,
    community,
    area_hectares: Number.isFinite(area_hectares) ? area_hectares : 0,
    soil_type,
    water_source
  };

  try {
    const result = await createPlot(payload);
    const plot = result.plot || result;
    showMessage(plotMessage, `Parcela creada: ${plot.id || plot._id}`, true);
    plotForm.reset();
    await loadPlots();
  } catch (error) {
    showMessage(plotMessage, `Error al crear parcela: ${error.message}`, false);
  }
});

loadPlots();
