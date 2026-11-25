import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/module/user.module.js', () => ({
  UserModel: { findOne: vi.fn(), create: vi.fn() },
}));

import { app } from '../src/app.js';
import { UserModel } from '../src/module/user.module.js';

const findOne = vi.mocked(UserModel.findOne);
const create = vi.mocked(UserModel.create);

describe('POST /auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ACCESS_TOKEN_SECRET  = 'segredo-de-teste';
    process.env.TOKEN_EXPIRATION = '1d';
  });

  it('cadastra usuário e devolve 201 com cookie', async () => {
    findOne.mockResolvedValue(null as never);
    create.mockResolvedValue({
      _id: { toString: () => 'id123' },
      name: 'João',
      email: 'a@b.com',
      role: 'user',
    } as never);

    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'João', email: 'A@B.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ email: 'a@b.com', role: 'user' });
    expect(res.headers['set-cookie']?.[0]).toContain('token=');
  });

  it('devolve 409 quando o e-mail já existe', async () => {
    findOne.mockResolvedValue({ _id: 'x' } as never);

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'a@b.com', password: '123456' });

    expect(res.status).toBe(409);
  });

  it('devolve 400 para e-mail inválido ou senha curta', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'x', password: '123' });

    expect(res.status).toBe(400);
  });

  it('rejeita role no body (400)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'a@b.com', password: '123456', role: 'admin' });

    expect(res.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });
});