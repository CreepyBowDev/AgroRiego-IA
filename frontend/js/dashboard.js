import { getHealth, getDemoUser, getPlots, getRecommendations } from "./api.js";

const dashboardHealth = document.getElementById("dashboardHealth");
const demoUser = document.getElementById("demoUser");
const plotCount = document.getElementById("plotCount");
const recommendationCount = document.getElementById("recommendationCount");
const latestRecommendation = document.getElementById("latestRecommendation");

const showStatus = (element, message, success = true) => {
  element.textContent = message;
  element.className = `status-pill ${success ? "status-success" : "status-error"}`;
};

const loadDashboard = async () => {
  try {
    await getHealth();
    showStatus(dashboardHealth, "Conectado", true);
  } catch (error) {
    showStatus(dashboardHealth, "Offline", false);
  }

  try {
    const userData = await getDemoUser();
    const user = userData.user || userData;
    demoUser.innerHTML = `
      <p><strong>Nombre:</strong> ${user.name || "Demo"}</p>
      <p><strong>Teléfono:</strong> ${user.phone || "No disponible"}</p>
      <p><strong>Zona:</strong> ${user.zone || "No disponible"}</p>
      <p><strong>Tipo:</strong> ${user.user_type || "Productor demo"}</p>
    `;
  } catch (error) {
    demoUser.textContent = "No se pudo cargar el productor demo.";
  }

  try {
    const plotsData = await getPlots();
    const plots = plotsData.plots || plotsData.data || [];
    plotCount.textContent = plots.length;
  } catch (error) {
    plotCount.textContent = "0";
  }

  try {
    const recommendationsData = await getRecommendations();
    const recommendations = recommendationsData.recommendations || recommendationsData.data || [];
    recommendationCount.textContent = recommendations.length;
    if (recommendations.length === 0) {
      latestRecommendation.textContent = "Aún no hay recomendaciones generadas.";
      return;
    }
    const latest = recommendations[recommendations.length - 1];
    latestRecommendation.innerHTML = `
      <p><strong>Decisión:</strong> ${latest.should_irrigate ? "Regar" : "Esperar"}</p>
      <p><strong>Prioridad:</strong> ${latest.priority}</p>
      <p><strong>Parcela:</strong> ${latest.plot_id}</p>
      <p><strong>Mensaje breve:</strong> ${latest.recommendation_message || "Sin mensaje"}</p>
    `;
  } catch (error) {
    latestRecommendation.textContent = "No se pudo cargar la última recomendación.";
  }
};

loadDashboard();
