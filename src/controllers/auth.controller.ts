import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserModel, UserRole } from "../models/user.model";
import { CreateUserDto } from "../dto/create-user.dto";

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
    async register(
    req: Request<{}, ApiResponse<UserResponseData>, CreateUserDto>,
    res: Response<ApiResponse<UserResponseData>>): 
    Promise<Response> {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
        return res
            .status(400)
            .json({ success: false, message: "Dados incompletos" });
        }

        const userExists = await UserModel.findOne({ email: email.toLowerCase() });

        if (userExists) {
        return res
            .status(409)
            .json({ success: false, message: "Usuário já cadastrado!" });
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const createUser = await UserModel.create({
        name,
        email,
        password: hashPassword,
        role: UserRole.USER, 
        });

        const secret = process.env.ACESS_TOKEN_SECRET;
        if (!secret) {
        throw new Error("ACESS_TOKEN_SECRET não definido");
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

        return res.status(201).json({
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
        return res
            .status(409)
            .json({ success: false, message: "Usuário já cadastrado!" });
        }

        console.error(error);
        return res
        .status(500)
        .json({ success: false, message: "Algo deu errado!" });
    }
}
}
