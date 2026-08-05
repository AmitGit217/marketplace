import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { AppModule } from "../src/app.module";

describe("Sales (e2e)", () => {
  let app: INestApplication;
  let adminToken: string;
  let saleId: number;
  let vehicleId: string;

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

    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "admin@example.com",
        password: "admin123",
      })
      .expect(200);

    adminToken = res.body.token;
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
  });

  it("create sale", async () => {
    const sale = {
      saleDate: "2026-08-05T00:00:00.000Z",
      deliveryDate: "2026-08-06T00:00:00.000Z",
      paymentMethod: "Cash",
      userId,
      vehicleId,
    };

   const res = await request(app.getHttpServer())
  .post("/sales")
  .set("Authorization", `Bearer ${adminToken}`)
  .send(sale);
  saleId = res.body.id;

  expect(res.status).toBe(201);
  });

  it("get sales", async () => {
    const res = await request(app.getHttpServer())
      .get("/sales")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it("get sale by id", async () => {
    const res = await request(app.getHttpServer())
      .get(`/sales/${saleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(saleId);
    expect(res.body.vehicleId).toBe(vehicleId);
    expect(res.body.userId).toBe(userId);
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