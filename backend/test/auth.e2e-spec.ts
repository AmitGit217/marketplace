import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { randomUUID } from "crypto";
import request from "supertest";

import { AppModule } from "../src/app.module";

describe("Auth (e2e)", () => {
  let app: INestApplication;
  let token: string;

  const user = {
    name: "Test User",
    email: `test-${randomUUID()}@example.com`,
    password: "Password123!",
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("register", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(user)
      .expect(201);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("login", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.token).toBeDefined();
  });

  it("me", async () => {
    const res = await request(app.getHttpServer())
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.email).toBe(user.email);
  });
});