import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserModel } from "../module/user.module.js";
import { UserRole } from "../enum/user-role.enum.js";
import { RegisterDto } from "../dto/create-user.dto.js";
import { LoginDto } from "../dto/login-user.dto.js";


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
  static async login(
  req: Request<{}, ApiResponse<UserResponseData>, LoginDto>,
  res: Response<ApiResponse<UserResponseData>>
): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    // Mesma mensagem para "usuário não existe" e "senha errada",
    // para não revelar quais emails estão cadastrados
    if (!user) {
      res.status(401).json({ success: false, message: "Email ou senha inválidos!" });
      return;
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ success: false, message: "Email ou senha inválidos!" });
      return;
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET não definido");
    }

    const token = jwt.sign(
      {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
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

    res.status(200).json({
      success: true,
      message: "Login realizado com sucesso!",
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Algo deu errado!" });
  }
}
}