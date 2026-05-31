import {
    getHealth,
    getDemoUser,
    getPlots,
    getRecommendations
} from "./api.js";

const healthStatus = document.getElementById("healthStatus");
const demoUserInfo = document.getElementById("demoUserInfo");

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

function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
}

function showError(container, text) {
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state compact">
            <span>⚠️</span>
            <p>${text}</p>
        </div>
    `;
}

function renderHealth(response) {
    if (!healthStatus) return;

    const status = response.status || "ok";
    const message = response.message || "Backend conectado correctamente.";

    healthStatus.innerHTML = `
        <div class="status-panel success-panel">
            <span class="status-indicator"></span>
            <div>
                <strong>${status.toUpperCase()}</strong>
                <p>${message}</p>
            </div>
        </div>
    `;
}

function renderDemoUser(response) {
    if (!demoUserInfo) return;

    const user = getResponseData(response, "user");

    if (!user || user.success === false) {
        showError(demoUserInfo, "No se pudo cargar el productor demo.");
        return;
    }

    demoUserInfo.innerHTML = `
        <div class="producer-card">
            <div class="producer-avatar">
                👨‍🌾
            </div>

            <div class="producer-info">
                <strong>${user.name || "Productor Demo"}</strong>
                <p>${user.zone || "Zona no especificada"}</p>
            </div>
        </div>

        <div class="producer-details">
            <div>
                <span>Telefono</span>
                <strong>${user.phone || "-"}</strong>
            </div>

            <div>
                <span>Tipo</span>
                <strong>${user.user_type == "pequeño" ? "minorista" : user.user_type || "Productor"}</strong>
            </div>

            <div>
                <span>ID demo</span>
                <strong>${user.id || "demo-user-1"}</strong>
            </div>
        </div>
    `;
}

function renderDashboardSummary(plotsResponse, recommendationsResponse) {
    const dashboardGrid = document.querySelector(".dashboard-grid");

    if (!dashboardGrid) return;

    const plots = getResponseData(plotsResponse, "plots") || [];
    const recommendations = getResponseData(recommendationsResponse, "recommendations") || [];

    const totalPlots = Array.isArray(plots) ? plots.length : 0;
    const totalRecommendations = Array.isArray(recommendations) ? recommendations.length : 0;

    const latestRecommendation = totalRecommendations > 0
        ? recommendations[recommendations.length - 1]
        : null;

    const existingSummary = document.getElementById("dynamicSummaryCard");

    if (existingSummary) {
        existingSummary.remove();
    }

    const article = document.createElement("article");
    article.className = "dashboard-card dashboard-summary-card";
    article.id = "dynamicSummaryCard";

    article.innerHTML = `
        <header class="card-header">
            <div>
                <span class="card-eyebrow">Datos reales</span>
                <h2>Actividad del sistema</h2>
            </div>
            <span class="card-icon">📊</span>
        </header>

        <div class="summary-metrics">
            <div>
                <span>Parcelas</span>
                <strong>${totalPlots}</strong>
            </div>

            <div>
                <span>Recomendaciones</span>
                <strong>${totalRecommendations}</strong>
            </div>
        </div>

        <div class="latest-box">
            ${latestRecommendation
            ? `
                        <span class="badge ${latestRecommendation.should_irrigate ? "badge-success" : "badge-warning"}">
                            ${latestRecommendation.should_irrigate ? "Regar" : "Esperar"}
                        </span>

                        <h3>Última recomendación</h3>

                        <p>
                            <strong>Prioridad:</strong> ${latestRecommendation.priority || "-"} ·
                            <strong>Tiempo:</strong> ${latestRecommendation.irrigation_time_minutes ?? "-"} min ·
                            <strong>Costo:</strong> Bs ${Number(latestRecommendation.estimated_cost_bs || 0).toFixed(2)}
                        </p>

                        <small>${formatDate(latestRecommendation.created_at)}</small>
                    `
            : `
                        <div class="empty-state compact">
                            <span>📋</span>
                            <p>Aún no se generaron recomendaciones.</p>
                        </div>
                    `
        }
        </div>
    `;

    dashboardGrid.appendChild(article);
}

async function initDashboard() {
    if (healthStatus) {
        healthStatus.innerHTML = `
            <div class="empty-state compact">
                <span>⏳</span>
                <p>Cargando estado del backend...</p>
            </div>
        `;
    }

    if (demoUserInfo) {
        demoUserInfo.innerHTML = `
            <div class="empty-state compact">
                <span>⏳</span>
                <p>Cargando productor demo...</p>
            </div>
        `;
    }

    const [healthResponse, demoResponse, plotsResponse, recommendationsResponse] = await Promise.all([
        getHealth(),
        getDemoUser(),
        getPlots(),
        getRecommendations()
    ]);

    if (healthResponse.success === false) {
        showError(healthStatus, "No se pudo conectar con el backend.");
    } else {
        renderHealth(healthResponse);
    }

    if (demoResponse.success === false) {
        showError(demoUserInfo, "No se pudo cargar el productor demo.");
    } else {
        renderDemoUser(demoResponse);
    }

    renderDashboardSummary(plotsResponse, recommendationsResponse);
}

initDashboard();