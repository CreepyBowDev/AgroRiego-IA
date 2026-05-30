import express from "express";
import cors from "cors";

import  { healthRouter } from "./routes/healthRoutes.js";
import { usersRouter } from "./routes/usersRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
