import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('GET /health', () => {
  it('responde 200 com status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('devolve o x-request-id para rastrear a requisição nos logs', async () => {
    const res = await request(app).get('/health').set('x-request-id', 'abc-123');

    expect(res.headers['x-request-id']).toBe('abc-123');
  });
});
