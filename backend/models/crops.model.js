import { Crop } from "../db.js";
import { generateId } from "../utils/id.js";

const normalizeCrop = (crop) => {
  if (!crop) return null;
  const plain = JSON.parse(JSON.stringify(crop));
  plain.id = plain._id;
  return plain;
};

export class cropsModel {
  static createCrop = async (payload) => {
    const crop = Crop.create({
      _id: generateId("crop"),
      plot_id: payload.plot_id,
      crop_name: payload.crop_name,
      crop_stage: payload.crop_stage,
      sowing_date: payload.sowing_date,
      drought_sensitivity: payload.drought_sensitivity,
      created_at: new Date().toISOString()
    }).save();

    return normalizeCrop(crop);
  };

  static getCrops = async () => {
    return Crop.find().map(normalizeCrop);
  };

  static getCropById = async (id) => {
    const crop = Crop.findOne(id);
    return normalizeCrop(crop);
  };

  static getCropsByPlot = async (plotId) => {
    return Crop.find({ plot_id: plotId }).map(normalizeCrop);
  };
}
