import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Servidor AgroRiego IA funcionando",
    status: "ok"
  });
});

export default router;
