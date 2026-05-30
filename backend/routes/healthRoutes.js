import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Servidor AgroRiego IA funcionando"
    });
});