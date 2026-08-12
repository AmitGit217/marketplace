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

describe("Sales (e2e)", () => {
  let app: INestApplication;
  let adminToken: string;

  let saleId: number;
  let vehicleId: string;
  let clientId: number;

  const userId = 1;

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

  it("create vehicle", async () => {
    const vehicle = {
      brand: "Toyota",
      model: "Corolla",
      type: "Sedan",
      manufactureYear: 2024,
      mileage: 1000,
      condition: "New",
      price: "25000.00",
      acquisitionDate: "2026-08-05T00:00:00.000Z",
      status: "Available",
      image: "https://example.com/car.jpg",
      color: "White",
    };

    const res = await request(app.getHttpServer())
      .post("/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(vehicle)
      .expect(201);

    vehicleId = res.body.id;

    expect(vehicleId).toBeDefined();
  });

  it("create sale", async () => {
    const sale = {
      saleDate: "2026-08-05T00:00:00.000Z",
      deliveryDate: "2026-08-06T00:00:00.000Z",
      paymentMethod: "Cash",
      userId,
      clientId,
      vehicleId,
    };

    const res = await request(app.getHttpServer())
      .post("/sales")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sale)
      .expect(201);

    saleId = res.body.id;

    expect(saleId).toBeDefined();
    expect(res.body.vehicleId).toBe(vehicleId);
    expect(res.body.userId).toBe(userId);
    expect(res.body.clientId).toBe(clientId);
  });

  it("get sales", async () => {
    const res = await request(app.getHttpServer())
      .get("/sales")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(
      res.body.some((sale: any) => sale.id === saleId),
    ).toBe(true);
  });

  it("get sale by id", async () => {
    const res = await request(app.getHttpServer())
      .get(`/sales/${saleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(saleId);
    expect(res.body.vehicleId).toBe(vehicleId);
    expect(res.body.userId).toBe(userId);
    expect(res.body.clientId).toBe(clientId);
  });

  it("delete sale", async () => {
    await request(app.getHttpServer())
      .delete(`/sales/${saleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
  });

  it("sale should not exist after delete", async () => {
    await request(app.getHttpServer())
      .get(`/sales/${saleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });
});