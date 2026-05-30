const API_URL = "http://localhost:3000/api";

async function request(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error en la solicitud");
        }

        return data;
    } catch (error) {
        console.error("Error API:", error);
        return {
            success: false,
            message: error.message || "No se pudo conectar con el servidor"
        };
    }
}

export async function getHealth() {
    return await request("/health");
}

export async function getDemoUser() {
    return await request("/users/demo");
}

export async function createPlot(data) {
    return await request("/plots", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export async function getPlots() {
    return await request("/plots");
}

export async function createCrop(data) {
    return await request("/crops", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export async function createPump(data) {
    return await request("/pumps", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export async function createWeather(data) {
    return await request("/weather", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export async function generateRecommendation(data) {
    return await request("/recommendations/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export async function getRecommendations() {
    return await request("/recommendations");
}