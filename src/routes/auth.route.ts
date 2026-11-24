import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateDto } from "../middleware/validate-dto.middleware.js";
import { RegisterDto } from "../dto/create-user.dto.js";

const router = Router();

router.post("/register", validateDto(RegisterDto), AuthController.register);

export default router;