import { Request, Response } from 'express';
import { CreateVeiculoDto } from '../dto/create-veiculo.dto.js';
import { VeiculoModel } from '../module/veiculo.module.js';

interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

interface VeiculoResponseData {
  _id: string;
  name?: string;
  modelo: string;
  ano: Date;
  cor: string;
  tipo: string;
  placa: string;
  preco: number;
}

export class VeiculoController {
    static async create(req: Request<{}, ApiResponse<VeiculoResponseData>, CreateVeiculoDto>,
    res: Response) {
        const { name, modelo, ano, cor, tipo, placa, preco } = req.body;

        const veiculoExists = await VeiculoModel.findOne({ placa: req.body.placa });
        if (veiculoExists) {
            return res.status(409).json({ success: false, message: 'Veículo já existe' });
        } 

        const veiculo = await VeiculoModel.create({ name, modelo, ano, cor, tipo, placa, preco });
        
        res.status(201).json({ success: true, message: 'Veículo criado com sucesso', data: veiculo });

    }
}

