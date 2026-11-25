import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateDto } from "../middleware/validate-dto.middleware.js";
import { LoginDto, RegisterDto } from "../dto/create-user.dto.js";

const router = Router();

router.post("/register", validateDto(RegisterDto), AuthController.register);
router.post("/login", validateDto(LoginDto), AuthController.login);

export default router;