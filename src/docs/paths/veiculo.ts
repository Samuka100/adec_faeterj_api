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
    get: {
      tags: ["Veículo"],
      summary: "Lista os veículos cadastrados",
      description: "Devolve todos os veículos cadastrados.",
      responses: {
        200: success("Lista de veículos", { type: "array", items: ref("Veiculo") }),
        500: error("InternalError"),
      },
    },
  },
};
