import { Pump } from "../db.js";
import { generateId } from "../utils/id.js";

const normalizePump = (pump) => {
  if (!pump) return null;
  const plain = JSON.parse(JSON.stringify(pump));
  plain.id = plain._id;
  return plain;
};

export class pumpsModel {
  static createPump = async (payload) => {
    const pump = Pump.create({
      _id: generateId("pump"),
      plot_id: payload.plot_id,
      pump_type: payload.pump_type,
      power_kw: payload.power_kw,
      flow_liters_minute: payload.flow_liters_minute,
      cost_kwh: payload.cost_kwh,
      energy_source: payload.energy_source,
      created_at: new Date().toISOString()
    }).save();

    return normalizePump(pump);
  };

  static getPumps = async () => {
    return Pump.find().map(normalizePump);
  };

  static getPumpById = async (id) => {
    const pump = Pump.findOne(id);
    return normalizePump(pump);
  };

  static getPumpsByPlot = async (plotId) => {
    return Pump.find({ plot_id: plotId }).map(normalizePump);
  };
}
