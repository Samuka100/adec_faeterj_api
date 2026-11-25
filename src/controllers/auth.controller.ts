import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserModel } from "../module/user.module.js";
import { UserRole } from "../enum/user-role.enum.js";
import { RegisterDto } from "../dto/create-user.dto.js";

interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

interface UserResponseData {
  _id: string;
  name?: string;
  email: string;
  role: UserRole;
}

export class AuthController {
  static async register(
    req: Request<{}, ApiResponse<UserResponseData>, RegisterDto>,
    res: Response<ApiResponse<UserResponseData>>
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const userExists = await UserModel.findOne({ email: email.toLowerCase() });

      if (userExists) {
        res.status(409).json({ success: false, message: "Usuário já cadastrado!" });
        return;
      }

      const hashPassword = await bcryptjs.hash(password, 10);

      const createUser = await UserModel.create({
        name,
        email,
        password: hashPassword,
        role: UserRole.USER,
      });

      console.log('usuário', createUser);
      
      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET não definido");
      }

      const token = jwt.sign(
        {
          _id: createUser._id.toString(),
          email: createUser.email,
          role: createUser.role,
        },
        secret,
        {
          expiresIn: process.env.TOKEN_EXPIRATION as SignOptions["expiresIn"],
        }
      );

      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: "Usuário cadastrado com sucesso!",
        data: {
          _id: createUser._id.toString(),
          name: createUser.name,
          email: createUser.email,
          role: createUser.role,
        },
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        res.status(409).json({ success: false, message: "Usuário já cadastrado!" });
        return;
      }

      console.error(error);
      res.status(500).json({ success: false, message: "Algo deu errado!" });
    }
  }
}