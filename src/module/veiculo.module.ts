import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVeiculo {
  name: string;
  modelo: string;
  ano: Date;
  cor: string;
  tipo: string;
  placa: string;
  preco: number;
}

export interface IVeiculoDocument extends IVeiculo, Document {
  createdAt: Date;
  updatedAt: Date;
}

const veiculoSchema = new Schema<IVeiculoDocument>(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },

    modelo: {
      type: String,
      required: [true, "Modelo é obrigatório"],
      trim: true,
    },
    ano: {
      type: Date,
      required: [true, "Ano é obrigatório"],
    },
    cor: {
      type: String,
      required: [true, "Cor é obrigatória"],
      trim: true,
    },
    tipo: {
      type: String,
      required: [true, "Tipo é obrigatório"],
      trim: true,
    },
    placa: {
      type: String,
      required: [true, "Placa é obrigatória"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    preco: {
      type: Number,
      required: [true, "Preço é obrigatório"],
    },
  },
  { timestamps: true }
);

export const VeiculoModel: Model<IVeiculoDocument> =
  mongoose.models.Veiculo || mongoose.model<IVeiculoDocument>("Veiculo", veiculoSchema);
