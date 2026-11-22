import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const validateDto =
  <T extends object>(dtoClass: new () => T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto, {
      whitelist: true,             
      forbidNonWhitelisted: true, 
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: errors.flatMap((e) => Object.values(e.constraints ?? {})),
      });
    }

    req.body = dto;
    next();
  };

