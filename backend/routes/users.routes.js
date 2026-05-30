import { Router } from "express";
import { userController } from "../controllers/users.controller.js";

const router = Router();

router.get("/", userController.getUsers);
router.get("/demo", userController.getDemoUser);

export default router;
