const API_URL = "http://localhost:3000/api";

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("API request failed", path, error);
    throw error;
  }
};

export const getHealth = () => request("/health");
export const getDemoUser = () => request("/users/demo");
export const createPlot = (data) => request("/plots", { method: "POST", body: JSON.stringify(data) });
export const getPlots = () => request("/plots");
export const getPlotById = (id) => request(`/plots/${id}`);
export const createCrop = (data) => request("/crops", { method: "POST", body: JSON.stringify(data) });
export const getCrops = () => request("/crops");
export const getCropById = (id) => request(`/crops/${id}`);
export const getCropsByPlot = (plotId) => request(`/crops/plot/${plotId}`);
export const createPump = (data) => request("/pumps", { method: "POST", body: JSON.stringify(data) });
export const getPumps = () => request("/pumps");
export const getPumpById = (id) => request(`/pumps/${id}`);
export const getPumpByPlot = (plotId) => request(`/pumps/plot/${plotId}`);
export const createWeather = (data) => request("/weather", { method: "POST", body: JSON.stringify(data) });
export const getWeatherRecords = () => request("/weather");
export const getWeatherById = (id) => request(`/weather/${id}`);
export const getLatestWeatherByPlot = (plotId) => request(`/weather/latest/${plotId}`);
export const generateRecommendation = (data) => request("/recommendations/generate", { method: "POST", body: JSON.stringify(data) });
export const getRecommendations = () => request("/recommendations");
export const getRecommendationsByPlot = (plotId) => request(`/recommendations/plot/${plotId}`);
