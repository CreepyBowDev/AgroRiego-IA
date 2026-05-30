import { weatherModel } from "../models/weather.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class weatherController {
  static createWeather = async (req, res) => {
    try {
      const {
        plot_id,
        temperature,
        humidity,
        rain_probability,
        wind_speed,
        record_date
      } = req.body;

      if (!plot_id) {
        return sendError(res, 400, "El ID de la parcela es obligatorio");
      }

      if (temperature === undefined) {
        return sendError(res, 400, "La temperatura es obligatoria");
      }

      if (humidity === undefined) {
        return sendError(res, 400, "La humedad ambiental es obligatoria");
      }

      if (rain_probability === undefined) {
        return sendError(res, 400, "La probabilidad de lluvia es obligatoria");
      }

      const weather = await weatherModel.createWeather({
        plot_id,
        temperature,
        humidity,
        rain_probability,
        wind_speed,
        record_date
      });

      return res.status(201).json({
        message: "Clima registrado correctamente",
        weather
      });
    } catch (error) {
      return sendError(res, 500, "Error al registrar clima", error);
    }
  };

  static getWeatherRecords = async (req, res) => {
    try {
      const weatherRecords = await weatherModel.getWeatherRecords();
      return sendSuccess(res, "Registros climáticos obtenidos correctamente", { data: weatherRecords });
    } catch (error) {
      return sendError(res, 500, "Error al obtener registros climáticos", error);
    }
  };

  static getWeatherById = async (req, res) => {
    try {
      const { id } = req.params;
      const weather = await weatherModel.getWeatherById(id);

      if (!weather) {
        return sendError(res, 404, "Registro climático no encontrado");
      }

      return sendSuccess(res, "Registro climático obtenido correctamente", { data: weather });
    } catch (error) {
      return sendError(res, 500, "Error al obtener registro climático", error);
    }
  };

  static getLatestWeatherByPlot = async (req, res) => {
    try {
      const { plotId } = req.params;
      const weather = await weatherModel.getLatestWeatherByPlot(plotId);

      if (!weather) {
        return sendError(res, 404, "No se encontró clima registrado para esta parcela");
      }

      return sendSuccess(res, "Último clima de la parcela obtenido correctamente", { data: weather });
    } catch (error) {
      return sendError(res, 500, "Error al obtener último clima de la parcela", error);
    }
  };
}
