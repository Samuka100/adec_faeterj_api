// Atalhos para montar a especificação sem repetir a estrutura do OpenAPI

export const ref = (schemaName: string) => ({
  $ref: `#/components/schemas/${schemaName}`,
});

export const json = (schema: object, example?: unknown) => ({
  content: {
    "application/json": example === undefined ? { schema } : { schema, example },
  },
});

// Corpo da requisição a partir de um DTO
export const body = (dtoName: string) => ({
  requestBody: { required: true, ...json(ref(dtoName)) },
});

// Resposta de sucesso no padrão { success, message, data }
export const success = (description: string, dataSchema?: object) => ({
  description,
  ...json({
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string" },
      ...(dataSchema && { data: dataSchema }),
    },
  }),
});

// Reaproveita uma resposta de erro declarada em responses.ts
export const error = (name: string) => ({
  $ref: `#/components/responses/${name}`,
});
