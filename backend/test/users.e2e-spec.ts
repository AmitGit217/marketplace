import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { AppModule } from "../src/app.module";

describe("Users (e2e)", () => {
  let app: INestApplication;
  let adminToken: string;
  let userId: number;

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

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "admin@example.com",
        password: "admin123",
      })
      .expect(200);

    adminToken = login.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

 it("create user", async () => {
  const unique = Date.now();

  const res = await request(app.getHttpServer())
    .post("/auth/register")
    .send({
      name: "Test User",
      email: `user${unique}@example.com`,
      password: "Password123!",
    })
    .expect(201);

  userId = res.body.user.id;

  expect(userId).toBeDefined();
  expect(res.body.user.email).toContain(`user${unique}@example.com`);
  expect(res.body.token).toBeDefined();
});

  it("get users", async () => {
    const res = await request(app.getHttpServer())
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((u: any) => u.id === userId)).toBe(true);
  });

  it("get user by id", async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(userId);
  });

  it("update user", async () => {
    const res = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated",
      })
      .expect(200);

    expect(res.body.name).toBe("Updated");
  });

  it("get user sales", async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}/sales`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it("delete user", async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
  });

  it("user should not exist after delete", async () => {
    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });
});