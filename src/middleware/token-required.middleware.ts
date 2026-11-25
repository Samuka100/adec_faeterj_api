import dotenv from "dotenv";
dotenv.config();

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../enum/user-role.enum.js";

interface TokenPayload extends JwtPayload {
  _id: string;
  email: string;
  role?: UserRole;
}

// middleware for login and control sensitive routes
export default (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Usuário não autorizado [!TOKEN]" });
    return;
  }

  const secret = process.env.ACCESS_TOKEN_SECRET ;

  if (!secret) {
    console.error("ACCESS_TOKEN_SECRET  não definido");
    res.status(500).json({ message: "Algo deu errado!" });
    return;
  }

  try {
    const data = jwt.verify(token, secret) as TokenPayload;
    const { _id, email, role } = data;

    req.userId = _id;
    req.userEmail = email;
    req.userRole = role || UserRole.USER;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};