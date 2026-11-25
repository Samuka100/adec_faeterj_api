// dto/login-user.dto.ts
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "Email é obrigatório" })
  @IsEmail({}, { message: "Email inválido" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  email: string;

  @IsNotEmpty({ message: "Senha é obrigatória" })
  @IsString({ message: "Senha inválida" })
  password: string;
}