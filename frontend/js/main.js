import { getHealth } from "./api.js";

const healthStatus = document.getElementById("healthStatus");
const healthMessage = document.getElementById("healthMessage");

const updateHealth = async () => {
  try {
    await getHealth();
    healthStatus.textContent = "Conectado";
    healthStatus.className = "status-pill status-success";
    healthMessage.textContent = "Backend activo en http://localhost:3000/api";
  } catch (error) {
    healthStatus.textContent = "Offline";
    healthStatus.className = "status-pill status-error";
    healthMessage.textContent = "No se pudo conectar al backend. Asegura que npm run dev esté corriendo.";
  }
};

updateHealth();
