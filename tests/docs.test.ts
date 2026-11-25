import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('Swagger', () => {
  it('GET /docs.json devolve a especificação OpenAPI', async () => {
    const res = await request(app).get('/docs.json');

    expect(res.status).toBe(200);
    expect(res.body.openapi).toMatch(/^3\./);
    expect(res.body.paths).toHaveProperty('/auth/register');
  });

  it('GET /docs/ serve a interface do Swagger UI', async () => {
    const res = await request(app).get('/docs/');

    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });
});
