import { body, error, ref, success } from "../helpers.js";

export const veiculoPaths = {
  "/veiculo": {
    post: {
      tags: ["Veículo"],
      summary: "Cria um novo veículo",
      description:
        "Cria um veículo e devolve os detalhes do veículo criado.",
      ...body("CreateVeiculoDto"),
      responses: {
        201: success("Veículo criado", ref("Veiculo")),
        400: error("ValidationError"),
        409: error("Conflict"),
        500: error("InternalError"),
      },
    },
  },
};
