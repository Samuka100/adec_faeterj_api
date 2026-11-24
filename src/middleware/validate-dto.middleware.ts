import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const validateDto =
  <T extends object>(dtoClass: new () => T) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      res.status(400).json({
        message: "Erro de validação",
        errors: errors.flatMap((e) => Object.values(e.constraints ?? {})),
      });
      return;
    }

    req.body = dto;
    next();
  };