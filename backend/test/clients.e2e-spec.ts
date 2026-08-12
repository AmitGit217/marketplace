import {
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "@jest/globals";
import request from "supertest";

import { AppModule } from "../src/app.module";

describe("Client (e2e)", () => {
  let app: INestApplication;
  let adminToken: string;
  let clientId: number;

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

    // Login as admin
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "admin@example.com",
        password: "admin123",
      })
      .expect(200);

    adminToken = login.body.token;

    // Get an existing seeded clients
    const clients = await request(app.getHttpServer())
      .get("/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(clients.body)).toBe(true);
    expect(clients.body.length).toBeGreaterThan(0);

    clientId = clients.body[0].id;

    expect(clientId).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  it("get clients", async () => {
    const res = await request(app.getHttpServer())
      .get("/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(
      res.body.some((clients: any) => clients.id === clientId),
    ).toBe(true);
  });

  it("get clients by id", async () => {
    const res = await request(app.getHttpServer())
      .get(`/clients/${clientId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(clientId);
  });

  it("update clients", async () => {
    const res = await request(app.getHttpServer())
      .patch(`/clients/${clientId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated Client",
      })
      .expect(200);

    expect(res.body.id).toBe(clientId);
    expect(res.body.name).toBe("Updated Client");
  });

  it("get clients sales", async () => {
    const res = await request(app.getHttpServer())
      .get(`/clients/${clientId}/sales`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});