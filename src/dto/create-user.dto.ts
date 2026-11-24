import { Transform } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { UserRole } from "../enum/user-role.enum.js";

export class CreateUserDto {
  @IsOptional()
  @IsString({ message: "Nome deve ser uma string" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name?: string;

  @IsNotEmpty({ message: "E-mail é obrigatório" })
  @IsEmail({}, { message: "E-mail inválido" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  email!: string;

  @IsNotEmpty({ message: "Senha é obrigatória" })
  @IsString()
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "Role deve ser 'user' ou 'admin'" })
  role?: UserRole;
}

export class RegisterDto {
  @IsOptional()
  @IsString({ message: "Nome deve ser uma string" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name?: string;

  @IsNotEmpty({ message: "E-mail é obrigatório" })
  @IsEmail({}, { message: "E-mail inválido" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  email!: string;

  @IsNotEmpty({ message: "Senha é obrigatória" })
  @IsString()
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password!: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "E-mail inválido" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "Role deve ser 'user' ou 'admin'" })
  role?: UserRole;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: "E-mail inválido" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}