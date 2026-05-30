import { cropsModel } from "../models/crops.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class cropsController {
  static createCrop = async (req, res) => {
    try {
      const {
        plot_id,
        crop_name,
        crop_stage,
        sowing_date,
        drought_sensitivity
      } = req.body;

      if (!plot_id) {
        return sendError(res, 400, "El ID de la parcela es obligatorio");
      }

      if (!crop_name) {
        return sendError(res, 400, "El nombre del cultivo es obligatorio");
      }

      const crop = await cropsModel.createCrop({
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
      return sendError(res, 500, "Error al registrar cultivo", error);
    }
  };

  static getCrops = async (req, res) => {
    try {
      const crops = await cropsModel.getCrops();
      return sendSuccess(res, "Cultivos obtenidos correctamente", { data: crops });
    } catch (error) {
      return sendError(res, 500, "Error al obtener cultivos", error);
    }
  };

  static getCropById = async (req, res) => {
    try {
      const { id } = req.params;
      const crop = await cropsModel.getCropById(id);

      if (!crop) {
        return sendError(res, 404, "Cultivo no encontrado");
      }

      return sendSuccess(res, "Cultivo obtenido correctamente", { data: crop });
    } catch (error) {
      return sendError(res, 500, "Error al obtener cultivo", error);
    }
  };

  static getCropsByPlot = async (req, res) => {
    try {
      const { plotId } = req.params;
      const crops = await cropsModel.getCropsByPlot(plotId);
      return sendSuccess(res, "Cultivos de la parcela obtenidos correctamente", { data: crops });
    } catch (error) {
      return sendError(res, 500, "Error al obtener cultivos de la parcela", error);
    }
  };
}
