import { plotsModel } from "../models/plots.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class plotsController {
  static createPlot = async (req, res) => {
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
        return sendError(res, 400, "El nombre de la parcela es obligatorio");
      }

      const plot = await plotsModel.createPlot({
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
      return sendError(res, 500, "Error al registrar parcela", error);
    }
  };

  static getPlots = async (req, res) => {
    try {
      const plots = await plotsModel.getPlots();
      return sendSuccess(res, "Parcelas obtenidas correctamente", { data: plots });
    } catch (error) {
      return sendError(res, 500, "Error al obtener parcelas", error);
    }
  };

  static getPlotById = async (req, res) => {
    try {
      const { id } = req.params;
      const plot = await plotsModel.getPlotById(id);

      if (!plot) {
        return sendError(res, 404, "Parcela no encontrada");
      }

      return sendSuccess(res, "Parcela obtenida correctamente", { data: plot });
    } catch (error) {
      return sendError(res, 500, "Error al obtener parcela", error);
    }
  };
}
