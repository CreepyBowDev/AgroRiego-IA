const API_URL = "http://localhost:3000/api";

async function request(endpoint, options = {}) {
    try {
        const config = {
            ...options,
            headers: {
                ...(options.headers || {})
            }
        };

        const response = await fetch(`${API_URL}${endpoint}`, config);

        let data = null;

        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                message: data?.message || `Error ${response.status}`,
                error: data?.error || null
            };
        }

        return {
            success: true,
            ...data
        };
    } catch (error) {
        console.error("Error API:", error);

        return {
            success: false,
            message: error.message || "No se pudo conectar con el backend.",
            error
        };
    }
}

function jsonOptions(data) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
}

export async function getHealth() {
    return await request("/health");
}

export async function getDemoUser() {
    return await request("/users/demo");
}

export async function createPlot(data) {
    return await request("/plots", jsonOptions(data));
}

export async function getPlots() {
    return await request("/plots");
}

export async function getPlotById(id) {
    return await request(`/plots/${encodeURIComponent(id)}`);
}

export async function createCrop(data) {
    return await request("/crops", jsonOptions(data));
}

export async function getCrops() {
    return await request("/crops");
}

export async function getCropById(id) {
    return await request(`/crops/${encodeURIComponent(id)}`);
}

export async function getCropsByPlot(plotId) {
    return await request(`/crops/plot/${encodeURIComponent(plotId)}`);
}

export async function createPump(data) {
    return await request("/pumps", jsonOptions(data));
}

export async function getPumps() {
    return await request("/pumps");
}

export async function getPumpById(id) {
    return await request(`/pumps/${encodeURIComponent(id)}`);
}

export async function getPumpsByPlot(plotId) {
    return await request(`/pumps/plot/${encodeURIComponent(plotId)}`);
}

export async function createWeather(data) {
    return await request("/weather", jsonOptions(data));
}

export async function getWeatherRecords() {
    return await request("/weather");
}

export async function getWeatherById(id) {
    return await request(`/weather/${encodeURIComponent(id)}`);
}

export async function getLatestWeatherByPlot(plotId) {
    return await request(`/weather/latest/${encodeURIComponent(plotId)}`);
}

export async function generateRecommendation(data) {
    return await request("/recommendations/generate", jsonOptions(data));
}

export async function getRecommendations() {
    return await request("/recommendations");
}

export async function getRecommendationsByPlot(plotId) {
    return await request(`/recommendations/plot/${encodeURIComponent(plotId)}`);
}