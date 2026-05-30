import { userModel } from "../models/usersModel.js";

export class userController {
    static getUsers = async (req, res) => {
        try {
            const { demoUser } = await userModel.getUsersModel();

            return res.json({
                message: "Productores obtenidos correctamente",
                demoUser
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener productores",
                error: error.message
            });
        }
    };

    static getDemoUser = async (req, res) => {
        try {
            const { demoUser } = await userModel.getDemoUserModel();

            return res.json({
                message: "Productor demo obtenido correctamente",
                demoUser
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener productor demo",
                error: error.message
            });
        }
    };
}

