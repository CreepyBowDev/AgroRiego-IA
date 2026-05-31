import { pumpsModel } from "../models/pumps.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class pumpsController {
  static createPump = async (req, res) => {
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
        return sendError(res, 400, "El ID de la parcela es obligatorio");
      }

      if (power_kw === undefined) {
        return sendError(res, 400, "La potencia de la bomba en kW es obligatoria");
      }

      const pump = await pumpsModel.createPump({
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
      return sendError(res, 500, "Error al registrar bomba", error);
    }
  };

  static getPumps = async (req, res) => {
    try {
      const pumps = await pumpsModel.getPumps();
      return sendSuccess(res, "Bombas obtenidas correctamente", { data: pumps });
    } catch (error) {
      return sendError(res, 500, "Error al obtener bombas", error);
    }
  };

  static getPumpById = async (req, res) => {
    try {
      const { id } = req.params;
      const pump = await pumpsModel.getPumpById(id);

      if (!pump) {
        return sendError(res, 404, "Bomba no encontrada");
      }

      return sendSuccess(res, "Bomba obtenida correctamente", { data: pump });
    } catch (error) {
      return sendError(res, 500, "Error al obtener bomba", error);
    }
  };

  static getPumpsByPlot = async (req, res) => {
    try {
      const { plotId } = req.params;
      const pumps = await pumpsModel.getPumpsByPlot(plotId);

      return sendSuccess(res, "Bombas de la parcela obtenidas correctamente", { data: pumps });
    } catch (error) {
      return sendError(res, 500, "Error al obtener bombas de la parcela", error);
    }
  };
}
