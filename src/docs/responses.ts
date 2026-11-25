import { json, ref } from "./helpers.js";

// Respostas de erro comuns. Use nas rotas com error("NomeDaResposta").
export const responses = {
  ValidationError: {
    description: "Body inválido",
    ...json(ref("ValidationError")),
  },
  Unauthorized: {
    description: "Token ausente ou inválido",
    ...json(ref("ApiError"), { message: "Token inválido" }),
  },
  Conflict: {
    description: "Recurso já existe",
    ...json(ref("ApiError"), { success: false, message: "Usuário já cadastrado!" }),
  },
  InternalError: {
    description: "Erro interno",
    ...json(ref("ApiError"), { success: false, message: "Algo deu errado!" }),
  },
};
