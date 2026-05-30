import express from "express";
import cors from "cors";

import healthRouter from "./routes/health.routes.js";
import usersRouter from "./routes/users.routes.js";
import plotsRouter from "./routes/plots.routes.js";
import cropsRouter from "./routes/crops.routes.js";
import pumpsRouter from "./routes/pumps.routes.js";
import weatherRouter from "./routes/weather.routes.js";
import recommendationsRouter from "./routes/recommendations.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/plots", plotsRouter);
app.use("/api/crops", cropsRouter);
app.use("/api/pumps", pumpsRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/recommendations", recommendationsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint no encontrado",
    error: "Ruta invalida"
  });
});
