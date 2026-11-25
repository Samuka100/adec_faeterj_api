import { Router } from "express";
import { CreateVeiculoDto } from "../dto/create-veiculo.dto.js";
import { VeiculoController } from "../controllers/veiculo.controller.js";
import { validateDto } from "../middleware/validate-dto.middleware.js";

const router = Router();

router.post("/", validateDto(CreateVeiculoDto), VeiculoController.create);
router.get("/", VeiculoController.list);

export default router;