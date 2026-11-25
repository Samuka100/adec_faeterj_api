import type { JsonObject } from "swagger-ui-express";
import { authPaths } from "./paths/auth.js";
import { healthPaths } from "./paths/health.js";
import { responses } from "./responses.js";
import { schemas } from "./schemas.js";
import { veiculoPaths } from "./paths/veiculo.js";

// Junta as partes da documentação. Para um módulo novo, crie paths/<modulo>.ts e adicione aqui.
export const openApiSpec: JsonObject = {
  openapi: "3.0.3",
  info: {
    title: "ADEC FAETERJ API",
    version: "1.0.0",
  },
  tags: [
    { name: "Health", description: "Status da API" },
    { name: "Auth", description: "Cadastro e autenticação de usuários" },
    { name: "Veículo", description: "Cadastro e gerenciamento de veículos" },
  ],
  paths: {
    ...healthPaths,
    ...authPaths,
    ...veiculoPaths,
  },
  components: {
    securitySchemes: {
      // Para rotas protegidas pelo tokenRequired, adicione: security: [{ cookieAuth: [] }]
      cookieAuth: { type: "apiKey", in: "cookie", name: "token" },
    },
    schemas,
    responses,
  },
};
