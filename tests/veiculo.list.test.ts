import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/module/veiculo.module.js', () => ({
  VeiculoModel: { find: vi.fn() },
}));

import { app } from '../src/app.js';
import { VeiculoModel } from '../src/module/veiculo.module.js';

const find = vi.mocked(VeiculoModel.find);

const veiculo = {
  _id: 'veiculo123',
  name: 'Toyota Corolla',
  modelo: 'XEi 2.0',
  ano: '2022-01-01T00:00:00.000Z',
  cor: 'Prata',
  tipo: 'Sedan',
  placa: 'abc1d23',
  preco: 135000,
};

describe('GET /veiculo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lista os veículos e devolve 200', async () => {
    find.mockResolvedValue([veiculo] as never);

    const res = await request(app).get('/veiculo');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: 'Veículos listados com sucesso',
      data: [{ _id: 'veiculo123', placa: 'abc1d23' }],
    });
    expect(find).toHaveBeenCalledTimes(1);
  });

  it('devolve 200 com lista vazia quando não há veículos', async () => {
    find.mockResolvedValue([] as never);

    const res = await request(app).get('/veiculo');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});