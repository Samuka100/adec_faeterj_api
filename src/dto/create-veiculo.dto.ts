import { Transform } from "class-transformer";
import { IsNotEmpty, MaxLength, Min, MinLength } from "class-validator";

export class CreateVeiculoDto {
  @IsNotEmpty({ message: "Nome é obrigatório" })
  @MaxLength(100, { message: "Nome deve ter no máximo 100 caracteres" })
  @Transform(({ value }) => value.trim())
  name: string;

  @IsNotEmpty({ message: "Modelo é obrigatório" })
  @MaxLength(100, { message: "Modelo deve ter no máximo 100 caracteres" })
  @Transform(({ value }) => value.trim())
  modelo: string;

  @IsNotEmpty({ message: "Ano é obrigatório" })
  @Transform(({ value }) => new Date(value))
  ano: Date;

  @IsNotEmpty({ message: "Cor é obrigatória" })
  @MaxLength(100, { message: "Cor deve ter no máximo 100 caracteres" })
  @Transform(({ value }) => value.trim())
  cor: string;

  @IsNotEmpty({ message: "Tipo é obrigatório" })
  @MaxLength(100, { message: "Tipo deve ter no máximo 100 caracteres" })
  @Transform(({ value }) => value.trim())
  tipo: string;

  @IsNotEmpty({ message: "Placa é obrigatória" })
  //minimo e maximo de 7 caracteres
  @MinLength(7, { message: "Placa deve ter no mínimo 7 caracteres" })
  @MaxLength(7, { message: "Placa deve ter no máximo 7 caracteres" })
  @Transform(({ value }) => value.trim().toLowerCase())
  placa: string;

  @IsNotEmpty({ message: "Preço é obrigatório" })
  @Min(0, { message: "Preço deve ser um valor positivo" })
  preco: number;
}

