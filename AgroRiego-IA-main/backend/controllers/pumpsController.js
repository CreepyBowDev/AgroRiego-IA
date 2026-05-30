import { pumpsModel } from "../models/pumpsModel.js";

export class pumpsController {
    static create = async (req, res) => {
        try {
            const {
                plot_id,
                pump_type,
                power_kw,
                flow_liters_minute,
                cost_kwh,
                energy_source
            } = req.body;

            if (!plot_id) {
                return res.status(400).json({
                    message: "El ID de la parcela es obligatorio"
                });
            }

            if (!power_kw) {
                return res.status(400).json({
                    message: "La potencia de la bomba en kW es obligatoria"
                });
            }

            const pump = await pumpsModel.create({
                plot_id,
                pump_type,
                power_kw,
                flow_liters_minute,
                cost_kwh,
                energy_source
            });

            return res.status(201).json({
                message: "Bomba registrada correctamente",
                pump
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al registrar bomba",
                error: error.message
            });
        }
    };

    static getPumps = async (req, res) => {
        try {
            const pumps = await pumpsModel.getPumps();

            return res.json({
                message: "Bombas obtenidas correctamente",
                pumps
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener bombas",
                error: error.message
            });
        }
    };

    static getPumpById = async (req, res) => {
        try {
            const { id } = req.params;

            const pump = await pumpsModel.getPumpByI(id);

            if (!pump) {
                return res.status(404).json({
                    message: "Bomba no encontrada"
                });
            }

            return res.json({
                message: "Bomba obtenida correctamente",
                pump
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener bomba",
                error: error.message
            });
        }
    };

    static getPumpByPlot = async (req, res) => {
        try {
            const { plotId } = req.params;

            const pump = await pumpsModel.getPumpByPlot(plotId);

            if (!pump) {
                return res.status(404).json({
                    message: "No se encontró una bomba para esta parcela"
                });
            }

            return res.json({
                message: "Bomba de la parcela obtenida correctamente",
                pump
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener bomba de la parcela",
                error: error.message
            });
        }
    };
}
