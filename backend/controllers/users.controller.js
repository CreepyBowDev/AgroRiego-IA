import { userModel } from "../models/users.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class userController {
  static getUsers = async (req, res) => {
    try {
      const demoUser = await userModel.getUsersModel();
      return sendSuccess(res, "Productores obtenidos correctamente", { data: [demoUser] });
    } catch (error) {
      return sendError(res, 500, "Error al obtener productores", error);
    }
  };

  static getDemoUser = async (req, res) => {
    try {
      const demoUser = await userModel.getDemoUserModel();
      return sendSuccess(res, "Productor demo obtenido correctamente", { data: demoUser });
    } catch (error) {
      return sendError(res, 500, "Error al obtener productor demo", error);
    }
  };
}
