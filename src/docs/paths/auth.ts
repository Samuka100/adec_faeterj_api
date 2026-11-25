import { body, error, ref, success } from "../helpers.js";

export const authPaths = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Cadastra um novo usuário",
      description:
        "Cria um usuário com role `user` e devolve o token JWT no cookie `token` (httpOnly).",
      ...body("RegisterDto"),
      responses: {
        201: success("Usuário cadastrado", ref("User")),
        400: error("ValidationError"),
        409: error("Conflict"),
        500: error("InternalError"),
      },
    },
  },
};
