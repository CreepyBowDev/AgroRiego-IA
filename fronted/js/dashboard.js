import { getHealth, getDemoUser } from "./api.js";

const healthStatus = document.getElementById("healthStatus");
const demoUserInfo = document.getElementById("demoUserInfo");

function renderHealth(data) {
    const status = data.status || "ok";
    const message = data.message ? `<p>${data.message}</p>` : "";
    healthStatus.innerHTML = `
        <p><strong>Estado:</strong> ${status}</p>
        ${message}
    `;
}

function renderDemoUser(user) {
    demoUserInfo.innerHTML = `
        <p><strong>Nombre:</strong> ${user.name || "Productor Demo"}</p>
        <p><strong>Zona:</strong> ${user.zone || "Montero"}</p>
        <p><strong>Teléfono:</strong> ${user.phone || "70000000"}</p>
        <p><strong>Tipo:</strong> ${user.user_type || "Pequeño productor agrícola"}</p>
    `;
}

function showError(container, text) {
    container.innerHTML = `<p class="error">${text}</p>`;
}

async function initDashboard() {
    const healthResponse = await getHealth();
    if (healthResponse.success === false) {
        showError(healthStatus, "No se pudo conectar con el backend.");
    } else {
        renderHealth(healthResponse);
    }

    const demoResponse = await getDemoUser();
    if (demoResponse.success === false) {
        showError(demoUserInfo, "No se pudo cargar el productor demo.");
    } else {
        const demoUser = demoResponse.data || demoResponse;
        renderDemoUser(demoUser);
    }
}

initDashboard();
