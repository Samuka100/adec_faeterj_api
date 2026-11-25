import { json } from "../helpers.js";

export const healthPaths = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Verifica se a API está no ar",
      responses: {
        200: {
          description: "API funcionando",
          ...json({
            type: "object",
            properties: { status: { type: "string", example: "ok" } },
          }),
        },
      },
    },
  },
};
