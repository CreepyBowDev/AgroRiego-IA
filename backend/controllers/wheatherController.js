import { wheaterModel } from "../models/weatherModel.js";

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
                return res.status(400).json({
                    message: "El ID de la parcela es obligatorio"
                });
            }

            if (temperature === undefined) {
                return res.status(400).json({
                    message: "La temperatura es obligatoria"
                });
            }

            if (humidity === undefined) {
                return res.status(400).json({
                    message: "La humedad ambiental es obligatoria"
                });
            }

            if (rain_probability === undefined) {
                return res.status(400).json({
                    message: "La probabilidad de lluvia es obligatoria"
                });
            }

            const weather = await wheaterModel.create({
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
            return res.status(500).json({
                message: "Error al registrar clima",
                error: error.message
            });
        }
    };

    static getWeatherRecords = async (req, res) => {
        try {
            const weatherRecords = await wheaterModel.getWeatherRecords();

            return res.json({
                message: "Registros climáticos obtenidos correctamente",
                weather: weatherRecords
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener registros climáticos",
                error: error.message
            });
        }
    };

    static getWeatherById = async (req, res) => {
        try {
            const { id } = req.params;

            const weather = await wheaterModel.getWeatherById(id);

            if (!weather) {
                return res.status(404).json({
                    message: "Registro climático no encontrado"
                });
            }

            return res.json({
                message: "Registro climático obtenido correctamente",
                weather
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener registro climático",
                error: error.message
            });
        }
    };

    static getLatestWeatherByPlot = async (req, res) => {
        try {
            const { plotId } = req.params;

            const weather = await wheaterModel.getLatestWeatherByPlot(plotId);

            if (!weather) {
                return res.status(404).json({
                    message: "No se encontró clima registrado para esta parcela"
                });
            }

            return res.json({
                message: "Último clima de la parcela obtenido correctamente",
                weather
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener último clima de la parcela",
                error: error.message
            });
        }
    };
}
