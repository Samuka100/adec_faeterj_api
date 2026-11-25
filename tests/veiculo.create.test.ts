import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/module/veiculo.module.js', () => ({
  VeiculoModel: { findOne: vi.fn(), create: vi.fn() },
}));

import { app } from '../src/app.js';
import { VeiculoModel } from '../src/module/veiculo.module.js';

const findOne = vi.mocked(VeiculoModel.findOne);
const create = vi.mocked(VeiculoModel.create);

const veiculo = {
  name: 'Toyota Corolla',
  modelo: 'XEi 2.0',
  ano: '2022-01-01',
  cor: 'Prata',
  tipo: 'Sedan',
  placa: 'ABC1D23',
  preco: 135000,
};

describe('POST /veiculo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cadastra veículo e devolve 201', async () => {
    findOne.mockResolvedValue(null as never);
    create.mockResolvedValue({
      _id: 'veiculo123',
      ...veiculo,
      ano: new Date(veiculo.ano),
      placa: 'abc1d23',
    } as never);

    const res = await request(app).post('/veiculo').send(veiculo);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      message: 'Veículo criado com sucesso',
      data: { _id: 'veiculo123', placa: 'abc1d23' },
    });
    expect(findOne).toHaveBeenCalledWith({ placa: 'abc1d23' });
    expect(create).toHaveBeenCalledWith({
      ...veiculo,
      ano: new Date(veiculo.ano),
      placa: 'abc1d23',
    });
  });

  it('devolve 409 quando a placa já está cadastrada', async () => {
    findOne.mockResolvedValue({ _id: 'existente' } as never);

    const res = await request(app).post('/veiculo').send(veiculo);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      success: false,
      message: 'Veículo já existe',
    });
    expect(create).not.toHaveBeenCalled();
  });

  it('devolve 400 quando a placa não tem sete caracteres', async () => {
    const res = await request(app)
      .post('/veiculo')
      .send({ ...veiculo, placa: 'ABC123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erro de validação');
    expect(findOne).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
});
