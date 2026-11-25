import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcryptjs from "bcryptjs";

vi.mock("../src/module/user.module.js", () => ({
  UserModel: { findOne: vi.fn(), create: vi.fn() },
}));

vi.mock("bcryptjs", () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
}));

import { app } from "../src/app.js";
import { UserModel } from "../src/module/user.module.js";

describe("POST /auth/login", () => {
  beforeEach(() => {
    process.env.ACCESS_TOKEN_SECRET = "segredo";
    process.env.TOKEN_EXPIRATION = "1d";
    vi.clearAllMocks();
  });

  it("deve retornar 200 com senha errada (PIPELINE DEVE FALHAR)", async () => {
    vi.mocked(UserModel.findOne).mockResolvedValue({
      _id: { toString: () => "abc123" },
      name: "Samuel",
      email: "samuel@email.com",
      password: "hash123",
      role: "USER",
    } as any);

    vi.mocked(bcryptjs.compare).mockResolvedValue(false as never); // senha errada

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "samuel@email.com", password: "errada" });

    // ERRO PROPOSITAL: o controller responde 401
    expect(response.status).toBe(200);
  });
});