import { Plot } from "../db.js";
import { generateId } from "../utils/id.js";

const normalizePlot = (plot) => {
  if (!plot) return null;
  const plain = JSON.parse(JSON.stringify(plot));
  plain.id = plain._id;
  return plain;
};

export class plotsModel {
  static createPlot = async (payload) => {
    const plot = Plot.create({
      _id: generateId("plot"),
      user_id: "demo-user-1",
      name: payload.name,
      municipality: payload.municipality,
      community: payload.community,
      area_hectares: payload.area_hectares,
      soil_type: payload.soil_type,
      water_source: payload.water_source,
      created_at: new Date().toISOString()
    }).save();

    return normalizePlot(plot);
  };

  static getPlots = async () => {
    return Plot.find().map(normalizePlot);
  };

  static getPlotById = async (id) => {
    const plot = Plot.findOne(id);
    return normalizePlot(plot);
  };
}
