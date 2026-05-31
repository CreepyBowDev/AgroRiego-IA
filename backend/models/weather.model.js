import { WeatherRecord } from "../db.js";
import { generateId } from "../utils/id.js";

const normalizeWeather = (weather) => {
  if (!weather) return null;
  const plain = JSON.parse(JSON.stringify(weather));
  plain.id = plain._id;
  return plain;
};

export class weatherModel {
  static createWeather = async (payload) => {
    const weather = WeatherRecord.create({
      _id: generateId("weather"),
      plot_id: payload.plot_id,
      temperature: payload.temperature,
      humidity: payload.humidity,
      rain_probability: payload.rain_probability,
      wind_speed: payload.wind_speed,
      record_date: payload.record_date,
      created_at: new Date().toISOString()
    }).save();

    return normalizeWeather(weather);
  };

  static getWeatherRecords = async () => {
    return WeatherRecord.find().map(normalizeWeather);
  };

  static getWeatherById = async (id) => {
    const weather = WeatherRecord.findOne(id);
    return normalizeWeather(weather);
  };

  static getLatestWeatherByPlot = async (plotId) => {
    const records = WeatherRecord.find({ plot_id: plotId }).map(normalizeWeather);
    if (!records || records.length === 0) {
      return null;
    }

    return records
      .sort((a, b) => new Date(b.record_date || b.created_at) - new Date(a.record_date || a.created_at))[0];
  };
}
