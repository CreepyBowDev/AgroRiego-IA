import { cropsModel } from "../models/cropsModel.js";

export class cropsController {
    static create = async (req, res) => {
        try {
            const {
                plot_id,
                crop_name,
                crop_stage,
                sowing_date,
                drought_sensitivity
            } = req.body;

            if (!plot_id) {
                return res.status(400).json({
                    message: "El ID de la parcela es obligatorio"
                });
            }

            if (!crop_name) {
                return res.status(400).json({
                    message: "El nombre del cultivo es obligatorio"
                });
            }

            const crop = await cropsModel.create({
                plot_id,
                crop_name,
                crop_stage,
                sowing_date,
                drought_sensitivity
            });

            return res.status(201).json({
                message: "Cultivo registrado correctamente",
                crop
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al registrar cultivo",
                error: error.message
            });
        }
    };

    static getCrops = async (req, res) => {
        try {
            const crops = await cropsModel.getCrops();

            return res.json({
                message: "Cultivos obtenidos correctamente",
                crops
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener cultivos",
                error: error.message
            });
        }
    };

    static getCropById = async (req, res) => {
        try {
            const { id } = req.params;

            const crop = await cropsModel.getCropById(id);

            if (!crop) {
                return res.status(404).json({
                    message: "Cultivo no encontrado"
                });
            }

            return res.json({
                message: "Cultivo obtenido correctamente",
                crop
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener cultivo",
                error: error.message
            });
        }
    };

    static getCropsByPlot = async (req, res) => {
        try {
            const { plotId } = req.params;

            const crops = await cropsModel.getCropsByPlot(plotId);

            return res.json({
                message: "Cultivos de la parcela obtenidos correctamente",
                crops
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener cultivos de la parcela",
                error: error.message
            });
        }
    };
}

