import { plotsModel } from "../models/plots.model.js";

export class plotsController {
    static create = async (req, res) => {
        try {
            const {
                name,
                municipality,
                community,
                area_hectares,
                soil_type,
                water_source
            } = req.body;

            if (!name) {
                return res.status(400).json({
                    message: "El nombre de la parcela es obligatorio"
                });
            }

            const plot = await plotsModel.create({
                name,
                municipality,
                community,
                area_hectares,
                soil_type,
                water_source
            });

            return res.status(201).json({
                message: "Parcela registrada correctamente",
                plot
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al registrar parcela",
                error: error.message
            });
        }
    };

    static getPlots = async (req, res) => {
        try {
            const plots = await plotsModel.getPlots();

            return res.json({
                message: "Parcelas obtenidas correctamente",
                plots
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener parcelas",
                error: error.message
            });
        }
    };

    static getPlotById = async (req, res) => {
        try {
            const { id } = req.params;

            const plot = await plotsModel.getPlotById(id);

            if (!plot) {
                return res.status(404).json({
                    message: "Parcela no encontrada"
                });
            }

            return res.json({
                message: "Parcela obtenida correctamente",
                plot
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener parcela",
                error: error.message
            });
        }
    };
}

