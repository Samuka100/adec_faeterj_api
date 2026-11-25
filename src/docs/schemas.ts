import { IS_NOT_EMPTY } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { UserRole } from "../enum/user-role.enum.js";
import "../dto/create-user.dto.js";

const dtoSchemas = validationMetadatasToSchemas({
  refPointerPrefix: "#/components/schemas/",
  additionalConverters: {
    [IS_NOT_EMPTY]: {},
  },
});

for (const schema of Object.values(dtoSchemas)) {
  schema.additionalProperties = false;
}

const responseSchemas = {
  User: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6b06226f979c75e08249bea1" },
      name: { type: "string", example: "Arnaldo" },
      email: { type: "string", example: "arnaldo@gmail.com" },
      role: { type: "string", enum: Object.values(UserRole) },
    },
  },
  ApiError: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string" },
    },
  },
  ValidationError: {
    type: "object",
    properties: {
      message: { type: "string", example: "Erro de validação" },
      errors: {
        type: "array",
        items: { type: "string" },
        example: ["E-mail inválido", "A senha deve ter no mínimo 6 caracteres"],
      },
    },
  },
};

export const schemas = { ...dtoSchemas, ...responseSchemas };
